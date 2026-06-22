# Issue #11 - Bug: Dead code in obstacle spacing logic (minGap always 680)

## Description

At line 399, the obstacle spacing calculation uses:

```
const minGap = Math.max(680, 180 - score);
```

Since `score` is always >= 0, `180 - score` is at most 180. `Math.max(680, <=180)` always returns 680.

## Impact

The intended behavior (obstacles spawning closer together as score increases) never activates.

## Location

- `js/game.js:399` - dead code in `minGap` calculation

## Decision

Obstacles should spawn closer together as score increases (increase difficulty).

## Fix

Fix the constants so `minGap` actually decreases with score. E.g. `Math.max(60, 680 - score * someFactor)`.
