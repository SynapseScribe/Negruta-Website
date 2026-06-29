# Summary: Full-screen functionality for the game (Issue #61)

## What was done

Added a full-screen toggle button to the cat game canvas, allowing players to expand the game to fill their entire screen. Moved score display from HTML into the canvas for cleaner UI. Converted pre-game UI (name field + start button) from DOM elements to canvas-drawn rendering, improving visual consistency across screen sizes and fullscreen mode.

## Files changed

- **`index.html`**: Wrapped canvas in `.canvas-wrapper` div, added fullscreen button (⛶ icon) positioned top-right, removed `<div class="game-info">Score: 0</div>` element
- **`style.css`**: Added styles for wrapper (relative positioning), button (gold theme, hover effect, absolute positioning), and hidden pre-game DOM elements. Removed `.game-info` CSS rules.
- **`js/game.js`**: Added element reference, `toggleFullscreen()` function, click handler with stopPropagation, `fullscreenchange`/`webkitfullscreenchange` event listeners for scale recomputation and cache clearing on enter/exit. Removed `scoreElement` variable and all DOM-based score updates. Score now drawn on canvas in top-left corner above Speed counter. Added `drawPreGameUI()` function for canvas-drawn pre-game UI with sky gradient, grass background, name field (with blinking cursor), and start button. Canvas click handler detects taps on name/start areas using coordinate hit-testing. Touch support added for mobile. Animation loop starts immediately on page load to render pre-game UI.

## Key design decisions

- Button icon changes: ⛶ (enter fullscreen) → ⎌ (exit fullscreen)
- Game resets when entering or exiting fullscreen to ensure proper scaling
- All render caches cleared on state change
- Safari webkit-prefixed API supported separately
- Button hidden if browser lacks Fullscreen API support
- Score display moved from HTML element to canvas drawing for cleaner UI and better fullscreen compatibility
- Pre-game UI drawn directly on canvas instead of DOM elements: ensures consistent appearance across screen sizes, works seamlessly in fullscreen mode, eliminates layout shift issues
- Hidden DOM elements (`#name-input`, `#start-btn`) kept for keyboard focus but visually hidden via CSS
- Canvas click handler uses coordinate-based hit testing to detect taps on name field and start button areas

## PR

https://github.com/SynapseScribe/Negruta-Website/pull/62
