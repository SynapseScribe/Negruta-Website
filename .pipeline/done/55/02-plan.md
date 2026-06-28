# Plan: Standardize caching mechanism for all game objects

## Architecture

### Unified Cache Manager

Create a single `RenderCache` object in `js/game.js` that:

- Holds one unified `Map` for all emoji+size combinations
- Provides `get(emoji, size)` and `ensure(emoji, size)` methods
- Provides `clear()` for invalidation on resize
- Eliminates 3 separate Maps (`emojiCache`, `emojiRenderCache`, `collectibleRenderCache`)

### Background Cache

Create an offscreen canvas for the static background layer:

- `backgroundCanvas` — holds gradient + moon + celestials (rendered once)
- `renderBackground()` — draws gradient, moon, celestials to offscreen canvas
- Called in `resetGame()` after `initCelestial()`
- In `draw()`, replaced with single `ctx.drawImage(backgroundCanvas, 0, 0)`

### Cat Cache

- Cache the flipped cat emoji to an offscreen canvas once
- `catCanvas` — pre-rendered horizontally flipped cat
- In `draw()`, replaced with `ctx.drawImage(catCanvas, CAT_X - catSize/2, CAT_Y - catSize/2, catSize, catSize)`
- Eliminates per-frame `save/translate/scale/restore`

### Init Consolidation

- Replace 3 init functions with one: `initRenderCache()` that populates all emoji+size combos
- Loading screen progress bar updated to cover all caches uniformly
- `buildGrassEmojiCache()` merged into unified system

### Resize Handling

- `clearAllCaches()` called on resize: clears unified cache Map, nulls `backgroundCanvas` and `catCanvas`
- Background cache also needs `emojiCache` (grass) cleared on resize (currently missing bug)

## Exact Changes in `js/game.js`

| Section                    | Change                                                | Lines      |
| -------------------------- | ----------------------------------------------------- | ---------- |
| Cache declarations         | Replace 3 Maps with 1 `RenderCache` object            | ~70-71     |
| `buildGrassEmojiCache`     | Remove, merge into `initRenderCache`                  | ~72-89     |
| `initEmojiCache`           | Replace with unified `initRenderCache`                | ~370-395   |
| `initCollectibleCache`     | Merge into `initRenderCache`                          | ~473-498   |
| `prerenderEmoji`           | Replace with `RenderCache.get()`                      | ~396-398   |
| `prerenderCollectible`     | Replace with `RenderCache.get()`                      | ~499-501   |
| `createBackgroundGradient` | Keep, but call once in `renderBackground`             | ~609-615   |
| `draw()`                   | Replace background with `drawImage(backgroundCanvas)` | ~617-687   |
| `draw()`                   | Replace cat with `drawImage(catCanvas)`               | ~646-654   |
| `draw()`                   | Replace grass lookup with `RenderCache.get()`         | ~659-665   |
| `draw()`                   | Replace obstacle lookup with `RenderCache.get()`      | ~668-678   |
| `draw()`                   | Replace collectible lookup with `RenderCache.get()`   | ~680-686   |
| `resetGame()`              | Add `renderBackground()` call                         | ~855-870   |
| `startGame()`              | Update to use `initRenderCache`                       | ~932-976   |
| Resize handler             | Clear all caches including grass cache                | ~1130-1138 |

## Performance Impact

- Background: ~30+ draw ops → 1 `drawImage` call
- Cat: save/translate/scale/fillText/restore → 1 `drawImage`
- Per-frame: 3 Map lookups unified to 1, no gradient recreation
- Memory: slight increase for backgroundCanvas + catCanvas, offset by merging 3 Maps to 1
