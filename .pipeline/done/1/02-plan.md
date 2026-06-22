# Stage: Plan — Pipeline #1

## Changes

### 1. `style.css`

- Add `:root` CSS variables for all theme-dependent colors.
- Replace hardcoded colors with CSS variable references.
- Add `[data-theme="light"]` override block.
- Header remains hardcoded to `#000` background (excluded from theming).
- Add styles for `.theme-toggle` button (sun/moon icon).
- Add responsive rule to hide theme toggle at `max-width: 768px`.

### 2. `index.html`

- Add theme toggle button element inside `.side-panel-container`, above `.side-panel-trigger`.
- Include `<script src="js/theme-toggle.js"></script>` before `</body>`.

### 3. `js/theme-toggle.js` (new file)

- On load: check `localStorage.getItem('negruta-theme')`, fallback to `prefers-color-scheme`.
- Toggle click: switch `data-theme` on `<html>`, save to localStorage, swap icon.
- Listen for `prefers-color-scheme` change event to auto-switch.

### 4. `js/side-panel.js`

- Adjust vertical positioning logic to account for the new theme toggle element above the paws icon.

## Mobile/Desktop Considerations

- Desktop: toggle visible, floating above paws icon.
- Mobile (≤768px): both toggle and side panel hidden (existing behavior).

## Visual Impact

- No visual change until user toggles — dark theme remains default appearance for dark-preferring systems.
- Transition: add `transition: background-color 0.3s, color 0.3s` on themed elements for smooth switching.
