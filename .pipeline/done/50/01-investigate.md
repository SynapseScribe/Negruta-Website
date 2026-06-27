# Investigate - Issue #50

## Affected Files
- `js/game.js` - main game loop file

## Findings
- `requestAnimationFrame(update)` called at line 823 in the `update()` function
- `gameOver()` at line 1030 sets `gameRunning = false` but never cancels the animation frame
- `gameRunning` flag at line 41 guards the update loop but the RAF chain keeps scheduling frames
- `startGame()` at line 916 kicks off the loop via `update(performance.now())`
- `eslint.config.js` lists browser globals; `cancelAnimationFrame` was missing

## Browser Compatibility
- `cancelAnimationFrame` is supported in all modern browsers (same as `requestAnimationFrame`)
