# Investigation - Issue #16

## Affected Files
- `js/game.js` (lines 636-638)

## Analysis
- `jumpCount` tracks number of jumps, limited by `maxJumpsBeforeReset = 2` (line 16)
- `jumpCount` resets only on: game start (line 328), hitting floor (line 613)
- Auto-jump at line 637 increments `jumpCount++` every time it triggers
- With `maxJumpsBeforeReset = 2`, two auto-jumps would exhaust the allowance
- Player cannot jump manually once `jumpCount >= maxJumpsBeforeReset`

## Browser/Compatibility Impact
- None. Pure game logic change.

## Responsive Impact
- None. Logic is independent of viewport.
