# Issue #13 - Investigate Stage

## Affected Files

- `js/game.js` - Main game logic file

## Findings

### Current Behavior

1. **`emojiRenderCache`** (line 416) - A `Map` that caches pre-rendered obstacle emojis. The `prerenderEmoji` function (line 417) checks if a key exists, and if not, creates a new offscreen canvas. Called from `spawnObstacle` (line 437) at each spawn.

2. **`collectibleRenderCache`** (line 507) - A `Map` that caches pre-rendered collectible emojis. The `prerenderCollectible` function (line 508) works identically. Called from `spawnCollectible` (line 525) at each spawn.

### Problem Details

- **Obstacle sizes**: `MIN_OBSTACLE_SIZE` (150) to `MAX_OBSTACLE_SIZE` (300) = 151 possible sizes
- **Obstacle types**: 230 entries in `OBSTACLE_TYPES` array (lines 20-251)
- **Max obstacle cache entries**: 230 × 151 = 34,730 offscreen canvases
- **Collectible sizes**: 48 to 83 = 36 possible sizes
- **Collectible types**: 22 entries in `COLLECTIBLE_TYPES` array (lines 457-481)
- **Max collectible cache entries**: 22 × 36 = 792 offscreen canvases

### Browser Compatibility

- Offscreen canvas (`document.createElement("canvas")`) is widely supported across all modern browsers.
- Pre-rendering at load time adds initial load time but reduces per-frame overhead.

### Responsive Impact

- No responsive impact - canvas dimensions are fixed (800x550).
