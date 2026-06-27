# Verify

## Lint
- `npm run lint` — passes (pre-existing errors in `test-cancel-raf-runner.js` unrelated)

## Format
- `npm run format` — all files formatted, `js/game.js` reformatted

## Code Validity
- No `splice()` calls remain in `js/game.js`
- Swap-and-pop pattern correctly handles edge case where `i === lastObs` (no-op swap)
- `i--` ensures swapped element gets checked next iteration
- `collType` cached before swap to preserve correct score value
