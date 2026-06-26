# Investigate Stage - Issue #46

## Files Involved

- js/game.js (997 lines) - core game logic, canvas setup, all constants
- index.html (line 206) - canvas element with hardcoded width=""800"" height=""550""
- style.css (lines 414-421, 760-767) - canvas styling (max-width: 100%, height: auto)

## Hardcoded Dimensions (3 locations)

1. index.html:206 - HTML attribute: width=""800"" height=""550""
2. js/game.js:7 - JS override: canvas.width = 800
3. js/game.js:8 - JS override: canvas.height = 550

## Constants Needing Scaling

- CAT_SIZE (80), CAT_X (160)
- gravity (1), jumpStrength (-20)
- INITIAL_SPEED (10), MAX_SPEED (50), SPEED_INCREMENT (0.1)
- COLLISION_HORIZONTAL_PADDING (30), OBSTACLE_HITBOX_INSET (20), COLLISION_VERTICAL_PADDING (30)
- OBSTACLE_SIZES [200, 250, 300], AUTOJUMP_VERTICAL_TOLERANCE (40), AUTOJUMP_HORIZONTAL_MARGIN (30)
- GRASS_MIN_SPACING (50), GRASS_MAX_SPACING (90)
- OBSTACLE_VERTICAL_OFFSET (60), COLLECTIBLE_SIZES [60, 70, 80]

## Hardcoded Pixel Literals in Game Logic

- initCelestial: canvas.height - 150, + 50
- drawLoadingScreen: -40, barWidth=400, +20, +30
- spawnCollectible: canvas.height - 350, + 180
- Collision hitboxes: +10, -10, -15, -40
- draw: moon at canvas.width-150, 120; speed text at canvas.width-15, 25
- obstacle draw offset: -30

## Existing Resize Handling

None. No window resize listener, no dynamic resolution code.

## Key Functions

- resetGame() at line 322: uses canvas.height for CAT_Y positioning
- initGrass() at line 384: uses canvas.width
- initCelestial() at line 396: uses canvas.width and canvas.height
- spawnObstacle() at line 473: uses canvas.width and canvas.height
- spawnCollectible() at line 572: uses canvas.width and canvas.height
- draw() at line 720: uses canvas.width and canvas.height throughout
- createBackgroundGradient() at line 713: uses canvas.height
