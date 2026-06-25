## Build

Removed from `js/game.js`:
- Line 260: `const GRASS_SPACING = 50;`
- Line 261: `const GROUND_HEIGHT = 0;`
- Line 262: `let groundY = canvas.height - GROUND_HEIGHT;`
- Line 334 (resetGame): `groundY = canvas.height - GROUND_HEIGHT;`
- Updated comment at line 761 to remove reference to deleted variables
