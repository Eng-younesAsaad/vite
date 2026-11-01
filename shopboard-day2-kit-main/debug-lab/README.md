# ShopBoard debugging lab

This ShopBoard has **6 planted bugs**:

- 2 runtime bugs (a red error in the console)
- 2 logic bugs (it runs, but the answer is wrong)
- 2 state bugs (it breaks after a click or a refresh)

There is also 1 hidden bonus bug.

## Run it

```
cd debug-lab
npx vite
```

Open the URL it prints. (Opening index.html with a double click will not work, because the code uses modules.)

## Rules

1. First 20 minutes: **no AI.** Use the Console, breakpoints and the Application tab.
2. For every bug, fill one block in `debugging-log.md`.
3. Fix one bug at a time. Check that it is really fixed before you move on.

## What should work

- Search: typing "bag" shows only the 3 bags.
- Category filter and sort (both directions).
- Add to cart updates the count and the total.
- The cart is still there after you refresh the page.
