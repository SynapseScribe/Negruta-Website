# Spec: Standardize caching mechanism for all game objects via offscreen canvas

## Problem

Every frame, the `draw()` function in `game.js` performs expensive rendering operations:

1. Background gradient redrawn via `ctx.fillRect`
2. Moon emoji redrawn via `ctx.fillText`
3. All celestial objects (11-30 items) redrawn with blur filter and alpha
4. Obstacle emojis redrawn via `ctx.fillText` per frame
5. Collectible emojis redrawn via `ctx.fillText` per frame
6. Cat character redrawn via `ctx.fillText` per frame
7. Grass blades redrawn individually

These operations waste CPU/GPU cycles. Many elements are static or repeatable and could be cached.

## Scope

- Implement a per-object caching system using offscreen canvases
- Cache all game objects: obstacles, collectibles, cat, grass, celestials, background gradient, moon
- Support future additions without code changes (generic caching mechanism)
- Auto-regenerate cache on canvas resize (related to #46)

## Behavior

- Create a generic caching utility/module that handles offscreen canvas creation and management
- Each unique object type gets its own small offscreen canvas, reused across instances
- At game init, render each object type to its cached offscreen canvas once
- In `draw()`, replace individual renders with `ctx.drawImage(cachedCanvas, x, y)` calls
- On canvas resize, invalidate and rebuild affected caches

## Edge Cases

- If canvas resolution changes (related to #46), the cache must be regenerated
- Some objects may have variations (different obstacle types, different collectible types) — each variant needs its own cache entry
- Cat may have animation states — cache per state if applicable
- Grass blades may need batching consideration alongside per-blade caching

## Design Preferences

- No visual change — identical rendering output
- Generic, extensible caching mechanism for future game objects
- Minimal memory overhead (small offscreen canvases per object type)
- Reduced per-frame draw calls from many `fillText` operations to `drawImage` calls
