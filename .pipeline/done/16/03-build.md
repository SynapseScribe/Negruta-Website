# Build - Issue #16

## Changes Made

In `js/game.js` line 637:

- Changed `jumpCount++` to `jumpCount = 0` in the auto-jump block
- This resets the jump counter whenever auto-jump triggers, so the player retains full jump allowance

## Commit

`024b4ae` - fix: reset jumpCount on auto-jump to prevent jump exhaustion (#16)
