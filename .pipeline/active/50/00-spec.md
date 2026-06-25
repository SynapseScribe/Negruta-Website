# Spec: Cancel animation loop on game over instead of letting it spin

## Problem
When `gameOver()` is called, `gameRunning` is set to `false`. However, the `requestAnimationFrame` chain is never explicitly cancelled. The loop continues running each frame, checking `gameRunning`, doing nothing, then scheduling the next frame. This wastes CPU cycles and battery on mobile devices.

## Scope
- Store the `requestAnimationFrame` ID in a variable
- Call `cancelAnimationFrame()` when `gameOver()` is triggered
- Ensure the loop restarts cleanly when the player starts a new game

## Behavior
- New variable: `let animationFrameId = null;`
- In `update()`, change `requestAnimationFrame(update)` to `animationFrameId = requestAnimationFrame(update)`
- In `gameOver()`, add `if (animationFrameId) cancelAnimationFrame(animationFrameId);`
- When starting a new game, the loop restarts via the existing `requestAnimationFrame(update)` call

## Edge Cases
- Multiple `gameOver()` calls — `cancelAnimationFrame` is safe to call multiple times
- Starting a new game ensures `animationFrameId` is fresh
- The `gameRunning` flag can remain as a secondary guard

## Design Preferences
- Minimal code change — just 3 lines
- No visual or gameplay changes
