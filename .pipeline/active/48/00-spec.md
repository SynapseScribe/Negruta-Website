# Spec: Cache static background (gradient, moon, celestial) to offscreen canvas

## Problem
Every frame, the `draw()` function redraws:
1. Background gradient (`ctx.fillRect` with `bgGradient`)
2. Moon emoji via `ctx.fillText`
3. All celestial objects (11-30 items) with blur filter and alpha

These elements don't change position or appearance during gameplay. Redrawing them every frame wastes CPU/GPU cycles.

## Scope
- Create an offscreen canvas matching game canvas dimensions
- At game init (`initCelestial`), render the gradient, moon, and all celestial objects to this offscreen canvas once
- In `draw()`, replace the individual background draws with a single `ctx.drawImage(backgroundCanvas, 0, 0)`

## Behavior
- New function `initBackground()` that renders the static background layer to an offscreen canvas
- Called during `resetGame()` alongside `initGrass()` and `initCelestial()`
- `draw()` becomes: clear canvas -> draw cached background -> draw game entities (cat, obstacles, collectibles, grass, speed text)
- If celestial objects have any animation (they don't currently), they'd need to stay in the per-frame draw loop

## Edge Cases
- Background gradient is created once at module load (`bgGradient`) — ensure the offscreen canvas uses the same gradient
- Moon position is fixed at `(canvas.width - 150, 120)` — cache it
- Celestial objects are static (no movement) — safe to cache
- If canvas resolution changes (related to issue #46), the background cache must be regenerated

## Design Preferences
- No visual change — identical rendering output
- Single draw call instead of ~30+ for the background layer
