# Issue #13 - Plan Stage

## Changes

### File: `js/game.js`

1. **Replace `emojiRenderCache`** (line 416) with a pre-rendered cache initialized at module load time:
   - Iterate all `OBSTACLE_TYPES` × all sizes from `MIN_OBSTACLE_SIZE` to `MAX_OBSTACLE_SIZE`
   - Store each rendered offscreen canvas in the map

2. **Replace `collectibleRenderCache`** (line 507) with a pre-rendered cache initialized at module load time:
   - Iterate all `COLLECTIBLE_TYPES` × all sizes from 48 to 83
   - Store each rendered offscreen canvas in the map

3. **Simplify `prerenderEmoji`** and **`prerenderCollectible`**:
   - Remove the "create if missing" logic since all entries exist at load
   - Functions become simple map lookups

4. **No changes** to `spawnObstacle`, `spawnCollectible`, or `draw` - they already use the cache functions.

## Visual Impact

- None. Rendering is identical, just pre-computed.

## Mobile/Desktop Considerations

- Pre-rendering adds ~100-200ms to initial load time (one-time cost).
- Reduces memory fragmentation during gameplay since no new canvases are allocated at runtime.
