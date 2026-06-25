# Issue 39 - Replace alert() with pop bubble in floating cats

## Problem
`js/floating-cats.js:123` uses a blocking `alert()` to show a cat fact when the user clicks a floating cat. This interrupts the playful floating cats experience and blocks interaction with other cats.

## Current Code
```js
alert(`Cat Fact: ${myFact}`);
```

## Proposed Solution
Replace with a pop bubble that appears near the clicked cat and auto-dismisses after a few seconds.

## Details
- Create a styled pop bubble element positioned near the clicked cat
- Bubble should have a playful, cat-themed design matching the site aesthetic
- Auto-dismiss after ~4 seconds with a fade-out animation
- Only one bubble visible at a time (dismiss previous if a new cat is clicked)
- Non-blocking - user can still interact with other elements
- Accessible (add `role="tooltip"` or `role="status"` for screen readers)

## Files Affected
- `js/floating-cats.js` - logic changes
- CSS file(s) - new styles for pop bubble