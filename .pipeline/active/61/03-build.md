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
- Lines after resize handler (1458+): added fullscreen logic:
  - Feature detection: checks for `requestFullscreen` or `webkitRequestFullscreen` support
  - `toggleFullscreen()`: enters/exits fullscreen, updates button icon (⛶ → ⎌)
  - Click handler on `fullscreenBtn` with `stopPropagation()` to prevent canvas click triggering jump
  - `fullscreenchange` event listener: recomputes scale, clears caches, resets game state when entering or exiting fullscreen
  - Safari support: separate `webkitfullscreenchange` handler for same logic
  - Fallback: hides button if browser lacks Fullscreen API support
