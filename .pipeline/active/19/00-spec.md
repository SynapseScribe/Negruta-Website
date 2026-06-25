## Dead Code

The variable `groundY` is declared globally (line 262) and assigned in `resetGame()` (line 334), but is never referenced anywhere else in the codebase. The constant `GROUND_HEIGHT` (line 261) is similarly unused. The constant `GRASS_SPACING` (line 260) is also declared but never used. The floor collision check uses `canvas.height` directly, and grass rendering also uses `canvas.height` (line 765).

## Location

- Declaration: `js/game.js:262`
- Assignment: `js/game.js:334`
- Unused constants: `js/game.js:260` (GRASS_SPACING), `js/game.js:261` (GROUND_HEIGHT)

## Scope

- Single file: `js/game.js`
- Affects global constants and `resetGame()` function

## Fix

Remove `groundY` variable, `GROUND_HEIGHT` constant, `GRASS_SPACING` constant, and the `groundY = ...` assignment in `resetGame()`.

## Edge Cases

- Confirm no other files reference `groundY`, `GROUND_HEIGHT`, or `GRASS_SPACING`
- Verify no breakage in floor collision or grass rendering after removal
