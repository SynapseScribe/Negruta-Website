# Investigate: Remove trailing comma in `Math.min()` call

## Findings

The `Math.min()` call is located at `js/game.js:596-599` (line numbers shifted from spec's line 301).

```javascript
currentSpeed = Math.min(
  MAX_SPEED,
  INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT // <-- trailing comma here
);
```

The trailing comma on line 598 is the only issue. No other trailing commas found in function calls in this file. The fix is a simple one-line edit.

## Browser Compatibility

Trailing commas in function calls are supported in ES2017+ and all modern browsers. However, the codebase does not use trailing commas elsewhere in function calls, so removing it maintains consistency.
