# Plan - Issue #11

## Change
In `js/game.js:400`, replace:
```js
const minGap = Math.max(680, 180 - score);
```
with:
```js
const minGap = Math.max(60, 680 - score * 5);
```

## Behavior
- Score 0: minGap = 680 (original default spacing)
- Score 50: minGap = 430 (moderate difficulty increase)
- Score 100: minGap = 180 (high difficulty)
- Score 124+: minGap = 60 (maximum difficulty floor)

## Visual Impact
None. Obstacles spawn closer together over time, matching intended difficulty curve.
