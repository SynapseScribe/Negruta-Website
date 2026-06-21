# Spec: Cap localStorage high scores to prevent unbounded growth

## Problem
`saveScore()` (line 494) appends scores to `localStorage` without any limit. Over time, the `catGameScores` array grows indefinitely, consuming localStorage quota and slowing down `displayScores()` which parses and sorts the full array each time.

## Location
`js/game.js:494-503`

## Fix
After pushing a new score, trim the stored array to a reasonable cap (e.g., keep only top 50 or last 100 entries). This keeps `displayScores()` fast and prevents localStorage exhaustion.

## Impact
- Prevents long-term localStorage bloat
- Improves `displayScores()` performance
- No visual or responsive impact
