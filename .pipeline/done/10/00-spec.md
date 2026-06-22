# Issue #10 - Bug: jumpCount not reset in resetGame()

## Description

The `jumpCount` variable (line 54) is not reset in the `resetGame()` function (lines 109-122).

## Impact

When a player restarts the game after a game over, `jumpCount` retains its stale value from the previous session. If the previous game ended with `jumpCount >= maxJumpsBeforeReset` (which is 2), the new game starts with the jump ability already exhausted.

## Location

- `js/game.js:54` - `jumpCount` declaration
- `js/game.js:109-122` - `resetGame()` missing `jumpCount = 0`

## Decision

Audit all state variables in `resetGame()` for completeness, not just `jumpCount`.

## Fix

Add `jumpCount = 0;` and audit other state vars for missing resets.
