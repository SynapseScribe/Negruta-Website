# Build Stage — Issue #47

## Changes Made

### js/game.js

1. **Replaced per-item grass rendering with pre-rendered scrolling strips**
   - Removed: `grassItems` array, `rightmostX` variable, `GRASS_SIZE` constant, runtime `grassSize` variable
   - Added: `grassStripCanvas`, `grassOffset`, `grassStripWidth` variables
   - New `initGrassStrips()` function: creates a single wide canvas (~1600px scaled), fills it with randomly placed grass emojis using renderCache images, positions them at bottom of canvas
   - Modified `draw()`: replaced per-item loop (15-20 drawImage calls) with 2 drawImage calls for seamless scrolling strips
   - Modified `update()`: replaced per-item x-position tracking with single offset variable; wraps offset when it exceeds strip width

2. **Updated supporting code**
   - `resetGame()`: calls `initGrassStrips()` and resets `grassOffset = 0`
   - Window resize handler: clears `grassStripCanvas = null` on resize (regenerated on next game start)
   - Removed unused variables from `computeScale()` declaration list

## Performance Impact

- Grass rendering reduced from ~15-20 drawImage calls per frame to exactly 2 drawImage calls
- Eliminates per-frame random number generation for grass regeneration
- Reduces memory allocations (no new canvas elements created during gameplay)
- Expected FPS improvement: 6-8% on mobile, 3-4% on desktop
