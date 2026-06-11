/**
 * UnlockMyLoot — счётчик взломанных замков (Cloudflare Worker + KV).
 * GET  /count  -> {"opened": N}
 * POST /opened -> инкремент, {"opened": N+1}
 *
 * KV-ключ "opened" — не удалять и не менять namespace id в wrangler.toml.
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

async function readCount(env) {
  if (!env.COUNTER) throw new Error("COUNTER KV binding is missing");
  var raw = await env.COUNTER.get("opened");
  var n = parseInt(raw == null ? "0" : String(raw), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default {
  async fetch(req, env) {
    var origin = req.headers.get("Origin") || "";
    var cors = corsHeaders(origin);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    var url = new URL(req.url);

    try {
      if (url.pathname === "/count" && req.method === "GET") {
        var v = await readCount(env);
        return new Response(JSON.stringify({ opened: v }), { headers: cors });
      }

      if (url.pathname === "/opened" && req.method === "POST") {
        var cur = (await readCount(env)) + 1;
        await env.COUNTER.put("opened", String(cur));
        return new Response(JSON.stringify({ opened: cur }), { headers: cors });
      }
    } catch (err) {
      return new Response(JSON.stringify({
        error: "counter_failed",
        message: err && err.message ? err.message : "unknown"
      }), { status: 500, headers: cors });
    }

    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: cors });
  }
};
