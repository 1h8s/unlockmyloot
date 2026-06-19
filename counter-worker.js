/**
 * UnlockMyLoot - счётчик взломанных замков + воронка UX-событий.
 * GET  /count   -> {"opened": N}
 * POST /opened  -> инкремент, {"opened": N+1}
 * POST /events  -> {"sid":"...","events":[{"e":"solve_ok","t":...}]}
 * GET  /events?secret=... -> сводка воронки (STATS_SECRET в env воркера)
 *
 * Счётчик живёт в Durable Object (без дневного лимита KV put).
 * При первом запуске подтягивает значение из KV-ключа "opened".
 */
var ALLOWED = [
  "https://unlockmyloot.com",
  "https://www.unlockmyloot.com",
  "https://1h8s.github.io",
  "https://cdn.jsdelivr.net",
  "https://gcore.jsdelivr.net",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
];

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED.indexOf(origin) >= 0 ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Cache-Control": "no-store",
    "Content-Type": "application/json"
  };
}

// Коррекция пропущенных взломов (POST ломался из‑за лимита KV put), ~8 ч простоя.
// v1: нижняя оценка по темпу до поломки (~60/ч) → +480.
// v2: остаток до среднего между ~60/ч и ~360/ч → (210×8)−480 = +1200.
var OUTAGE_HOURS = 8;
var RATE_BEFORE = 60;
var RATE_NOW = 360;
var LOST_ESTIMATE = 480;
var LOST_REMAINDER = Math.round((RATE_BEFORE + RATE_NOW) / 2 * OUTAGE_HOURS) - LOST_ESTIMATE;
var RECONCILE_KEY = "reconcile_lost_v1";
var RECONCILE_KEY_V2 = "reconcile_lost_v2";
// v3: Workers free-tier 429 (error 1027), ~17:08–17:34. Последний успешный
// опрос 38 942; темп ~29/мин за час до простоя; ~26 мин простоя → ~747 взломов,
// из них ~66 успели записаться до полного отказа → +681.
var LOST_WORKERS_429 = 681;
var RECONCILE_KEY_V3 = "reconcile_lost_v3_workers429";
var PURGE_ABORT_KEY = "purge_aborted_v1";

var TRACK_EVENTS = {
  solve_ok: 1, solve_fail: 1, solve_empty: 1, solve_verify_err: 1,
  wizard_open: 1, wizard_step_none: 1, wizard_step_marked: 1,
  wizard_helper: 1, wizard_done: 1, wizard_done_partial: 1, wizard_reset: 1,
  suggest_show: 1, suggest_apply_ok: 1, suggest_apply_fail: 1, suggest_skip: 1,
  lock_url_ok: 1, lock_url_fail: 1,
  pins_edit: 1, mode_matrix: 1, mode_find: 1
};
var TRACK_RING_MAX = 80;
var TRACK_DAY_KEEP = 14;

function utcDayKey(ts) {
  var d = new Date(ts == null ? Date.now() : ts);
  var y = d.getUTCFullYear();
  var m = d.getUTCMonth() + 1;
  var day = d.getUTCDate();
  return "" + y + (m < 10 ? "0" : "") + m + (day < 10 ? "0" : "") + day;
}

function pct(num, den) {
  if (!den) return null;
  return Math.round((num / den) * 1000) / 10;
}

