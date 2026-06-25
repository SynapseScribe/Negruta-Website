# Issue 41 - Investigate Stage

## Current State

### js/game.js

- Line 879-885: Empty name validation triggers focus + shake animation, then returns
- No inline error message shown, only visual shake
- `nameInput` constant at line 11 references `#playerNameInput`

### index.html

- Line 199-203: Name input with id="playerNameInput" inside `.game-controls` flex container
- No error message element exists
- No `aria-describedby` attribute on the input

### style.css

- Line 422-437: `.game-controls` flex layout, `#playerNameInput` has gold border
- Line 586-600: `@keyframes inputShake` animation defined
- No error state styles for input or error message

## Files to Modify

1. `index.html` - add error message span, add `aria-describedby` to input
2. `style.css` - add error message styles, input error state (red border)
3. `js/game.js` - show/hide error message logic, auto-clear on input typing

## Browser Compatibility

- All target browsers support `aria-describedby`, CSS transitions, and flexbox
- No polyfills needed
