# Issue 39 - Plan Stage

## Changes

### `js/floating-cats.js`

1. Create a `showCatFact(catElement, fact)` function that:
   - Dismisses any existing bubble first (only one at a time)
   - Gets the clicked cat's position using `getBoundingClientRect()`
   - Creates a div element with the cat fact text
   - Positions it above/near the clicked cat
   - Adds fade-in class, shows bubble
   - Sets timeout to fade-out and remove after ~4 seconds
2. Replace `alert(...)` at line 123 with call to `showCatFact(cat, myFact)`
3. Add `role="status"` and `aria-live="polite"` for accessibility

### `style.css`

1. Add `.cat-fact-bubble` styles:
   - Fixed/absolute positioning
   - Playful styling: rounded corners, cat-themed colors (warm oranges, soft backgrounds)
   - Box shadow for depth
   - Max-width for mobile responsiveness
   - Fade-in/fade-out animation classes
2. Add `@keyframes` for bubble fade-in and fade-out animations

## Mobile Considerations

- Bubble max-width: 280px to fit small screens
- Position bubble above cat to avoid going off-screen at bottom
- Touch-friendly (no hover-dependent behavior)
