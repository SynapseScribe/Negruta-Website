# Issue 41 - Replace alert() with inline error for game name validation

## Problem

`js/game.js:848` uses a blocking `alert()` to warn the user when they try to start the game without entering a name. A popup is disruptive for a simple validation error.

## Current Code

```js
alert("Please enter your name first!");
```

## Proposed Solution

Replace with an inline error message displayed next to or below the name input field.

## Details

- Show a red/error-styled message below the name input
- Add visual feedback to the input itself (e.g., red border)
- Auto-clear the error when the user starts typing in the name field
- Keep the `return` that prevents game start
- Focus the name input after showing the error for better UX
- Accessible (add `aria-describedby` linking input to error message)

## Files Affected

- `js/game.js` - logic changes
- HTML file(s) - add error message container
- CSS file(s) - styles for error message and input error state
