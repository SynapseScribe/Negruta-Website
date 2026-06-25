# Issue 41 - Build Stage

## Changes Made

### index.html

- Added `aria-describedby="nameError"` to `#playerNameInput` input
- Added `<span id="nameError" class="error-message" role="alert"></span>` after the input

### style.css

- Added `.error-message` class: red color (#e74c3c), small font, block display, min-height
- Added `#playerNameInput.error` class: red border color

### js/game.js

- Added `nameError` constant referencing the error span
- Added `clearNameError()` function to clear error text and remove error class
- Added `input` event listener on `nameInput` to auto-clear error when user types
- Modified `startGame()` to show error message and add error class on empty name

## Verification

- Lint: 0 errors, 3 pre-existing warnings (unrelated)
- Format: all files clean
