# Issue 40 - Stage: Build

## Changes Made

### index.html
- Added `<dialog id="gameOverDialog">` inside `.game-container` with:
  - Player name display (`#gameOverName`)
  - Final score display (`#gameOverScore`)
  - Date display (`#gameOverDate`)
  - Top 5 scores list (`#gameOverScores`)
  - "Play Again" button (`#playAgainBtn`)

### style.css
- Added dialog styles: dark background, gold theme, backdrop overlay
- Styled score display, high scores list with medal colors
- Added hover effects for "Play Again" button
- Added `@keyframes inputShake` for empty name validation

### js/game.js
- Added `gameOverDialog` and `playAgainBtn` element references
- Replaced `alert()` in `gameOver()` with dialog showing stats and top scores
- Added `playAgainBtn` click handler: closes dialog, re-enables controls, calls `startGame()`
- Replaced `alert()` in `startGame()` with input focus + shake animation
