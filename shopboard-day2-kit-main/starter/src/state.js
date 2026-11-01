// state.js: cart state and localStorage persistence only, zero DOM.

const STORAGE_KEY = "crumea_cart";

/**
 * Safely loads the cart from localStorage.
 */
export function getCart() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the cart array to localStorage.
 */
function persistCart(cartItems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // Graceful fallback if localStorage is disabled or restricted
  }
  return cartItems;
}

/**
 * Adds a product to the cart by ID, or increments quantity if already present.
 */
export function addToCart(productId) {
  const currentCart = getCart();
  const existingItem = currentCart.find((item) => item.id === productId);

  let updatedCart;
  if (existingItem) {
    updatedCart = currentCart.map((item) => {
      if (item.id === productId) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
  } else {
    updatedCart = [...currentCart, { id: productId, qty: 1 }];
  }

  return persistCart(updatedCart);
}

/**
 * Changes item quantity by delta (+1 or -1).
 * Decreasing quantity below 1 removes the item completely.
 */
export function changeQuantity(productId, delta) {
  const currentCart = getCart();
  const existingItem = currentCart.find((item) => item.id === productId);

  if (!existingItem) return currentCart;

  const nextQuantity = existingItem.qty + delta;
  let updatedCart;

  if (nextQuantity <= 0) {
    updatedCart = currentCart.filter((item) => item.id !== productId);
  } else {
    updatedCart = currentCart.map((item) => {
      if (item.id === productId) {
        return { ...item, qty: nextQuantity };
      }
      return item;
    });
  }

  return persistCart(updatedCart);
}

/**
 * Removes an item completely from the cart by product ID.
 */
export function removeFromCart(productId) {
  const currentCart = getCart();
  const updatedCart = currentCart.filter((item) => item.id !== productId);
  return persistCart(updatedCart);
}

/**
 * Clears all items from the cart.
 */
export function clearCart() {
  return persistCart([]);
}

export const updateQuantity = changeQuantity;
export const loadCart = getCart;
export const saveCart = persistCart;
