# Issue #14 - Build Stage

## Implementation

- Simplified condition in `js/game.js:700` from `frameCount >= nextObstacleFrame && nextObstacleFrame > 0` to `frameCount >= nextObstacleFrame`
- Branch: `pipeline/14-remove-redundant-nextObstacleFrame-check`
- PR: https://github.com/SynapseScribe/Negruta-Website/pull/30
