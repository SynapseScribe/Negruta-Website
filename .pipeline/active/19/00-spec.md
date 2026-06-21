## Dead Code

The variable `groundY` is declared globally (line 15) and assigned in `resetGame()` (line 118), but is never referenced anywhere else in the codebase. The constant `GROUND_HEIGHT` (line 13) is similarly unused. The floor collision check uses `canvas.height` directly (line 313), and grass rendering also uses `canvas.height` (line 466).

## Location

- Declaration: `js/game.js:15`
- Assignment: `js/game.js:118`
- Unused constant: `js/game.js:13`

## Scope

- Single file: `js/game.js`
- Affects global constants and `resetGame()` function

## Fix

Remove `groundY` variable, `GROUND_HEIGHT` constant, and the `groundY = ...` assignment in `resetGame()`.

## Edge Cases

- Confirm no other files reference `groundY` or `GROUND_HEIGHT`
- Verify no breakage in floor collision or grass rendering after removal
