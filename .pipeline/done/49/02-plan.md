# Plan

## Strategy: Swap-and-Pop (O(1) Removal)

Since the loops iterate backwards and draw order doesn't matter, swapping the removed element with the last element then popping gives O(1) removal.

## Changes

### File: `js/game.js`

1. **Obstacles loop** (line ~769): Replace `obstacles.splice(i, 1)` with swap-and-pop, decrement `i` to re-check swapped element
2. **Collectibles collision** (line ~788): Same swap-and-pop pattern, cache `collType` before swap
3. **Collectibles off-screen** (line ~795): Same swap-and-pop pattern

## Visual Impact
- None — draw order is unchanged visually since items are positioned by coordinates, not array index

## Mobile/Desktop
- No impact — purely internal optimization
