# Issue 38 - Replace alert() with inline success message in contact form

## Problem

`js/contact-form.js:6` uses a blocking `alert()` to notify the user that their message was sent. This interrupts the user flow, is inaccessible, and provides poor UX.

## Current Code

```js
alert("Meow! Your message has been sent to Negruta's fan club!");
```

## Proposed Solution

Replace with a styled inline success message that appears below the form and auto-fades after 3 seconds.

## Details

- Inject a `<p class="success-message">` element below the form on submit
- Style it with a green/cat-themed color, matching the site's aesthetic
- Add a CSS fade-out animation, auto-remove the element after ~3s
- Keep the form reset behavior (`contactForm.reset()`)
- Non-blocking, accessible (add `role="status"` for screen readers)

## Files Affected

- `js/contact-form.js` - logic changes
- CSS file(s) - new styles for success message
- Possibly `index.html` or the relevant HTML file for the contact form container
