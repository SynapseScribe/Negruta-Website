## Build - Issue #18: Touch Support for Mobile Game

### Implementation

Added `touchstart` event listener on the canvas in `js/game.js` at line 926-933:

```javascript
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    if (gameRunning && jumpCount < maxJumpsBeforeReset) {
      velocityY = jumpStrength;
      jumpCount++;
    }
  },
  { passive: false },
);
```

### Commit

Single commit adding touch support after the `mousedown` handler.
