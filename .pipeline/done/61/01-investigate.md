# Investigation: Full-screen functionality for the game

## Affected files

- `index.html` (line 215) — canvas element, needs fullscreen button added
- `style.css` (lines 396-477) — `.cat-game`, `.game-container`, `#gameCanvas`, `#startGameBtn` styles
- `js/game.js` — game logic, `computeScale()` (line 834), window resize handler (line 1448)

## Key findings

### Canvas sizing

- CSS: `max-width: 100%; height: auto;` makes canvas responsive to container width
- `computeScale()` (line 834): derives scale from `canvas.clientWidth/clientHeight`, then sets internal `canvas.width/height` and all game constants proportionally
- Canvas has fixed `width="800" height="550"` HTML attributes, but CSS constrains display size

### Scale computation flow

- Called in `startGame()` when `!scaleComputed` (line 934)
- Window resize handler (line 1448): only resets state when game is NOT running (`if scaleComputed && !gameRunning`)
- **Critical**: when game IS running, window resize does NOT recompute scale — so fullscreen during active gameplay needs explicit handling

### Button styling convention

- `#startGameBtn`: gold background (#d4af37), black text, bold, 1px border
- `.game-over-close`: transparent bg, positioned absolute in corner
- Decision: use styled button matching game UI (gold theme)

### Fullscreen API considerations

- Standard: `element.requestFullscreen()`, `document.exitFullscreen()`
- Event: `fullscreenchange` fires on both enter and exit (including Escape key)
- State check: `document.fullscreenElement` to detect current state
- Vendor prefixes (`webkitRequestFullscreen`) may be needed for Safari compatibility

### Implementation approach

- Button overlaid in top-right corner of canvas using CSS positioning
- On fullscreen enter: recompute scale, clear caches, reinit strips if game running
- On fullscreen exit: same recomputation to restore proper sizing
- Hide button if browser doesn't support Fullscreen API
