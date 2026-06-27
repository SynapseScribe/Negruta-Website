# Investigate

## Files Analyzed
- `js/game.js:769-776` — obstacles removal with `splice(i, 1)` in reverse for-loop
- `js/game.js:788` — collectibles removal (collision) with `splice(i, 1)`
- `js/game.js:795-796` — collectibles removal (off-screen) with `splice(i, 1)`

## Findings
- 3 calls to `Array.splice()` in the hot `update()` loop
- All iterate backwards (`for (let i = arr.length - 1; i >= 0; i--)`) to avoid index shift issues
- `splice()` is O(n) per removal — shifts all elements after index `i`
- `frameCount` variable already exists (line 16), resets on game restart (line 865)
- Arrays `obstacles` and `collectibles` are reset to `[]` on `resetGame()` (lines 861-862)
- No object pooling or inactive flags currently in use

## Impact
- With few items, overhead is negligible, but as arrays grow, each splice shifts remaining elements
- Swap-and-pop gives O(1) removal at the cost of reordering (irrelevant here since draw order doesn't matter)
