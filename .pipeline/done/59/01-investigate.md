@59/01-investigate.md

# Investigation: Parallax Scrolling Layers

## Affected Files

- `js/game.js` — main game logic, all rendering and state management (1133 lines)

## Current Architecture

### Grass Rendering (lines 74-128)

- Single pre-rendered strip: `grassStripCanvas`, `grassOffset`, `grassStripWidth`
- Uses `GRASS_EMOJIS` pool (15 emojis), sizes [30, 40, 50] scaled by device
- Strip width: 3200 \* scale
- Drawn with 2 drawImage calls in `draw()` line 660-663
- Offset updated per frame: `grassOffset += currentSpeed * dt` (line 796)

### Moon (lines 625-629)

- Drawn directly via `ctx.fillText("🌖", canvas.width - 150, 120)` in draw()
- NOT part of any scrolling layer — static position every frame
- No offset tracking for moon movement

### Celestial Objects (lines 832-844)

- Array of objects with x/y/size/emoji properties
- Drawn with blur(0.5px) and globalAlpha=0.2 in draw() lines 632-641
- Static positions — don't scroll at all

### Draw Order (lines 620-685)

Current: gradient → moon → celestial → speed counter → cat → grass → obstacles → collectibles

### Reset/Init Flow

- `resetGame()` line 846: resets state, calls `initGrassStrips()`, `initCelestial()`
- `startGame()` lines 922-970: loading screen + cache init for obstacles, collectibles, grass
- Resize handler (line 1124): clears `grassStripCanvas` when window resizes

## What Needs to Change

1. Add 3 new parallax layers (bg-grass, trees, moon) alongside existing fg-grass
2. Each layer needs: offscreen canvas, offset variable, speed ratio, strip init function
3. Moon moves from direct fillText to its own scrolling strip
4. Celestial objects removed from draw() per spec ("No stars or clouds — moon only")
5. Draw order updated: gradient → moon-strip → tree-strip → bg-grass-strip → fg-grass-strip → speed counter → cat → obstacles → collectibles
6. Update `resetGame()` to init all 4 strips
7. Update `startGame()` loading progress for new cache items
8. Update resize handler to clear all strip canvases
