# Investigation: Batch grass rendering into pre-rendered ground strips

## Current Implementation

### Grass Data Structure (`js/game.js:75-97`)

- `grassItems` array stores `{x, emoji, size}` objects (~15-20 items)
- Constants: `GRASS_SIZE`, `grassSizes [30,40,50]`, spacing `[120,200]`
- 15 grass emojis defined in `GRASS_EMOJIS`

### Grass Init (`js/game.js:106-116`)

- `initGrass()` populates `grassItems` from x=-grassSize to canvas.width+grassSize
- Each item gets random emoji and size, spaced by `randomGrassGap()`
- Tracks `rightmostX` for recycling

### Grass Rendering (`js/game.js:650-655`)

- In `draw()`: loops over all `grassItems`, calls `renderCache.get()` then `ctx.drawImage()` per item
- 15-20 separate drawImage calls every frame — the performance bottleneck

### Grass Scrolling (`js/game.js:787-798`)

- In `update()`: decrements each `item.x` by `currentSpeed * dt`
- When item goes off-left-screen: reposition to `rightmostX + randomGrassGap()` with new random emoji/size
- This means grass items change identity over time — not a fixed pattern

### Grass Cache (`js/game.js:479-492`)

- `initGrassCache()` pre-renders all emoji×size combos to offscreen canvases
- Already used during loading screen

## Key Findings

1. **Variable naming inconsistency**: Code uses both upper/lower case variants (e.g., `grassSize` vs `GRASS_SIZE`, `catX` vs `CAT_X`). The computed runtime variables use lowercase (`grassSize`, `grassMinSpacing`, etc.)
2. **Grass items are dynamic**: When recycled off-screen, they get NEW random emoji/size. This means the grass pattern is not fixed — it evolves over time. A pre-rendered strip with fixed positions would lose this randomness over long play sessions.
3. **Solution for seamless strips**: Use 2 identical strips (same emoji placement). As offset scrolls, draw both side-by-side. When offset wraps, the visual is continuous since both strips are identical. For long sessions, regenerate strips periodically to maintain variety.

## Files Affected

- `js/game.js` — primary changes needed
