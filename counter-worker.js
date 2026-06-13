/**
 * UnlockMyLoot - счётчик взломанных замков.
 * GET  /count  -> {"opened": N}
 * POST /opened -> инкремент, {"opened": N+1}
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

  /* Удаляет копилку замков (lk:* каталог + pi:* подсказки). opened не трогает. */
  async purgeLockPool(secret) {
    if (this.env.PURGE_SECRET) {
      if (!secret || secret !== this.env.PURGE_SECRET) {
        return { status: 403, body: { error: "forbidden" } };
      }
    }
    var deleted = { lk: 0, pi: 0 };
    for (var pi = 0; pi < 2; pi++) {
      var prefix = pi === 0 ? "lk:" : "pi:";
      var cursor = undefined;
      while (true) {
        var page = await this.state.storage.list({ prefix: prefix, cursor: cursor, limit: 512 });
        var keys = [...page.keys()];
        for (var i = 0; i < keys.length; i++) await this.state.storage.delete(keys[i]);
        if (prefix === "lk:") deleted.lk += keys.length; else deleted.pi += keys.length;
        if (page.list_complete) break;
        cursor = page.cursor;
      }
    }
    return {
      status: 200,
      body: { ok: true, deleted: deleted, opened: await this.readCount() }
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
       уверенный (вводили >= 3 раз и >= 60% всех вводов этой расстановки). */
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
      if (!bestCode || bestC < 3 || bestC / sum <= 0.6) {
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
      (url.pathname === "/purge-locks" && req.method === "POST")
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
