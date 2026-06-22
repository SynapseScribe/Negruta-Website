# Investigate - Issue #11

## Affected File
- `js/game.js:400`

## Problem
`Math.max(680, 180 - score)` always evaluates to 680 because `180 - score <= 180 < 680` for all `score >= 0`.

## Context
- `nextObstacleFrame` initialized to 100 (line 62, 117)
- `score` increments on passing obstacles (line 357) and collecting collectibles (line 371)
- `minGap` controls frames between obstacle spawns; lower = harder

## Browser/Responsive Impact
None - pure logic fix, no visual or layout changes.
