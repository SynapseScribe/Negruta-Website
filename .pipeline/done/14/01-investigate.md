# Issue #14 - Investigate Stage

## Analysis

- Located redundant condition at `js/game.js:700`
- `nextObstacleFrame` initialized to 100, only increases via `nextObstacleFrame = frameCount + minGap + Math.floor(Math.random() * 120)`
- `nextObstacleFrame > 0` is always true throughout game lifecycle
- No browser compatibility or responsive impact — pure code quality fix
