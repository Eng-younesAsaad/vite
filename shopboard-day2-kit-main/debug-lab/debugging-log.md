# Debugging log

## Bug 1

- **What I saw:** On page load, the cart count and total in the header failed to render, and an uncaught TypeError was logged to the browser console.
- **Type:** runtime
- **How I found it:** Opened Chrome DevTools Console; saw `Uncaught TypeError: Cannot set properties of null (setting 'textContent')` pointing to `ui.js:22`.
- **Cause:** `debug-lab/src/ui.js`, line 22. The selector `#cart-counter` does not exist in `index.html` (the element has `id="cart-count"`), causing `document.querySelector` to return `null`.
- **Fix:** Changed `#cart-counter` to `#cart-count` in `ui.js`:
  ```javascript
  document.querySelector("#cart-count").textContent = count;
  ```
- **Did I use AI? For what?** No. Found directly via the DevTools Console error stack trace.

---

## Bug 2

- **What I saw:** Typing inside the search input had no effect on the products grid, and an uncaught ReferenceError appeared on every keystroke.
- **Type:** runtime
- **How I found it:** Typed "b" in the search box; the DevTools Console immediately flagged `Uncaught ReferenceError: upadte is not defined` at `main.js:29`.
- **Cause:** `debug-lab/src/main.js`, line 29. A typographical error in the callback name `() => upadte()` instead of `() => update()`.
- **Fix:** Fixed the typo in `main.js`:
  ```javascript
  search.addEventListener("input", () => update());
  ```
- **Did I use AI? For what?** No. Identified immediately from the console error message and line number.

---

## Bug 3

- **What I saw:** Typing "bag" in lowercase into the search box resulted in "No products found", despite three bag products existing in the catalog.
- **Type:** logic
- **How I found it:** Tested queries in the search box. Placed a breakpoint inside `searchProducts` at `logic.js:3` in the DevTools Sources tab and inspected `p.name` and `q`.
- **Cause:** `debug-lab/src/logic.js`, line 3. The search query was lowercased (`query.trim().toLowerCase()`), but product names were evaluated with raw casing (`p.name.includes(q)`). Because the product names have uppercase "Bag", case-sensitive comparison returned `false`.
- **Fix:** Added `.toLowerCase()` to `p.name` in `logic.js`:
  ```javascript
  return list.filter((p) => p.name.toLowerCase().includes(q));
  ```
- **Did I use AI? For what?** No. Verified by stepping through the breakpoint in the browser debugger.

---

## Bug 4

- **What I saw:** Selecting "Price: high to low" from the Sort dropdown sorted products from lowest to highest price ($25 to $150), identical to "Price: low to high".
- **Type:** logic
- **How I found it:** Selected "Price: high to low" in the UI and noticed the items remained in ascending price order. Asked AI to inspect the sort comparator functions in `logic.js`.
- **Cause:** `debug-lab/src/logic.js`, line 14. The comparator for `"price-desc"` was written as `a.price - b.price` instead of `b.price - a.price`.
- **Fix:** Inverted the comparator subtraction in `logic.js`:
  ```javascript
  if (order === "price-desc") copy.sort((a, b) => b.price - a.price);
  ```
- **Did I use AI? For what?** Yes. Prompted AI to check `sortProducts` in `logic.js` for comparator formula bugs.

---

## Bug 5

- **What I saw:** Adding products to the cart worked during the session, but refreshing the page crashed with `SyntaxError: Unexpected token 'o', "[object Object]" is not valid JSON` and wiped the cart.
- **Type:** state
- **How I found it:** Opened Chrome DevTools Application tab > Local Storage. The value stored for `shopboard-cart` was the string `"[object Object],[object Object]"` instead of valid JSON.
- **Cause:** `debug-lab/src/state.js`, line 9. `saveCart` called `localStorage.setItem(KEY, cart)` without serialization. Passing an array of objects coerced it to `[object Object]` via `.toString()`.
- **Fix:** Wrapped `cart` with `JSON.stringify` in `state.js`:
  ```javascript
  export function saveCart(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }
  ```
- **Did I use AI? For what?** No. Detected by inspecting raw key-value storage in the DevTools Application tab.

---

## Bug 6

- **What I saw:** When adding multiple units of the same product to the cart, the cart item counter incremented (e.g., 2 items), but the total price only reflected a single item ($89 instead of $178).
- **Type:** state
- **How I found it:** Added "Leather Tote Bag" ($89) twice and compared expected total ($178) against displayed total ($89). Asked AI to review `cartTotal` in `logic.js`.
- **Cause:** `debug-lab/src/logic.js`, line 25. The accumulator calculation in `cartTotal` was `sum + product.price` instead of multiplying by `item.qty`.
- **Fix:** Multiplied product price by item quantity in `logic.js`:
  ```javascript
  export function cartTotal(cart, products) {
    return cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.id);
      return sum + product.price * item.qty;
    }, 0);
  }
  ```
- **Did I use AI? For what?** Yes. Used AI to audit the `reduce` calculation in `cartTotal` against multi-quantity cart states.

---

## Bonus Bug

- **What I saw:** After filtering or searching a few times, clicking "Add to cart" once added 3 to 5 duplicate items to the cart simultaneously.
- **Type:** state
- **How I found it:** Inspected `#products` in DevTools Elements tab > Event Listeners. Observed multiple identical click listener handlers stacked on the container.
- **Cause:** `debug-lab/src/main.js`, lines 18-22. `onAddToCart` was invoked inside the `update()` function, binding an additional click event listener every time the user filtered, searched, or sorted.
- **Fix:** Moved `onAddToCart` outside of `update()` in `main.js` so it only registers once on script initialization.
- **Did I use AI? For what?** No. Discovered via DevTools Event Listeners panel.
