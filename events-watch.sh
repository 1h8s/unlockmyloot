#!/usr/bin/env bash
# Воронка UX UnlockMyLoot: сводка событий с API.
# Один раз: wrangler secret put STATS_SECRET
# Использование: STATS_SECRET=... ./events-watch.sh

set -euo pipefail

API="${COUNTER_API:-https://api.unlockmyloot.com}/events"
SECRET="${STATS_SECRET:?Задай STATS_SECRET (wrangler secret put STATS_SECRET)}"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

HTTP=$(curl -sS -o "$TMP" -w "%{http_code}" "${API}?secret=${SECRET}")
if [[ "$HTTP" != "200" ]]; then
  echo "HTTP $HTTP — не удалось получить статистику" >&2
  if [[ "$HTTP" == "403" ]]; then
    echo "Неверный STATS_SECRET (wrangler secret put STATS_SECRET)" >&2
  fi
  [[ -s "$TMP" ]] && cat "$TMP" >&2 && echo >&2
  exit 1
fi

python3 - "$TMP" <<'PY'
import json, sys
from datetime import datetime, timezone

with open(sys.argv[1], encoding="utf-8") as f:
    raw = f.read()
if not raw.strip():
    print("Пустой ответ API", file=sys.stderr)
    sys.exit(1)
try:
    d = json.loads(raw)
except json.JSONDecodeError:
    print("API вернул не JSON:", raw[:300], file=sys.stderr)
    sys.exit(1)
if d.get("error"):
    print("API:", d.get("error"), file=sys.stderr)
    sys.exit(1)

opened = d.get("opened", 0)
today = d.get("today", "?")
tot = d.get("totals", {})
tc = d.get("today_counts", {})
rates = d.get("rates", {})

def n(x):
    return f"{int(x):,}".replace(",", " ")

print(f"UnlockMyLoot · воронка · UTC {today}")
print(f"Взломано (solve_ok счётчик): {n(opened)}")
fb = d.get("feedback", {})
if fb:
    print(f"Оценка сайта: 👍 {n(fb.get('up', 0))}  👎 {n(fb.get('down', 0))}")
print("─" * 52)
print("Всего:")
for k in sorted(tot.keys()):
    print(f"  {k:22} {n(tot[k])}")
print("─" * 52)
print("Сегодня:")
if tc:
    for k in sorted(tc.keys()):
        print(f"  {k:22} {n(tc[k])}")
else:
    print("  (пока пусто)")
print("─" * 52)
print("Конверсии:")
for k, v in sorted(rates.items()):
    if v is None:
        print(f"  {k}: —")
    else:
        print(f"  {k}: {v}%")
print("─" * 52)
print("Последние события:")
for ev in d.get("recent", [])[-12:]:
    ts = ev.get("t", 0)
    try:
        t = datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%m-%d %H:%M")
    except Exception:
        t = "?"
    print(f"  {t}  {ev.get('e','?')}  [{ev.get('s','')}]")
PY
