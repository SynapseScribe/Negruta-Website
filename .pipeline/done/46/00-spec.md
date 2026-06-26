# Spec: Adapt canvas resolution to device pixel ratio and screen size

## Problem

The canvas is hardcoded to 800x550 pixels internally (`js/game.js:7-8`). On mobile devices, CSS scales it down (`max-width: 100%; height: auto`), but the GPU still renders at full 800x550 resolution then downscales. On a 360px-wide phone, this wastes ~4x pixel work.

## Scope

- Detect device screen size / CSS-rendered size of the canvas
- Dynamically set `canvas.width` and `canvas.height` to match the actual display size (not the CSS size)
- Scale game coordinates proportionally so gameplay looks the same at any resolution
- Keep 800x550 as the default for desktop

## Behavior

- On game start (`resetGame`), read the canvas's rendered dimensions via `canvas.clientWidth` / `canvas.clientHeight`
- Set internal resolution to match (or cap at 800x550 for desktop)
- Scale all position/size constants (CAT_SIZE, CAT_X, GROUND_Y, etc.) by the ratio of new resolution to 800x550
- Obstacle hitboxes, collectible positions, grass positions all scale accordingly

## Edge Cases

- Very small screens (< 300px width) — minimum resolution floor
- Very large screens (> 800px width) — cap at 800x550
- Window resize during gameplay (optional: could ignore, or re-scale on next game start)
- High-DPI displays — consider `window.devicePixelRatio` but for performance on old devices, we want lower internal resolution, not higher

## Design Preferences

- No visual change for the user — same look and feel, just fewer pixels to render
- Maintain aspect ratio
