# Summary: Full-screen functionality for the game (Issue #61)

## What was done

Moved pre-game UI (name field + start button) from canvas-drawn rendering to visible HTML elements, improving accessibility, keyboard navigation, and mobile touch support while maintaining visual consistency with the game's gold/dark theme.

## Files changed

- **`index.html`**: Moved pre-game UI elements (`#playerNameInput`, `#startGameBtn`) from hidden (off-screen) to visible inside `.canvas-wrapper`. Removed inline hiding styles.
- **`style.css`**: Added styles for `.pre-game-input` (centered, gold border, dark background, focus glow), `.pre-game-btn` (gold theme, hover effect), `.canvas-wrapper.game-active` state (fades UI during gameplay), and `@keyframes inputShake` animation.
- **`js/game.js`**: Removed ~100 lines of canvas-drawn UI code including `roundRect()` helper. Simplified event handlers by removing coordinate-based hit-testing. Added CSS class manipulation for shake animation and game-active state. Added touch support for pre-game input on mobile.

## Key design decisions

- Pre-game UI uses native HTML elements instead of canvas drawing: better accessibility, keyboard navigation, and mobile touch support
- Visual consistency maintained through gold/dark theme matching the game's aesthetic
- Game-active state fades pre-game UI to 30% opacity during gameplay, restores on hover for quick access
- Shake animation moved from JS-based offset calculation to CSS class toggle for cleaner code
- Fullscreen functionality preserved from issue #59 - no changes made to existing fullscreen code

## PR

https://github.com/SynapseScribe/Negruta-Website/pull/62
