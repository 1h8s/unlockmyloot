/**
 * UnlockMyLoot — счётчик взломанных замков.
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

export class Counter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
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

  async fetch(req) {
    if (req.method === "GET") {
      var v = await this.readCount();
      return new Response(JSON.stringify({ opened: v }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (req.method === "POST") {
      var cur = (await this.readCount()) + 1;
      await this.state.storage.put("opened", cur);
      return new Response(JSON.stringify({ opened: cur }), {
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
      (url.pathname === "/opened" && req.method === "POST")
    ) {
      try {
        if (!env.COUNTER_DO) throw new Error("COUNTER_DO binding is missing");
        var id = env.COUNTER_DO.idFromName("global");
        var stub = env.COUNTER_DO.get(id);
        var inner = await stub.fetch(new Request(req.url, { method: req.method }));
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
