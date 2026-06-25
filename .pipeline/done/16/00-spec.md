## Bug Description

The auto-jump logic in the obstacle collision loop (`js/game.js:329-341`) increments `jumpCount` every time it triggers. Since `jumpCount` is only reset to 0 on game start, repeated auto-jumps can exhaust the jump allowance, leaving the player unable to jump manually.

## Location

`js/game.js:329-341`

## Scope

- Single file: `js/game.js`
- Affects the auto-jump collision handling block

## Fix

Reset `jumpCount` to 0 whenever the auto-jump triggers, so the player can immediately jump again manually after being auto-saved.

## Edge Cases

- Ensure reset doesn't interfere with intentional multi-jump mechanics
- Verify auto-jump still fires correctly after reset
- Test rapid obstacle sequences where auto-jump triggers multiple times consecutively
