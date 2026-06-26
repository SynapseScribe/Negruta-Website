# Plan Stage - Issue #46

## Strategy

Adopt a scale-factor approach. Base resolution is 800x550. On game start, compute scale from rendered canvas size, then scale all pixel-based constants.

## Changes to js/game.js

### 1. Add base resolution and scale factor (lines 4-8)

- Add: const BASE_WIDTH = 800, BASE_HEIGHT = 550
- Change: canvas.width/height assignment to use BASE_WIDTH/BASE_HEIGHT
- Add: let scale = 1 (will be computed at game start)

### 2. Create computeScale() function

- Called before resetGame() in startGame()
- scale = Math.min(canvas.clientWidth / BASE_WIDTH, canvas.clientHeight / BASE_HEIGHT)
- Clamp: scale between 0.375 (min ~300px width) and 1.0 (max 800px)
- Set canvas.width = Math.round(BASE*WIDTH * scale), canvas.height = Math.round(BASE*HEIGHT * scale)
- Regenerate bgGradient after canvas size changes

### 3. Convert pixel-based constants to scaled values

All these become functions or computed in resetGame():

- catSize() -> CAT_SIZE \* scale
- catX() -> CAT_X \* scale
- gravity, jumpStrength, speeds scaled proportionally
- Collision paddings, obstacle sizes, autojump tolerances scaled
- Grass spacing, collectible sizes scaled
- Hardcoded literals in spawnObstacle, spawnCollectible, initCelestial, draw() scaled

### 4. Emoji render caches

- Obstacle/collectible sizes are scaled, so cache keys change
- On scale change, clear emojiRenderCache and collectibleRenderCache
- Re-init caches with scaled sizes (or skip if scale is 1.0)

### 5. Loading screen

- barWidth (400) and font sizes scaled proportionally

## Approach for Constants

Instead of converting all consts to functions (which would be noisy), I will:

- Keep BASE\_\* constants for the original 800x550 values
- In computeScale(), also compute a scaled version of each constant
- Store scaled values in lowercase variables (e.g., catSize, catX, obstacleSizes[])
- Use scaled variables throughout the game logic

## No Changes Needed

- index.html (keep width=""800"" height=""550"" as fallback)
- style.css (CSS scaling still applies as fallback)
