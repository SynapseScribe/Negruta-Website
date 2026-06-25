# Build: Cap localStorage high scores

## Changes Made

- File: `js/game.js` (lines 801-805)
- After pushing new score: sort array by score descending, then trim to 50 entries max.
- If array has fewer than 50 entries, `slice(0, 50)` returns all entries (no behavior change).
