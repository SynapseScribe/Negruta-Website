# Issue #12 - Performance: O(n²) grass recycling via Math.max spread

## Description

At lines 387-388, every time a grass item goes off-screen:

```
const rightmostX = Math.max(...grassItems.map(g => g.x));
item.x = rightmostX + randomGrassGap();
```

This creates a new array and iterates all grass items to find the max X.

## Impact

Unnecessary GC pressure and CPU waste on every grass recycle event.

## Location

- `js/game.js:387-388` - grass recycling logic

## Decision

Use the most optimized approach while maintaining same functionality.

## Fix

Track `rightmostX` incrementally as a running max variable updated when items move or spawn.
