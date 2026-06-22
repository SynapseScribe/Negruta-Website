# Stage: Investigate — Pipeline #1

## GitHub Issue

https://github.com/SynapseScribe/Negruta-Website/issues/1

## Findings

### Current State

- Site is already dark-themed (bg `#1a1a1a`, cards `#2a2a2a`, header `#000`).
- Zero CSS variables — all colors are hardcoded in `style.css`.
- No CSS framework, no preprocessors.
- Gold accent (`#d4af37`) used throughout.

### Side Panel Area (right side)

- `.side-panel-container` is `position: fixed; right: 0; top: 0; height: 100vh; width: 40px; z-index: 1000`.
- `.side-panel-trigger` (🐾) is absolutely positioned inside, vertically movable via JS.
- The theme toggle icon will be placed **above** the paws trigger, following the same vertical positioning pattern.

### CSS Variables Strategy

- Introduce `:root` variables for: background, card-bg, text, text-secondary, border-color.
- `[data-theme="light"]` overrides for light theme.
- Header uses fixed `#000` background (excluded from theming).

### Light Palette (proposed)

| Variable           | Dark (current) | Light (new)           |
| ------------------ | -------------- | --------------------- |
| `--bg`             | `#1a1a1a`      | `#f5f5f5`             |
| `--card-bg`        | `#2a2a2a`      | `#ffffff`             |
| `--text`           | `#f4f4f4`      | `#1a1a1a`             |
| `--text-secondary` | `#cccccc`      | `#555555`             |
| `--accent`         | `#d4af37`      | `#d4af37` (unchanged) |
| `--border`         | `#d4af37`      | `#d4af37` (unchanged) |

### Browser Compatibility

- CSS custom properties: supported in all modern browsers (IE11 excluded, not a concern).
- `prefers-color-scheme`: widely supported.
- `localStorage`: standard across all browsers.

### Responsive Impact

- Toggle should be hidden on mobile (`max-width: 768px`) since the side panel is already hidden.
- Same media query breakpoint already exists.
