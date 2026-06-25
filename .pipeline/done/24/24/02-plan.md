# Plan: Cap localStorage high scores

## Strategy

Keep only the top 50 scores by score value (descending). This is a high-score table, so retaining the best scores makes the most sense.

## Changes

- File: `js/game.js`
- Function: `saveScore()` (line 795-805)
- Change: After `scores.push(newScore)`, add `scores.sort((a, b) => b.score - a.score).slice(0, 50)` before saving to localStorage.

## Visual Impact

None. `displayScores()` already shows only top 5. The cap just prevents storage bloat.

## Edge Cases

- If fewer than 50 scores exist, `slice(0, 50)` returns all of them (no change in behavior).
- Default high score ("Negruta": 500) is unaffected unless it falls outside top 50.
