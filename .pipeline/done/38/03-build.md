# Issue 38 - Build Stage

## Changes Made

### `js/contact-form.js`

- Removed `alert()` call
- Form resets immediately on submit
- Creates a `<p class="success-message" role="status">` element dynamically
- Inserts it after the form using `insertAdjacentElement("afterend", msg)`
- Auto-removes the element after 3500ms (3s visible + 0.5s fade animation)

### `style.css`

- Added `.success-message` class with green-themed success styling
- Added `@keyframes fadeOut` animation (0.5s ease, 3s delay, forwards fill)
- Message fades out and slides up slightly before removal
