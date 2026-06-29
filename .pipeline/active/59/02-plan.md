@59/02-plan.md

# Plan: Parallax Scrolling Layers

## Constants (add after line 97)
```
const BG_GRASS_EMOJIS = ["🌿", "☘️", "🍀", "🎍", "🪴"];
const TREE_EMOJIS = ["🌳", "🌲", "🌴", "🎋"];
```

## Speed Ratios (add after line 79)
```
const FG_GRASS_SPEED_RATIO = 1.0;
const BG_GRASS_SPEED_RATIO = 0.7;
const TREE_SPEED_RATIO = 0.4;
const MOON_SPEED_RATIO = 0.2;
```

## New Variables (add after line 76)
- `bgGrassStripCanvas`, `bgGrassOffset`, `bgGrassStripWidth` — background grass layer
- `treeStripCanvas`, `treeOffset`, `treeStripWidth` — trees layer
- `moonStripCanvas`, `moonOffset`, `moonStripWidth` — moon layer

## New Functions

### `initBgGrassStrips()` (after line 128)
Same structure as `initGrassStrips()` but:
- Uses `BG_GRASS_EMOJIS` pool
- Positioned slightly higher on canvas (y = canvas.height - img.height - 20*scale)
- Writes to `bgGrassStripCanvas`, sets `bgGrassStripWidth`

### `initTreeStrips()` (after bg-grass function)
- Uses `TREE_EMOJIS` pool, sizes [60, 80, 100] scaled
- Anchored near ground line (y = canvas.height - img.height)
- Applied opacity: ctx.globalAlpha = 0.6 before drawing emojis
- Writes to `treeStripCanvas`, sets `treeStripWidth`

### `initMoonStrips()` (after tree function)
- Single moon emoji "🌖" at size 80*scale
- Positioned in upper canvas area (y = 120 * scale)
- Spaced across strip width for seamless looping
- Writes to `moonStripCanvas`, sets `moonStripWidth`

### `initBgGrassCache()`, `initTreeCache()` (after line 503)
Same pattern as existing `initGrassCache()` for their respective emoji pools.

## Modified Functions

### `draw()` — new draw order (lines 620-685)
1. Background gradient (unchanged)
2. Moon strip: `ctx.drawImage(moonStripCanvas, -moonOffset, 0)` × 2 strips
3. Tree strip: save/restore with globalAlpha=0.6, drawImage × 2 strips
4. BG grass strip: drawImage × 2 strips
5. FG grass strip (existing code unchanged)
6. Speed counter (unchanged)
7. Cat (unchanged)
8. Obstacles (unchanged)
9. Collectibles (unchanged)
- REMOVED: direct moon fillText (line 625-629), celestial objects drawing (lines 632-641)

### `update()` — offset updates (after line 799)
Add after grass scrolling:
```
bgGrassOffset += currentSpeed * BG_GRASS_SPEED_RATIO * dt;
if (bgGrassOffset >= bgGrassStripWidth) bgGrassOffset -= bgGrassStripWidth;

treeOffset += currentSpeed * TREE_SPEED_RATIO * dt;
if (treeOffset >= treeStripWidth) treeOffset -= treeStripWidth;

moonOffset += currentSpeed * MOON_SPEED_RATIO * dt;
if (moonOffset >= moonStripWidth) moonOffset -= moonStripWidth;
```

### `resetGame()` — init all strips (line 846)
Add calls: `initBgGrassStrips()`, `initTreeStrips()`, `initMoonStrips()`
Reset offsets: `bgGrassOffset = 0`, `treeOffset = 0`, `moonOffset = 0`
Remove: `initCelestial()` call (no longer needed)

### `startGame()` — loading progress (lines 922-970)
Add bg-grass and tree cache to total count and progress tracking.

### Resize handler (line 1124)
Clear all strip canvases: `bgGrassStripCanvas`, `treeStripCanvas`, `moonStripCanvas` = null

## Performance Impact
- Current: 2 drawImage/frame (fg-grass only) + 1 fillText (moon) + ~15 fillText (celestial)
- After: 8 drawImage/frame (4 layers × 2 strips) — pre-rendered, zero per-frame emoji processing
- Net improvement: eliminates 16+ per-frame fillText calls
