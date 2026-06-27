# Plan - Issue #50

## Changes
1. `js/game.js` line ~41: Add `let animationFrameId = null;` next to `gameRunning`
2. `js/game.js` line ~823: Store RAF ID as `animationFrameId = requestAnimationFrame(update)`
3. `js/game.js` line ~1030: Cancel RAF in `gameOver()` before setting `gameRunning = false`
4. `eslint.config.js`: Add `cancelAnimationFrame` to browser globals

## Visual Impact
- None. No visible changes to the game.

## Mobile/Desktop
- Benefits mobile more (battery savings from not spinning idle frames).
