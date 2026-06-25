# Issue 40 - Replace alert() with dialog overlay for game over screen

## Problem
`js/game.js:793` uses a blocking `alert()` to display the game over message. While game over is a blocking state, a plain alert is visually jarring, inaccessible, and doesn't match the game's aesthetic.

## Current Code
```js
alert(`Game Over, ${playerName}! Your score: ${score}`);
```

## Proposed Solution
Replace with a styled `<dialog>` overlay showing the final score, a "Play Again" button, and optionally the top scores.

## Details
- Use native `<dialog>` element for accessibility and no dependencies
- Centered modal overlay with game-themed styling
- Display: player name, final score, date
- Include a "Play Again" button that restarts the game
- Optionally show top 3-5 high scores
- Close button (X) to dismiss
- The `saveScore()` call and UI state reset should remain after dismissal

## Files Affected
- `js/game.js` - logic changes
- HTML file(s) - add `<dialog>` element
- CSS file(s) - styles for game over dialog