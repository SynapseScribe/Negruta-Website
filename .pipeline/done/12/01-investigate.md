# Investigate - Issue #12

## Affected Files

- `js/game.js:387-388` - grass recycling logic with O(n²) performance issue

## Problem Analysis

At lines 387-388, every time a grass item goes off-screen:

```javascript
const rightmostX = Math.max(...grassItems.map((g) => g.x));
item.x = rightmostX + randomGrassGap();
```

This creates a new array via `.map()` and iterates all grass items via `Math.max(...spread)` to find the max X coordinate. With ~20 grass items on screen, this runs O(n) per recycle event, causing unnecessary GC pressure from array allocation.

## Browser Compatibility

No browser compatibility concerns - pure JavaScript optimization.

## Responsive Impact

No visual or responsive impact - purely internal performance improvement.
