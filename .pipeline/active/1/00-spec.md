# Pipeline #1 — Dark Theme Toggle

## Scope
- Apply a light/dark theme toggle to the **entire site**.
- Header (top bar with "Negruta" title) stays **dark** in both themes.

## Toggle
- **Placement:** Floating icon, right above the 🐾 paws icon on the right side.
- **Style:** Sun/moon icon toggle.
- **Persistence:** localStorage (`negruta-theme` key).
- **Default:** Respect system preference (`prefers-color-scheme`).

## Design
- Light palette derived from existing dark theme, keeping gold (`#d4af37`) as the accent.
- Dark theme (current) remains unchanged.

## Technical Approach
- Introduce CSS custom properties (variables) for theming.
- Toggle adds/removes a `data-theme="light"` attribute on `<html>`.
- JS in a new `js/theme-toggle.js` handles toggle logic, persistence, and system preference detection.
- The side panel trigger area gets extended to include the theme toggle above the paws icon.

## Files to Modify
- `index.html` — add theme toggle element, include `js/theme-toggle.js`
- `style.css` — introduce CSS variables, add light theme overrides, style the toggle
- `js/theme-toggle.js` — new file for toggle logic
- `js/side-panel.js` — may need adjustment for new vertical layout

## Files Not Modified
- `js/carousel.js`, `js/translator.js`, `js/contact-form.js`, `js/floating-cats.js`, `js/game.js`
- All image/audio assets
