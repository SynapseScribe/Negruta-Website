# Build

## Changes Made

### `js/game.js`

**Obstacles removal** (line ~769):

- Replaced `obstacles.splice(i, 1)` with swap-and-pop pattern
- Swap element at index `i` with last element, then `pop()`, decrement `i` to re-check

**Collectibles collision** (line ~788):

- Cache `collType` before swap to avoid accessing moved element
- Same swap-and-pop pattern

**Collectibles off-screen** (line ~795):

- Same swap-and-pop pattern

All 3 `splice()` calls removed from the hot path.
