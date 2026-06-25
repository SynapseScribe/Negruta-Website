## Balance Bug

In `js/game.js:399-401`, the obstacle spawn gap is calculated as:

```js
const minGap = Math.max(680, 180 - score);
```

Once `score >= 180`, `180 - score` becomes <= 0, so `minGap` clamps to the hardcoded minimum of 68 frames. At high speeds (speed increases with score), 68 frames is a very short distance, making obstacles appear extremely dense.

**Note:** User observed that at current high speeds, obstacles are not actually dense in practice. The formula may not be reached in normal play, or the speed scaling may not be severe enough to cause issues yet.

## Location

`js/game.js:399-401`

## Scope

- Single file: `js/game.js`
- Affects obstacle spawn gap calculation

## Fix

Investigate whether the 68-frame minimum is actually reachable and causes problems. If not, document the formula and leave as-is. If reachable, consider:

1. Raising the minimum gap floor
2. Scaling the gap with `currentSpeed`
3. Capping `currentSpeed` growth

## Edge Cases

- Test at very high scores (score > 180) to verify obstacle density
- Measure frame-to-distance conversion at max speed
- Ensure difficulty curve remains playable at extended play sessions
