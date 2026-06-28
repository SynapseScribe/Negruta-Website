# Investigate: Standardize caching mechanism for all game objects

## Current State Analysis

### Already Cached (per-emoji+size offscreen canvas)

| Object       | Cache Map                           | Init Location                       | Draw Method            | Status    |
| ------------ | ----------------------------------- | ----------------------------------- | ---------------------- | --------- |
| Grass        | `emojiCache` (line 70)              | `buildGrassEmojiCache()` (line 72)  | `drawImage` (line 661) | ✅ Cached |
| Obstacles    | `emojiRenderCache` (line 369)       | `initEmojiCache()` (line 370)       | `drawImage` (line 671) | ✅ Cached |
| Collectibles | `collectibleRenderCache` (line 472) | `initCollectibleCache()` (line 473) | `drawImage` (line 683) | ✅ Cached |

### Not Cached (drawn every frame via fillText)

| Object              | Draw Location | Issue                                                                          |
| ------------------- | ------------- | ------------------------------------------------------------------------------ |
| Background gradient | line 618-620  | `createBackgroundGradient()` called every frame, new gradient object each time |
| Moon                | line 623-627  | `ctx.fillText("🌖", ...)` every frame                                          |
| Celestials          | line 629-638  | Loop with `fillText`, blur filter, alpha every frame (11-30 items)             |
| Cat                 | line 646-654  | `fillText("🐈‍⬛", ...)` every frame with save/translate/scale/restore            |
| Speed text          | line 640-644  | Dynamic (changes value), cannot cache                                          |

### Cache Invalidation on Resize

Current resize handler (line 1130-1138): Clears `emojiRenderCache` and `collectibleRenderCache`, sets `scaleComputed = false`. Does NOT clear `emojiCache` (grass).

### Key Observations

1. Three separate cache Maps with identical structure (`emojiRenderCache`, `collectibleRenderCache`, `emojiCache`)
2. Three separate init functions with identical patterns (`initEmojiCache`, `initCollectibleCache`, `buildGrassEmojiCache`)
3. Background layer (gradient + moon + celestials) redrawn every frame despite being static
4. Cat drawn every frame despite being same emoji; only position changes
5. `createBackgroundGradient()` creates a NEW gradient object every frame (line 610)
6. Celestial objects use `ctx.filter = "blur(0.5px)"` and `ctx.globalAlpha = 0.2` — both expensive per-frame
7. Cat uses `ctx.save()`, `ctx.translate()`, `ctx.scale(-1, 1)`, `ctx.restore()` every frame

### Files Affected

- `js/game.js` — primary file, all changes here
- No other files need modification
