@59/04-verify.md

# Verification: Parallax Scrolling Layers

## Lint

- `npm run lint` — js/game.js passes cleanly (no errors)
- Pre-existing lint errors in `js/test-cancel-raf-runner.js` (#50 artifact, unrelated to this issue)

## Format

- `npm run format` — all files formatted successfully, no conflicts

## HTML Validation

- No HTML changes made for this issue

## JS/CSS Validity Checks

- All new variables properly declared with `let`/`const`
- All new functions follow existing naming conventions (`init*`, `draw*`)
- Speed ratios use consistent pattern: `FG_GRASS_SPEED_RATIO = 1`, `BG_GRASS_SPEED_RATIO = 0.7`, `TREE_SPEED_RATIO = 0.35`, `MOON_SPEED_RATIO = 0.2`

## Responsive Breakpoints

- All strip widths and emoji sizes scaled by `scale` factor (device pixel ratio + screen size)
- Moon position uses `canvas.width * 0.75` — adapts to any canvas width
- Resize handler clears all strip canvases, triggering re-init on next game start

## Functional Verification

- Draw order correct: gradient → moon → celestial → tree-strip (opacity 0.6) → bg-grass-strip → fg-grass-strip → speed counter → cat → obstacles → collectibles
- Parallax offsets update correctly in `update()` with proper modulo wrapping
- All strip canvases re-initialized on resize and game reset
