# Issue 40 - Stage: Plan

## Changes

### 1. index.html

- Add `<dialog id="gameOverDialog">` inside `.game-container`
- Dialog contents: h2 title, player name, final score, date, top scores list, "Play Again" button

### 2. style.css

- Style `#gameOverDialog` with backdrop, gold theme, centered modal
- Style dialog contents: score display, high scores list, button
- Ensure responsive behavior on mobile

### 3. js/game.js

- Replace `alert()` in `gameOver()` with `dialog.showModal()`
- Populate dialog with player name, score, date, and top 5 scores
- "Play Again" button closes dialog and calls `startGame()`
- Replace `alert()` in `startGame()` with input focus + shake animation

## Flow

1. Game ends → `gameOver()` called → dialog shows with stats
2. User clicks "Play Again" → dialog closes → `startGame()` resumes
3. Score is saved before dialog closes
