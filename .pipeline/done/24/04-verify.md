# Verify: Cap localStorage high scores

## Lint

- `npm run lint` passes (0 errors, only pre-existing warnings unrelated to this change).

## Format

- `npm run format` (prettier) runs clean on `js/game.js`.

## Code Validity

- Syntax is valid JavaScript.
- Logic: sort by score descending, trim to 50 if exceeded.
- Edge case: arrays with <50 entries pass through unchanged.
