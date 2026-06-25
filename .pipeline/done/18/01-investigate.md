## Investigate - Issue #18: Touch Support for Mobile Game

### Affected Files

- `js/game.js` (lines 877-937, input handlers section)

### Current State

- Game only listens for `mousedown` (line 919) and `keydown`/Space (line 896) for jumping.
- No `touchstart` or `touchend` event listeners on the canvas.
- Game is completely unplayable on touch-only devices (phones, tablets).

### Browser Compatibility

- `touchstart` is well-supported across all modern mobile browsers (iOS Safari, Android Chrome).
- `{ passive: false }` option is needed to allow `preventDefault()` (supported in all modern browsers).
- Multi-touch handling is straightforward: just ignore extra touches beyond the first.

### Impact

- Single file change (`js/game.js`).
- No CSS or HTML changes needed.
- No visual impact on desktop; purely adds functionality for mobile users.
