# Spec: Fix `displayScores()` not called on page load

## Problem
`ensureDefaultHighScore()` is called on load (line 607), but `displayScores()` is never invoked after it. The high scores list (`#scoreList`) remains empty on initial page load. Scores only appear after the first game over.

## Location
`js/game.js:607`

## Fix
Add `displayScores();` after `ensureDefaultHighScore();` on line 607 so the leaderboard renders immediately.

## Impact
- Minimal code change (one line)
- Improves UX: users see the leaderboard from the start
- No visual or responsive impact
