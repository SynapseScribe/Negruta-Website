# Issue #14 - Code quality: Redundant nextObstacleFrame > 0 check

## Description
At line 397:
```
if (frameCount >= nextObstacleFrame && nextObstacleFrame > 0) {
```
The `nextObstacleFrame > 0` condition is always true. It starts at 100 and only increases.

## Impact
No functional impact, but redundant condition clutters the code.

## Location
- `js/game.js:397` - redundant guard condition

## Decision
Straightforward removal.

## Fix
Remove the `&& nextObstacleFrame > 0` part.
