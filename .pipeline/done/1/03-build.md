# Stage: Build — Pipeline #1

## Branch

`pipeline/1-dark-theme-toggle`

## Files Changed

### `style.css`

- Added `:root` CSS variables for theme-dependent colors (`--bg`, `--card-bg`, `--text`, `--text-secondary`, `--accent`, `--border`).
- Replaced hardcoded colors with CSS variable references throughout.
- Added `[data-theme="light"]` override block for light theme.
- Added styles for `.theme-toggle` button (fixed position, sun/moon icon).
- Added responsive rule to hide theme toggle at `max-width: 768px`.
- Added smooth transition for theme switching.

### `index.html`

- Added theme toggle button element inside `.side-panel-container`, above `.side-panel-trigger`.
- Included `<script src="js/theme-toggle.js"></script>` before `</body>`.

### `js/theme-toggle.js` (new file)

- On load: checks `localStorage.getItem('negruta-theme')`, fallback to `prefers-color-scheme`.
- Toggle click: switches `data-theme` on `<html>`, saves to localStorage, swaps icon.
- Listens for `prefers-color-scheme` change event to auto-switch.

### `js/side-panel.js`

- Adjusted vertical positioning logic to account for the new theme toggle element above the paws icon.
- Fixed panel jump issue by moving theme toggle inside `.side-panel-container` to share hit area.

## Commit History

- Initial implementation of dark theme toggle with CSS variables.
- Fixed theme toggle positioning inside side-panel container.
- Fixed pointer-events issue preventing button click.
