# Issue 40 - Stage: Investigate

## Files Analyzed

### js/game.js

- `gameOver()` at line 791-797: sets `gameRunning=false`, shows `alert()`, saves score, re-enables controls
- `saveScore()` at line 799-811: saves to localStorage, updates display
- `displayScores()` at line 828-843: shows top 5 scores in `#scoreList`
- `startGame()` at line 846-875: validates name, starts game loop
- `resetGame()` at line 321-334: resets score, position, obstacles, etc.
- Second `alert()` at line 848: validates empty name input

### index.html

- Game section at line 195-215 with `#gameCanvas`, `#playerNameInput`, `#startGameBtn`, `#scoreList`
- No existing `<dialog>` element

### style.css

- Game styles at line 396-477: gold theme (`#d4af37`), rounded borders, flex layout
- Responsive styles at line 633+

## Findings

- The `alert()` at line 793 is blocking and visually inconsistent
- The `alert()` at line 848 for empty name could also be improved
- `startGame()` already handles re-entry (name stays filled), so "Play Again" just needs to call it
- No existing dialog/modal patterns in the codebase to follow
