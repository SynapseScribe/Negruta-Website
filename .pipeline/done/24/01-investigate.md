# Investigate: Cap localStorage high scores

## Files Examined

- `js/game.js:795-805` — `saveScore()` function
- `js/game.js:822-838` — `displayScores()` function

## Current Behavior

- `saveScore()` reads `catGameScores` from localStorage, pushes new score, saves back — no limit.
- `displayScores()` sorts by score descending, shows top 5 only.
- Array grows unbounded with each game played.

## Analysis

- Since `displayScores` only shows top 5, keeping more than ~50 scores is wasteful.
- Sorting the full array on every `displayScores()` call is O(n log n) where n grows without bound.
- No visual impact — the fix is purely data management.
