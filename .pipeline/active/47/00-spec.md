# Spec: Batch grass rendering into pre-rendered ground strips

## Problem
Each frame, every grass item is drawn individually via `ctx.drawImage()` (`js/game.js:762-768`). With ~15-20 grass items per frame, that's 15-20 separate draw calls every frame. On low-end devices, each draw call has overhead.

## Scope
- Replace individual grass item rendering with 2-3 pre-rendered ground strips
- Each strip is wide enough to cover the full canvas width (800px) with overlap (1600px+ total)
- Strips scroll horizontally by offsetting the `drawImage` x-position
- When a strip scrolls past its edge, wrap around to the beginning (seamless loop)

## Behavior
- At game init, render grass emojis onto a wide offscreen canvas (e.g., 1600px wide, matching ground height)
- The strip contains randomly placed grass emojis similar to the current `initGrass` logic
- In `draw()`, instead of looping over `grassItems`, draw 2 strips side by side with an offset that decreases each frame
- When the offset reaches the strip width, reset to 0 (seamless wrap)
- Grass still scrolls at `currentSpeed * dt` to match obstacle speed

## Edge Cases
- Strip must be seamless: the left edge must visually match the right edge, or use 2 strips that overlap so the wrap is hidden
- Different grass sizes and emojis should still appear random and varied
- Ground Y position must align correctly with the bottom of the canvas

## Design Preferences
- Keep the same grass emojis and visual style
- The scrolling should look smooth with no visible "jump" when wrapping
- Strip width: at least 2x canvas width (1600px) to ensure no gaps during scroll
