## Performance Issue

In `js/game.js:385-392`, every time a grass item goes off-screen and needs recycling, the code computes `Math.max(...grassItems.map(g => g.x))` to find the rightmost grass item. This is O(n) and runs inside the per-frame update loop.

## Location

`js/game.js:385-392`

## Scope

- Single file: `js/game.js`
- Affects the grass item recycling block in the game loop

## Fix

Maintain a `rightmostX` variable that tracks the maximum X position, updated during the grass movement loop. This reduces the recycle cost from O(n) to O(1).

## Edge Cases

- Ensure `rightmostX` stays correct when grass items are added/removed
- Initialize `rightmostX` properly in `resetGame()`
- Verify grass still tiles correctly across the canvas after the change
