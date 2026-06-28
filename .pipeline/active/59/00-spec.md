# Parallax Scrolling Layers for Grass, Trees, and Moon

## Overview
Replace single-layer grass rendering with 4 parallax scrolling layers at different speeds to create depth perception in the game scene. All layers scroll right-to-left.

## Layers (front to back)

### Layer 1: Foreground Grass (speed ratio 1.0)
- Current grass strip, unchanged behavior
- Uses existing `GRASS_EMOJIS` pool (🌱🌿☘️🍀🌾🎍🪴🌼🌻🌷🥀🍂🍁🌹🪻)
- Moves in sync with obstacles and collectibles (`currentSpeed * dt`)
- Full opacity, no blur

### Layer 2: Background Grass (speed ratio 0.7)
- Separate pre-rendered strip with different emoji pool
- Suggested emojis: 🌿☘️🍀🎍🪴 (taller plants/bushes)
- Positioned behind foreground grass, slightly higher on canvas
- Moves at `currentSpeed * 0.7 * dt`
- Full opacity

### Layer 3: Trees (speed ratio 0.4)
- Separate pre-rendered strip with tree emojis
- Emojis: 🌳🌲🌴🎋
- Positioned behind grass layers, anchored near ground line
- Moves at `currentSpeed * 0.4 * dt`
- Reduced opacity (~60%) for depth effect

### Layer 4: Moon (speed ratio 0.2)
- Existing moon from celestial system, moved to its own strip
- Positioned in upper portion of canvas
- Moves at `currentSpeed * 0.2 * dt`
- No stars or clouds — moon only per user preference

## Technical Approach
- Each layer is a separate offscreen canvas (pre-rendered once on game reset)
- Strip width: 3200px (scaled), same as current grass strip
- Each layer has its own `offset` variable, updated independently per frame
- Drawing order in `draw()`: moon → trees → bg-grass → fg-grass → obstacles → cat
- Total drawImage calls: 8/frame (4 layers × 2 strips each) — still very cheap

## Performance Considerations
- Current: 2 drawImage calls/frame (grass only)
- After: 8 drawImage calls/frame (4 layers)
- Still far cheaper than rendering individual emojis per frame (~15-20+ calls)
- All strips pre-rendered on reset, zero per-frame emoji processing

## Files to Modify
- `js/game.js` — main game logic, strip creation, drawing order, offset updates
- Potentially add new constants: `BG_GRASS_EMOJIS`, `TREE_EMOJIS`, speed ratios

## Edge Cases
- Game reset: regenerate all 4 strips, reset all offsets to 0
- Speed changes: all layers scale proportionally (ratios stay constant)
- Mobile/responsive: strip width scales with device pixel ratio as current system does
- Canvas resize: strips regenerated if canvas dimensions change
