# Spec: Full-screen functionality for the game

## Overview

Add a fullscreen toggle button to the game canvas area that makes the canvas fill the entire screen, with automatic canvas resizing.

## Scope

- **Button placement**: Inside the game canvas area (overlaid on or near the canvas)
- **Button style**: Styled to match existing game UI buttons
- **Fullscreen scope**: Just the canvas element goes fullscreen (not the whole game container)
- **Canvas resize**: Canvas dynamically resizes to fill the fullscreen viewport
- **Keyboard shortcut**: No keyboard shortcuts — button only

## Requirements

1. Add a fullscreen toggle button near/overlaid on the `#gameCanvas` element
2. Button uses the Fullscreen API (`element.requestFullscreen()`, `document.exitFullscreen()`)
3. On entering fullscreen: canvas resizes to fill viewport, game rendering adapts
4. On exiting fullscreen: canvas restores to its normal scaled size (existing `resizeCanvas` logic)
5. Button icon/text changes between "expand" and "exit" states
6. Handle browser compatibility for Fullscreen API (vendor prefixes if needed)
7. Listen for `fullscreenchange` event to detect programmatic exits (e.g., Escape key pressed by user)

## Files to modify

- `index.html` — add fullscreen button in the game section
- `style.css` — styles for the fullscreen button and fullscreen state
- `js/game.js` — fullscreen toggle logic, canvas resize on fullscreen change

## Edge cases

- Browser doesn't support Fullscreen API → hide or disable the button
- User presses Escape to exit fullscreen → detect via `fullscreenchange` event, restore canvas size
- Game running vs not running when entering/exiting fullscreen
- Orientation change while in fullscreen (mobile)
