# Issue #14 - Plan Stage

## Changes

- File: `js/game.js:700`
- Remove `&& nextObstacleFrame > 0` from condition
- Before: `if (frameCount >= nextObstacleFrame && nextObstacleFrame > 0)`
- After: `if (frameCount >= nextObstacleFrame)`
- No visual impact, no mobile/desktop considerations (logic-only change)
