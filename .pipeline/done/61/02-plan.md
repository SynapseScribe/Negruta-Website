# Plan: Full-screen functionality for the game

## HTML changes (`index.html`)

- Wrap `<canvas id="gameCanvas">` in a `<div class="canvas-wrapper">` container (line 215)
- Add `<button type="button" id="fullscreenBtn">⛶</button>` inside `.canvas-wrapper`, positioned top-right corner

## CSS changes (`style.css`)

- `.canvas-wrapper { position: relative; display: inline-block; }` — enables absolute positioning of button over canvas
- `#fullscreenBtn`: styled matching game UI (gold #d4af37 background, black text, bold), positioned `absolute top right`, with padding and border-radius
- Dark theme support for the button
- In fullscreen mode: canvas fills viewport naturally via Fullscreen API

## JS changes (`js/game.js`)

1. Add element reference at top: `const fullscreenBtn = document.getElementById("fullscreenBtn");` (line 8 area)
2. Feature detection on load: hide button if browser lacks Fullscreen API support
3. `toggleFullscreen()` function: uses `canvas.requestFullscreen()` / `document.exitFullscreen()`, updates button icon (⛶ expand → ⎌ exit)
4. Click handler on `fullscreenBtn` calling `toggleFullscreen()`
5. `onFullscreenChange()` event listener on `document`:
   - On enter fullscreen: recompute scale, clear caches, reinit game state if running
   - On exit fullscreen: same recomputation logic (same as current window resize handler)

## Mobile/desktop considerations

- Fullscreen API works on both desktop and mobile browsers
- Button remains accessible in fullscreen for exiting
- Canvas auto-resizes via `computeScale()` which uses viewport-relative dimensions
