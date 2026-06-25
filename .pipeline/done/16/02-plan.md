# Plan - Issue #16

## Changes

### `js/game.js`

- Line 636-638: Before incrementing `jumpCount` in the auto-jump block, reset `jumpCount` to 0
- This ensures the player retains full jump allowance after an auto-save

## Visual Impact

- None. No visual changes.

## Mobile/Desktop

- Affects both equally. No platform-specific changes.
