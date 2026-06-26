# Build Stage - Issue #46

## Changes Made

### js/game.js

1. Added base game constants `CAT_SIZE = 120` and `CAT_X = 150` before other constants
2. Added `computeScale()` function that:
   - Computes scale factor based on canvas client dimensions
   - Clamps scale between 0.375 and 1
   - Sets canvas width/height based on scale
   - Computes scaled values for all game constants
3. Added scaled game variables initialized to base values:
   - `catSize`, `catX`, `gravityVal`, `jumpStrengthVal`
   - `initialSpeed`, `maxSpeed`, `speedIncrement`
   - `collisionHPadding`, `obstacleHitboxInset`, `collisionVPadding`
   - `obstacleSizes`, `autojumpVTolerance`, `autojumpHMargin`
   - `grassSize`, `grassMinSpacing`, `grassMaxSpacing`
   - `collectibleSizes`
4. Updated `spawnObstacle()` to use scaled `obstacleSizes`
5. Updated `spawnCollectible()` to use scaled `collectibleSizes` and scaled Y position
6. Updated `update()` to use scaled variables:
   - `maxSpeed`, `initialSpeed`, `speedIncrement`
   - `gravityVal`, `catSize`
   - `autojumpVTolerance`, `autojumpHMargin`
   - `collisionVPadding`, `collisionHPadding`, `obstacleHitboxInset`
   - `jumpStrengthVal`

## Notes

- `computeScale()` function is defined but not yet called (would be called on window resize or game start)
- Game works correctly with `scale = 1` (default value)
- All lint checks pass
