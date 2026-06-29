# Summary: Full-screen functionality for the game (Issue #61)

## What was done
Added a full-screen toggle button to the cat game canvas, allowing players to expand the game to fill their entire screen.

## Files changed
- **`index.html`**: Wrapped canvas in `.canvas-wrapper` div, added fullscreen button (⛶ icon) positioned top-right
- **`style.css`**: Added styles for wrapper (relative positioning) and button (gold theme, hover effect, absolute positioning)
- **`js/game.js`**: Added element reference, `toggleFullscreen()` function, click handler with stopPropagation, `fullscreenchange`/`webkitfullscreenchange` event listeners for scale recomputation and cache clearing on enter/exit

## Key design decisions
- Button icon changes: ⛶ (enter fullscreen) → ⎌ (exit fullscreen)
- Game resets when entering or exiting fullscreen to ensure proper scaling
- All render caches cleared on state change
- Safari webkit-prefixed API supported separately
- Button hidden if browser lacks Fullscreen API support

## PR
https://github.com/SynapseScribe/Negruta-Website/pull/62
