# CLAUDE.md

## Project

CRUMÉA (ShopBoard): An artisan bakery & cookies e-commerce landing page. Vanilla HTML, CSS, and JavaScript (ES Modules). Vite for the dev server.

## Rules (Day 1 - HTML & CSS)

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Only one `<h1>` on the page.
- Buttons are `<button type="button">` (or `submit`), links are `<a href="...">`. Never use `<div onclick="...">`.
- Every `<input>` and `<select>` must have an associated `<label for="...">`.
- Every `<img>` must have a descriptive `alt` attribute.
- Mobile-first CSS: start at `360px` base styles and use `@media (min-width: 768px)` and `@media (min-width: 1280px)` only. Never use `max-width` media queries or `!important`.
- Use CSS custom properties (variables) in `tokens.css` for colors, fonts, and spacing.

## Rules (Day 2 - JavaScript, DOM & State)

- Never mutate the original products array when sorting or filtering; always copy first (`[...list].sort(...)`) so selecting "Default" restores the original order.
- Always use `.join("")` after `.map()` when building HTML strings for `innerHTML` so stray commas never appear in the DOM.
- Never attach event listeners inside `render()` functions. Attach listeners once in `main.js` and use event delegation (`e.target.closest("[data-action]")`) on parent containers so filtering 5 times never adds 5 items on a single click.
- Always serialize with `JSON.stringify()` before `localStorage.setItem()` and parse safely with `JSON.parse(localStorage.getItem(...) ?? "[]")` when loading.
- Decreasing an item's quantity below 1 must remove the item from the cart completely (never allow 0 or negative quantities).
- No magic numbers and no single-letter variable names; each function does one job.
- Explain any file you create or modify in one line.

## Architecture (Four Jobs, Four Files + Main)

- `src/data.js`: Exports the products array and categories only. No logic, no DOM, no localStorage.
- `src/logic.js`: Pure functions only (`filterProducts`, `sortProducts`, `getCartCount`, `getCartTotal`). Never touches `document` (DOM) or `localStorage`.
- `src/state.js`: Manages cart state (`getCart`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`) and syncs with `localStorage`. Never touches `document` (DOM).
- `src/ui.js`: The ONLY file allowed to touch `document` / the DOM (renders products, updates cart drawer/modal, updates badge counts and totals, reads form inputs).
- `src/main.js`: Entry point that imports from the four modules, initializes the app, and wires up event listeners.
