# Issue #13 - Optimization: Unbounded emoji render caches grow indefinitely

## Description

Two render caches grow without bound:

- `emojiRenderCache` (line 190) - obstacle emoji pre-renders
- `collectibleRenderCache` (line 258) - collectible emoji pre-renders

With 100+ obstacle types and 150 possible sizes, `emojiRenderCache` could store up to 15,000 offscreen canvases.

## Impact

Memory usage grows over the lifetime of the page.

## Location

- `js/game.js:190` - `emojiRenderCache`
- `js/game.js:258` - `collectibleRenderCache`

## Decision

Pre-render all combos at load time rather than spawn time.

## Fix

Pre-render all obstacle and collectible emoji combos during initialization.
