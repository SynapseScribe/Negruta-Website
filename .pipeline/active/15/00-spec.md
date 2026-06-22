# Issue #15 - Code quality: Duplicate entries in COLLECTIBLE_TYPES array

## Description

At line 232, `COLLECTIBLE_TYPES` contains duplicate entries:

- `🐟` appears at index 0 and index 11
- `🐠` appears at index 1 and index 12

This doubles the spawn weight of these two collectibles compared to others.

## Impact

If unintentional, fish collectibles spawn twice as often as intended.

## Location

- `js/game.js:232` - `COLLECTIBLE_TYPES` array

## Decision

Duplicates were accidental — remove them.

## Fix

Remove duplicate `🐟` and `🐠` entries from `COLLECTIBLE_TYPES`.
