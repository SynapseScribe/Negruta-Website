# Plan: Remove trailing comma in `Math.min()` call

## Changes

### `js/game.js`

- Line 598: Remove trailing comma after `SPEED_INCREMENT`

## Before

```javascript
currentSpeed = Math.min(
  MAX_SPEED,
  INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT
);
```

## After

```javascript
currentSpeed = Math.min(
  MAX_SPEED,
  INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT
);
```

## Impact

- Pure code consistency fix
- No functional changes
- No visual or responsive impact
- No edge cases
