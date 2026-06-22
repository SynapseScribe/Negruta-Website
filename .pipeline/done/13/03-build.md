# Issue #13 - Build Stage

## Changes Made

### `js/game.js`

1. **`emojiRenderCache`** (line 416): Replaced on-demand rendering with an IIFE that pre-renders all 230 obstacle types × 151 sizes (34,730 combos) at module load time.

2. **`prerenderEmoji`** (line 435): Simplified to a single-line map lookup since all entries are guaranteed to exist.

3. **`collectibleRenderCache`** (line 508): Replaced on-demand rendering with an IIFE that pre-renders all 22 collectible types × 36 sizes (792 combos) at module load time.

4. **`prerenderCollectible`** (line 527): Simplified to a single-line map lookup.

## No Changes Required

- `spawnObstacle`, `spawnCollectible`, and `draw` remain unchanged - they already call the cache functions.
