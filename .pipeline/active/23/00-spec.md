# Spec: Optimize O(n²) grass rendering in game loop

## Problem
Inside the grass update loop (`js/game.js:383-393`), `Math.max(...grassItems.map(g => g.x))` runs every time a grass item wraps around. This is O(n) inside an O(n) loop, making grass updates O(n²). As `grassItems` grows, this degrades frame performance.

## Location
`js/game.js:387`

## Fix
Track the rightmost grass X position as a variable updated incrementally, or sort/reorder items to avoid scanning. Alternatively, cache the max and update it only when items are recycled.

## Impact
- Hot path optimization in the game loop
- No visual changes
- Better frame stability on devices with many grass items
