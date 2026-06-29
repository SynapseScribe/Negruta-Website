# Build: Full-screen functionality for the game

## Changes made

### `index.html` (line 215)

- Wrapped `<canvas id="gameCanvas">` in `<div class="canvas-wrapper">`
- Added `<button type="button" id="fullscreenBtn">⛶</button>` inside wrapper, positioned top-right of canvas

### `style.css` (after line 442)

- Added `.canvas-wrapper { position: relative; display: inline-block; }` for button overlay positioning
- Added `#fullscreenBtn` styles: absolute positioned top-right, gold theme (#d4af37), matching game UI button style
- Added `#fullscreenBtn:hover` with lighter gold background

### `js/game.js`

- Line 9: added `const fullscreenBtn = document.getElementById("fullscreenBtn");` element reference
- Removed `const scoreElement = document.getElementById("gameScore")` (no longer needed, score drawn on canvas)
- Lines after resize handler (1458+): added fullscreen logic:
  - Feature detection: checks for `requestFullscreen` or `webkitRequestFullscreen` support
  - `toggleFullscreen()`: enters/exits fullscreen, updates button icon (⛶ → ⎌)
  - Click handler on `fullscreenBtn` with `stopPropagation()` to prevent canvas click triggering jump
  - `fullscreenchange` event listener: recomputes scale, clears caches, resets game state when entering or exiting fullscreen
  - Safari support: separate `webkitfullscreenchange` handler for same logic
  - Fallback: hides button if browser lacks Fullscreen API support
- Score display moved to canvas: added score drawing in top-left corner (above Speed) using `ctx.fillText`, removed DOM-based score updates (`scoreElement.textContent`)
- Added `drawPreGameUI()` function: renders pre-game UI directly on canvas with sky gradient + grass background, name field (with blinking cursor), and start button
- Added coordinate tracking variables for hit testing: `nameFieldX/Y/W/H` and `startBtnX/Y/W/H`, computed in `computeScale()` based on scaled dimensions
- Canvas click handler (`mousedown`): detects clicks on name field or start button using coordinate-based hit testing; focuses hidden input or starts game accordingly
- Touch support for mobile: added pre-game UI handling to existing `touchstart` listener (same hit-testing logic)
- Enter key handler: preserved on hidden input for keyboard-driven game start
- Animation loop: added initial `requestAnimationFrame(update)` at end of file, so canvas-drawn pre-game UI renders immediately on page load

### `style.css` (after line 478)

- Added CSS to hide pre-game DOM elements while keeping them functional for keyboard focus: `#name-input, #start-btn { position: absolute; left: -9999px; opacity: 0; pointer-events: none; }`
