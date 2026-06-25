## Plan

Remove 3 lines from `js/game.js`:
1. Line 260: `const GRASS_SPACING = 50;`
2. Line 261: `const GROUND_HEIGHT = 0; // adjust how tall the ground area is`
3. Line 262: `let groundY = canvas.height - GROUND_HEIGHT;`
4. Line 334: `groundY = canvas.height - GROUND_HEIGHT;`

Impact: None. Floor collision uses `canvas.height` directly. Grass rendering uses `canvas.height` directly. No other code references these variables.
