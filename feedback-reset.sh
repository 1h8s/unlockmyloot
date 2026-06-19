#!/usr/bin/env bash
# Сброс счётчиков 👍/👎 (fb:all:up/down + голоса по IP).
# Один раз: wrangler secret put STATS_SECRET
# Использование: STATS_SECRET=... ./feedback-reset.sh
set -euo pipefail
API="${UML_API:-https://api.unlockmyloot.com}"
SECRET="${STATS_SECRET:?Задай STATS_SECRET (wrangler secret put STATS_SECRET)}"
RES=$(curl -fsS -X POST "$API/feedback/reset?secret=$SECRET")
echo "$RES" | python3 -m json.tool
