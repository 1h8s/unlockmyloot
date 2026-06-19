#!/usr/bin/env bash
# Воронка UX UnlockMyLoot: сводка событий с API.
# Один раз: wrangler secret put STATS_SECRET
# Использование: STATS_SECRET=... ./events-watch.sh

set -euo pipefail

API="${COUNTER_API:-https://api.unlockmyloot.com}/events"
SECRET="${STATS_SECRET:?Задай STATS_SECRET (wrangler secret put STATS_SECRET)}"

curl -fsS "${API}?secret=${SECRET}" | python3 - <<'PY'
import json, sys
from datetime import datetime, timezone

d = json.load(sys.stdin)
opened = d.get("opened", 0)
today = d.get("today", "?")
tot = d.get("totals", {})
tc = d.get("today_counts", {})
yc = d.get("yesterday_counts", {})
rates = d.get("rates", {})
funnel = d.get("funnel", {})

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
