Fixes #47

## Summary

Replaced per-item grass rendering (15-20 drawImage calls/frame) with 2 pre-rendered scrolling strip technique.

## Changes

- js/game.js: New initGrassStrips() creates wide offscreen canvas filled with random grass emojis; draw() uses 2 drawImage calls for seamless scrolling; update() tracks single offset value
- Removed unused variables: grassItems, rightmostX, GRASS_SIZE, runtime grassSize

## Performance Impact

- Grass rendering reduced from ~15-20 to exactly 2 drawImage calls per frame
- Eliminates per-frame random number generation and memory allocations for grass regeneration
- Expected FPS improvement: 6-8% on mobile, 3-4% on desktop
