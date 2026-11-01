const KEY = "shopboard-cart";

export function loadCart() {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveCart(cart) {
  localStorage.setItem(KEY, cart);
}

export function addToCart(cart, id) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    return cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
  }
  return [...cart, { id, qty: 1 }];
}
