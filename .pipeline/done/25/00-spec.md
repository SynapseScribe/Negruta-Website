# Spec: Remove trailing comma in `Math.min()` call

## Problem

Line 301 has a trailing comma before the closing parenthesis: `Math.min(MAX_SPEED, INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT,)`. While valid in modern JavaScript, trailing commas in function calls are inconsistent with the rest of the codebase and may trigger linter warnings.

## Location

`js/game.js:301`

## Fix

Remove the trailing comma: `Math.min(MAX_SPEED, INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT)`

## Impact

- Code consistency cleanup
- No functional changes
- No visual or responsive impact
