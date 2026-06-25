## Missing Feature

The game only listens for `mousedown` (line 588) and `keydown`/Space (line 572) for jumping. There are no `touchstart` or `touchend` event listeners on the canvas. The game is completely unplayable on touch-only devices (phones, tablets).

## Location

`js/game.js:588-602` (input handlers)

## Scope

- Single file: `js/game.js`
- Affects the input event handlers section

## Fix

Add a `touchstart` listener on the canvas that triggers the same jump logic as `mousedown` and `keydown`.

## Edge Cases

- Ensure `e.preventDefault()` is called to avoid scroll/zoom on tap (game canvas should not scroll)
- Handle multi-touch gracefully (ignore extra touches)
- Test that touch and keyboard/mouse inputs don't conflict when both are active
