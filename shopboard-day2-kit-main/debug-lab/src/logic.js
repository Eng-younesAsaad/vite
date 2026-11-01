export function searchProducts(list, query) {
  const q = query.trim().toLowerCase();
  return list.filter((p) => p.name.includes(q));
}

export function filterByCategory(list, category) {
  if (category === "all") return list;
  return list.filter((p) => p.category === category);
}

export function sortProducts(list, order) {
  const copy = [...list];
  if (order === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (order === "price-desc") copy.sort((a, b) => a.price - b.price);
  return copy;
}

export function cartCount(cart) {
  return cart.reduce((n, item) => n + item.qty, 0);
}

export function cartTotal(cart, products) {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + product.price;
  }, 0);
}
