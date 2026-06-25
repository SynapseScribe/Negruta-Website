## Plan - Issue #18: Touch Support for Mobile Game

### Changes
1. Add `touchstart` event listener on the canvas in `js/game.js` (after the `mousedown` handler at line 919).
2. The handler calls `e.preventDefault()` to prevent scroll/zoom on tap.
3. The handler uses `{ passive: false }` option to allow `preventDefault()`.
4. Jump logic mirrors the existing `mousedown` handler: check `gameRunning` and `jumpCount < maxJumpsBeforeReset`, then set `velocityY = jumpStrength` and increment `jumpCount`.

### Mobile Considerations
- `preventDefault()` prevents the canvas area from scrolling or zooming during gameplay.
- Multi-touch is handled naturally: the event fires once per touch, but we only need one jump per tap, so extra touches are effectively ignored.
- No conflict with keyboard/mouse inputs since all input types share the same game state variables (`velocityY`, `jumpCount`, `gameRunning`).

### Desktop Considerations
- No impact on desktop experience; `touchstart` simply won't fire on non-touch devices.
