# Spec: Replace splice() in hot path with more efficient array removal

## Problem
In the game loop (`update()`), obstacles and collectibles that scroll off-screen are removed using `Array.splice()`:
- `js/game.js:655` — obstacles removal
- `js/game.js:675-680` — collectibles removal

`splice()` is O(n) for each removal because it shifts all subsequent elements. With many items, this adds unnecessary overhead every frame.

## Scope
- Replace `splice()` with a more efficient removal strategy
- Options:
  a. Filter/rebuild array periodically (less frequent than every frame)
  b. Mark items as inactive and skip them during iteration, compact periodically
  c. Use a pointer/index approach instead of modifying the array

## Behavior
- Game entities (obstacles, collectibles) that go off-screen should still be cleaned up to prevent memory leaks
- The cleanup should happen less frequently than every frame (e.g., every 30-60 frames) OR use O(1) removal
- Gameplay is unaffected — same collision detection, same spawning

## Edge Cases
- Ensure no items are missed for collision detection before being marked for removal
- Array size should remain bounded — no unbounded growth over long play sessions
- The cleanup frequency should balance between performance and memory usage

## Design Preferences
- Simplest change that reduces per-frame overhead
- Avoid introducing complexity (object pooling) unless necessary
- Keep the code readable and maintainable
