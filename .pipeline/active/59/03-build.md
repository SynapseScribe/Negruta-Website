@59/03-build.md

# Build: Parallax Scrolling Layers

## Changes Made (js/game.js)

### New Variables Added
- `bgGrassStripCanvas`, `bgGrassOffset`, `bgGrassStripWidth` — background grass layer
- `treeStripCanvas`, `treeOffset`, `treeStripWidth` — trees layer
- `moonX` — moon horizontal position (replaced strip-based approach)

### New Constants Added
- `BG_GRASS_EMOJIS = ["🌿", "☘️", "🍀", "🎍", "🪴"]`
- `TREE_EMOJIS = ["🌳", "🌲", "🌴", "🎋"]`
- Speed ratios: `FG_GRASS_SPEED_RATIO = 1`, `BG_GRASS_SPEED_RATIO = 0.7`, `TREE_SPEED_RATIO = 0.35`, `MOON_SPEED_RATIO = 0.2`

### New Functions Added
- `initBgGrassStrips()` — pre-renders bg-grass strip (3200*scale wide), positioned higher than fg-grass
- `initTreeStrips()` — pre-renders tree strip, uses opacity 0.6, anchored near ground line
- `initMoon()` — sets moonX position at canvas.width * 0.75 (replaced `initMoonStrip`)
- `initBgGrassCache()`, `initTreeCache()` — emoji render caches for bg-grass and tree pools

### Modified Functions
- `draw()` — new draw order: gradient → moon (direct fillText) → celestial → tree-strip → bg-grass-strip → fg-grass-strip → speed counter → cat → obstacles → collectibles
- `update()` — added offset updates for bgGrassOffset, treeOffset, and moonX scrolling
- `resetGame()` — calls initBgGrassStrips(), initTreeStrips(), initMoon() + resets all offsets
- `startGame()` — loading progress includes bg-grass cache and tree cache in grandTotal
- Resize handler (line 1278) — clears bgGrassStripCanvas, treeStripCanvas on resize

### Deviation from Plan
- Moon uses direct `ctx.fillText` draw instead of offscreen strip canvas. Reason: `renderCache.ensure()` forces ground-level positioning (`y = oc.height - 1`, `"alphabetic"` baseline), incompatible with sky-placed moon. Direct draw is simpler for a single-element layer and avoids unnecessary canvas overhead.