export class Counter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async maybeReconcile() {
    if (!(await this.state.storage.get(RECONCILE_KEY))) {
      var cur = await this.readCount();
      await this.state.storage.put("opened", cur + LOST_ESTIMATE);
      await this.state.storage.put(RECONCILE_KEY, LOST_ESTIMATE);
    }
    if (!(await this.state.storage.get(RECONCILE_KEY_V2))) {
      var cur2 = await this.readCount();
      await this.state.storage.put("opened", cur2 + LOST_REMAINDER);
      await this.state.storage.put(RECONCILE_KEY_V2, LOST_REMAINDER);
    }
    if (!(await this.state.storage.get(RECONCILE_KEY_V3))) {
      var cur3 = await this.readCount();
      await this.state.storage.put("opened", cur3 + LOST_WORKERS_429);
      await this.state.storage.put(RECONCILE_KEY_V3, LOST_WORKERS_429);
    }
    if (!(await this.state.storage.get(PURGE_ABORT_KEY))) {
      await this.state.storage.delete("purge:progress");
      await this.state.storage.put(PURGE_ABORT_KEY, true);
    }
  }

  async readCount() {
    var stored = await this.state.storage.get("opened");
    if (stored != null) return stored;

    var seeded = 0;
    if (this.env.COUNTER) {
      var raw = await this.env.COUNTER.get("opened");
      var n = parseInt(raw == null ? "0" : String(raw), 10);
      if (Number.isFinite(n) && n >= 0) seeded = n;
    }
    await this.state.storage.put("opened", seeded);
    return seeded;
  }

  async bumpEvent(name, ts) {
    if (!TRACK_EVENTS[name]) return;
    var day = utcDayKey(ts);
    var totalKey = "ev:all:" + name;
    var dayKey = "ev:d:" + day + ":" + name;
    var total = (await this.state.storage.get(totalKey)) || 0;
    var dayN = (await this.state.storage.get(dayKey)) || 0;
    await this.state.storage.put(totalKey, total + 1);
    await this.state.storage.put(dayKey, dayN + 1);
    await this.state.storage.put("ev:day:" + day, 1);
  }

  async pushRing(entry) {
    var ring = (await this.state.storage.get("ev:ring")) || [];
    ring.push(entry);
    if (ring.length > TRACK_RING_MAX) ring = ring.slice(-TRACK_RING_MAX);
    await this.state.storage.put("ev:ring", ring);
  }

  async recordEvents(sid, events) {
    if (!Array.isArray(events) || !events.length) {
      return { status: 400, body: { error: "bad_events" } };
    }
    if (events.length > 30) events = events.slice(0, 30);
    sid = String(sid || "").slice(0, 24);
    var n = 0;
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var name = ev && ev.e;
      if (!TRACK_EVENTS[name]) continue;
      var ts = +ev.t;
      if (!Number.isFinite(ts) || ts < 1) ts = Date.now();
      await this.bumpEvent(name, ts);
      await this.pushRing({ t: ts, e: name, s: sid ? sid.slice(0, 8) : "" });
      n++;
    }
    await this.pruneOldEventDays();
    return { status: 200, body: { ok: true, n: n } };
  }

  async pruneOldEventDays() {
    var keep = {};
    for (var i = 0; i < TRACK_DAY_KEEP; i++) {
      var d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      keep[utcDayKey(d.getTime())] = 1;
    }
    var del = [];
    var days = await this.state.storage.list({ prefix: "ev:day:" });
    days.forEach(function (_v, k) {
      var day = k.slice(7);
      if (!keep[day]) del.push(k);
    });
    var evDays = await this.state.storage.list({ prefix: "ev:d:" });
    evDays.forEach(function (_v2, k2) {
      var parts = k2.split(":");
      if (parts.length >= 3 && !keep[parts[2]]) del.push(k2);
    });
    for (var j = 0; j < del.length; j++) await this.state.storage.delete(del[j]);
  }

  async readEventCounts(day) {
    var out = {};
    var prefix = day ? ("ev:d:" + day + ":") : "ev:all:";
    var map = await this.state.storage.list({ prefix: prefix });
    map.forEach(function (n, k) {
      var name = day ? k.slice(prefix.length) : k.slice(7);
      if (TRACK_EVENTS[name]) out[name] = n;
    });
    return out;
  }

  async getEventsStats() {
    var today = utcDayKey();
    var yd = new Date();
    yd.setUTCDate(yd.getUTCDate() - 1);
    var yesterday = utcDayKey(yd.getTime());
    var totals = await this.readEventCounts(null);
    var todayCounts = await this.readEventCounts(today);
    var yesterdayCounts = await this.readEventCounts(yesterday);
    var ring = (await this.state.storage.get("ev:ring")) || [];
    var opened = await this.readCount();
    var wOpen = totals.wizard_open || 0;
    var wDone = (totals.wizard_done || 0) + (totals.wizard_done_partial || 0);
    return {
      opened: opened,
      today: today,
      yesterday: yesterday,
      totals: totals,
      today_counts: todayCounts,
      yesterday_counts: yesterdayCounts,
      funnel: {
        wizard_open: wOpen,
        wizard_step_none: totals.wizard_step_none || 0,
        wizard_step_marked: totals.wizard_step_marked || 0,
        wizard_done: totals.wizard_done || 0,
        wizard_done_partial: totals.wizard_done_partial || 0,
        suggest_show: totals.suggest_show || 0,
        suggest_apply_ok: totals.suggest_apply_ok || 0,
        solve_ok: totals.solve_ok || 0,
        solve_fail: totals.solve_fail || 0
      },
      rates: {
        wizard_finish_pct: pct(wDone, wOpen),
        solve_ok_per_wizard_pct: pct(totals.solve_ok || 0, wOpen),
        solve_fail_per_try_pct: pct(
          totals.solve_fail || 0,
          (totals.solve_ok || 0) + (totals.solve_fail || 0) + (totals.solve_empty || 0)
        ),
        suggest_apply_per_show_pct: pct(totals.suggest_apply_ok || 0, totals.suggest_show || 0),
        step_none_per_open_pct: pct(totals.wizard_step_none || 0, wOpen)
      },
      recent: ring.slice(-30)
    };
  }

  /* Удаляет копилку замков (lk:* каталог + pi:* подсказки). opened не трогает. */
  async purgeLockPool(secret) {
    if (!secret || secret !== this.env.PURGE_SECRET) {
      return { status: 403, body: { error: "forbidden" } };
    }
    var progressKey = "purge:progress";
    var progress = await this.state.storage.get(progressKey);
    if (!progress) {
      progress = { prefix: "lk:", cursor: undefined, deleted: { lk: 0, pi: 0 } };
    }
    var page = await this.state.storage.list({
      prefix: progress.prefix,
      cursor: progress.cursor,
      limit: 128
    });
    var keys = [...page.keys()];
    for (var i = 0; i < keys.length; i++) await this.state.storage.delete(keys[i]);
    if (progress.prefix === "lk:") progress.deleted.lk += keys.length;
    else progress.deleted.pi += keys.length;

    if (!page.list_complete) {
      progress.cursor = page.cursor;
      await this.state.storage.put(progressKey, progress);
      return {
        status: 202,
        body: {
          ok: false,
          partial: true,
          deleted: progress.deleted,
          prefix: progress.prefix,
          opened: await this.readCount()
        }
      };
    }

    if (progress.prefix === "lk:") {
      progress.prefix = "pi:";
      progress.cursor = undefined;
      await this.state.storage.put(progressKey, progress);
      return {
        status: 202,
        body: {
          ok: false,
          partial: true,
          deleted: progress.deleted,
          prefix: "pi:",
          opened: await this.readCount()
        }
      };
    }

    await this.state.storage.delete(progressKey);
    return {
      status: 200,
      body: { ok: true, deleted: progress.deleted, opened: await this.readCount() }
    };
  }

  async fetch(req) {
    await this.maybeReconcile();
    var url = new URL(req.url);
    var path = url.pathname;

    if (path === "/count" && req.method === "GET") {
      var v = await this.readCount();
      return new Response(JSON.stringify({ opened: v }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/opened" && req.method === "POST") {
      var cur = (await this.readCount()) + 1;
      await this.state.storage.put("opened", cur);
      return new Response(JSON.stringify({ opened: cur }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // копилка замков: код конфигурации -> счётчик вводов.
    // Дополнительно индекс по штифтам (pins=n.p1p2...) для подсказок связей.
    if (path === "/lock" && req.method === "POST") {
      var code = url.searchParams.get("code") || "";
      if (!/^[A-Za-z0-9_.-]{4,64}$/.test(code)) {
        return new Response(JSON.stringify({ error: "bad_code" }), { status: 400 });
      }
      // idxonly=1: только индекс по штифтам, без тэлли в каталоге (вторая
      // расстановка того же замка - чтобы не считать один взлом дважды).
      var idxOnly = url.searchParams.get("idxonly") === "1";
      if (!idxOnly) {
        var key = "lk:" + code;
        var rec = (await this.state.storage.get(key)) || { c: 0, f: Date.now() };
        rec.c += 1;
        rec.l = Date.now();
        await this.state.storage.put(key, rec);
      }

      var pinsKey = url.searchParams.get("pins") || "";
      if (/^[3-8]\.[1-7]{3,8}$/.test(pinsKey)) {
        var pk = "pi:" + pinsKey;
        var idx = (await this.state.storage.get(pk)) || {};
        idx[code] = (idx[code] || 0) + 1;
        await this.state.storage.put(pk, idx);
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/locks" && req.method === "GET") {
      var map = await this.state.storage.list({ prefix: "lk:" });
      var out = [];
      map.forEach(function (rec2, k) {
        out.push({ code: k.slice(3), count: rec2.c, first: rec2.f, last: rec2.l });
      });
      out.sort(function (a, b) { return b.count - a.count; });
      var lim = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "100", 10) || 100));
      return new Response(JSON.stringify({ total: out.length, locks: out.slice(0, lim) }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    /* Подсказка связей: по штифтам отдаём вариант-лидер, только если он
       уверенный. Одинаковые штифты часто бывают у разных замков, поэтому лучше
       не подсказать ничего, чем подставить чужие связи. */
    if (path === "/suggest" && req.method === "GET") {
      var qp = url.searchParams.get("pins") || "";
      if (!/^[3-8]\.[1-7]{3,8}$/.test(qp)) {
        return new Response(JSON.stringify({ found: false }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      var idx2 = (await this.state.storage.get("pi:" + qp)) || {};
      var bestCode = null, bestC = 0, sum = 0;
      for (var c2 in idx2) {
        sum += idx2[c2];
        if (idx2[c2] > bestC) { bestC = idx2[c2]; bestCode = c2; }
      }
      if (!bestCode || bestC < 5 || bestC / sum < 0.85) {
        return new Response(JSON.stringify({ found: false }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ found: true, code: bestCode, count: bestC }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/purge-locks" && req.method === "POST") {
      var purgeSecret = req.headers.get("X-Purge-Secret") || url.searchParams.get("secret") || "";
      var purge = await this.purgeLockPool(purgeSecret);
      return new Response(JSON.stringify(purge.body), {
        status: purge.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/events" && req.method === "POST") {
      var body = {};
      try { body = await req.json(); } catch (e) {}
      var rec = await this.recordEvents(body.sid, body.events);
      return new Response(JSON.stringify(rec.body), {
        status: rec.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/events" && req.method === "GET") {
      var statsSecret = url.searchParams.get("secret") || req.headers.get("X-Stats-Secret") || "";
      if (!this.env.STATS_SECRET || statsSecret !== this.env.STATS_SECRET) {
        return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
      }
      var stats = await this.getEventsStats();
      return new Response(JSON.stringify(stats), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });
  }
}

export default {
  async fetch(req, env) {
    var origin = req.headers.get("Origin") || "";
    var cors = corsHeaders(origin);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    var url = new URL(req.url);

    if (
      (url.pathname === "/count" && req.method === "GET") ||
      (url.pathname === "/opened" && req.method === "POST") ||
      (url.pathname === "/lock" && req.method === "POST") ||
      (url.pathname === "/locks" && req.method === "GET") ||
      (url.pathname === "/suggest" && req.method === "GET") ||
      (url.pathname === "/purge-locks" && req.method === "POST") ||
      (url.pathname === "/events" && (req.method === "GET" || req.method === "POST"))
    ) {
      try {
        if (!env.COUNTER_DO) throw new Error("COUNTER_DO binding is missing");
        var id = env.COUNTER_DO.idFromName("global");
        var stub = env.COUNTER_DO.get(id);
        var innerReq = new Request(req.url, { method: req.method, headers: req.headers });
        var inner = await stub.fetch(innerReq);
        var body = await inner.text();
        return new Response(body, { status: inner.status, headers: cors });
      } catch (err) {
        return new Response(JSON.stringify({
          error: "counter_failed",
          message: err && err.message ? err.message : "unknown"
        }), { status: 500, headers: cors });
      }
    }

    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: cors });
  }
};
