# Build - Issue #12

## Implementation

- Added `rightmostX` variable at line 65 to track the running max of grass X positions.
- Initialized in `initGrass()` using the last item's X (since items are added left-to-right).
- Replaced O(n) `Math.max(...grassItems.map(g => g.x))` with O(1) `rightmostX` lookup.
- Updated `rightmostX` inline when recycling items.

## Files Changed

- `js/game.js` - core fix (3 small edits)
- `eslint.config.js` - new file for lint verification
