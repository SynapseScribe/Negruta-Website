# Build - Issue #50

## Implementation

- Added `let animationFrameId = null;` declaration at js/game.js:42
- Changed `requestAnimationFrame(update)` to `animationFrameId = requestAnimationFrame(update)` at js/game.js:826
- Added `cancelAnimationFrame(animationFrameId)` and reset to `null` at the start of `gameOver()` at js/game.js:1032-1033
- Added `cancelAnimationFrame` to eslint globals in eslint.config.js

## Commits

- Single commit with all changes
