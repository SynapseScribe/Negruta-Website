# Plan - Issue #12

## Changes

1. Add `let rightmostX = 0;` global variable to track the rightmost grass X position (js/game.js:65).
2. Initialize `rightmostX` in `initGrass()` after grass items are created (js/game.js:169).
3. Replace `Math.max(...grassItems.map(g => g.x))` with the O(1) `rightmostX` variable (js/game.js:388).
4. Update `rightmostX` whenever an item is recycled to a new position (js/game.js:389).

## Visual Impact

None - identical behavior, just faster.

## Mobile/Desktop

No changes to rendering or layout.
