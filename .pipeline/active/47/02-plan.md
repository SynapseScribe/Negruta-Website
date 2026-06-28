# Plan: Batch grass rendering into pre-rendered ground strips

## Changes to `js/game.js`

### 1. New variables (after line 97, in GRASS section)

- `grassStripCanvas` — single offscreen canvas for the strip pattern (1600px wide base, scaled at runtime)
- `grassOffset` — scroll offset, starts at 0, decreases each frame

### 2. New function: `initGrassStrips()`

- Creates offscreen canvas: width = `Math.round(1600 * scale)`, height = `canvas.height`
- Populates with grass emojis using same logic as current `initGrass()`: random emoji, random size, spaced by `randomGrassGap()`
- Uses `renderCache.get(emoji, size)` for drawing each grass item onto the strip
- Text baseline: `"bottom"`, positioned at `canvas.height` (bottom of canvas)
- Called from `resetGame()` after scale is computed

### 3. Modify `resetGame()` (line 845)

- Replace `initGrass()` call with `initGrassStrips()`
- Initialize `grassOffset = 0`
- Remove `rightmostX` tracking (no longer needed for grass)

### 4. Modify `draw()` — grass section (lines 650-655)

- Remove the `for (const item of grassItems)` loop entirely
- Replace with: draw the strip twice at offset positions
  ```
  ctx.drawImage(grassStripCanvas, -grassOffset, 0);
  ctx.drawImage(grassStripCanvas, stripWidth - grassOffset, 0);
  ```

### 5. Modify `update()` — grass scrolling (lines 787-798)

- Remove the per-item scrolling loop entirely
- Replace with:
  ```
  grassOffset -= currentSpeed * dt;
  if (grassOffset <= -stripWidth) {
    grassOffset += stripWidth + stripWidth;
  }
  ```

### 6. Modify `computeScale()` (line 892)

- Add scaled strip width calculation: `grassStripWidth = Math.round(1600 * scale)`
- Regenerate grass strips after scale change (call `initGrassStrips()`)

### 7. Modify window resize handler (line 1124)

- Clear grass strip on resize (will be regenerated on next startGame)

### 8. Remove obsolete code

- Remove `grassItems` array declaration (line 75)
- Remove `rightmostX` tracking in `initGrass()` and `update()`
- The `grassSize`, `grassMinSpacing`, `grassMaxSpacing` constants still needed for strip generation

## Visual Impact

- Same grass emojis, same sizes, same spacing distribution
- Scrolling is smooth with no visible jump on wrap (2 identical strips overlap)
- 2 drawImage calls per frame instead of 15-20 — ~8x reduction in draw calls

## Mobile/Desktop Considerations

- Strip width scales with `scale` factor
- Works at any canvas resolution since strip is generated at runtime after scale computation
