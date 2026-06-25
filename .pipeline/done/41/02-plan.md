# Issue 41 - Plan Stage

## Changes

### 1. index.html (line ~202)

- Add `aria-describedby="nameError"` to `#playerNameInput`
- Add `<span id="nameError" class="error-message" role="alert"></span>` after the input, inside `.game-controls`

### 2. style.css

- Add `.error-message` class: red color, small font, display none by default, margin top
- Add `#playerNameInput.error` class: red border for visual feedback
- Ensure responsive layout works with the new error span

### 3. js/game.js

- Line 879-885: In `startGame()`, show error message text + add `.error` class to input
- Add event listener on `nameInput` for `input` event: clear error message and remove `.error` class when user types
- Keep existing shake animation and focus behavior

## Visual Impact

- Error message appears below input in red text
- Input border turns red on error
- Error clears automatically when user starts typing
- Shake animation still fires alongside the new error message

## Mobile/Desktop

- Error message wraps naturally in flex container
- On mobile (column layout), error appears between input and button naturally
