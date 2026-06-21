## Bug Description

Syntax error on line 601 of `js/game.js`: an extra closing brace `}` appears after the `dblclick` arrow function callback closes, before the `);` that closes `addEventListener`. This causes a `SyntaxError` and prevents the entire script from loading.

## Location

`js/game.js:596-602`

## Scope

- Single file: `js/game.js`
- Affects the `dblclick` event listener registration

## Fix

Remove the stray `}` on line 601 so the callback closes properly before `);`.

## Edge Cases

- Verify the script loads without errors after the fix
- Confirm `dblclick` jump behavior works as expected
- Check that no other syntax issues remain in the input handlers section
