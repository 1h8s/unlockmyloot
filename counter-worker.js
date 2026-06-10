/**
 * UnlockMyLoot — счётчик взломанных замков.
 * Вставь этот код в воркер unlockmyloot (Dashboard -> Workers & Pages ->
 * unlockmyloot -> Edit code), привяжи KV-неймспейс "unlockmyloot-counter"
 * под именем COUNTER и добавь кастомный домен api.unlockmyloot.com.
 *
 * GET  /count  -> {"opened": N}
 * POST /opened -> инкремент, {"opened": N+1}
 */
var ALLOWED = [
  "https://unlockmyloot.com",
  "https://www.unlockmyloot.com",
  "https://1h8s.github.io"
];

export default {
  async fetch(req, env) {
    var origin = req.headers.get("Origin") || "";
    var cors = {
      "Access-Control-Allow-Origin": ALLOWED.indexOf(origin) >= 0 ? origin : ALLOWED[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Cache-Control": "no-store",
      "Content-Type": "application/json"
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    var url = new URL(req.url);

    if (url.pathname === "/count" && req.method === "GET") {
      var v = parseInt((await env.COUNTER.get("opened")) || "0", 10);
      return new Response(JSON.stringify({ opened: v }), { headers: cors });
    }

    if (url.pathname === "/opened" && req.method === "POST") {
      var cur = parseInt((await env.COUNTER.get("opened")) || "0", 10) + 1;
      await env.COUNTER.put("opened", String(cur));
      return new Response(JSON.stringify({ opened: cur }), { headers: cors });
    }

    return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: cors });
  }
};
