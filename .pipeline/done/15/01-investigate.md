# Investigate Stage - Issue #15

## Findings

- `COLLECTIBLE_TYPES` array at `js/game.js:492` contains 24 entries
- `🐟` appears at indices 0 and 10 (lines 493 and 503)
- `🐠` appears at indices 1 and 11 (lines 494 and 504)
- All other entries are unique
- The duplicate entries cause these collectibles to spawn twice as often

## Affected Files

- `js/game.js` - Contains the `COLLECTIBLE_TYPES` array

## Browser Compatibility

No browser compatibility concerns - simple array modification.

## Responsive Impact

No responsive impact - purely data change.
