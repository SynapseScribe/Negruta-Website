## Investigation

Analyzed `js/game.js` for dead code:

1. `GRASS_SPACING` (line 260): Declared as `const GRASS_SPACING = 50;` but never referenced anywhere in the codebase.
2. `GROUND_HEIGHT` (line 261): Declared as `const GROUND_HEIGHT = 0;` but never used meaningfully. The floor collision check uses `canvas.height` directly (line 313), and grass rendering uses `canvas.height` (line 765).
3. `groundY` (line 262): Declared as `let groundY = canvas.height - GROUND_HEIGHT;` and reassigned in `resetGame()` (line 334), but never read anywhere else.

Searched entire codebase: only `js/game.js` references these variables. No other files depend on them.
