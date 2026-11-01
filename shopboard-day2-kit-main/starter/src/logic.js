// logic.js: pure functions only, zero DOM, zero localStorage.

/**
 * Filters and sorts products based on search query, category, and sort order.
 * Always works on shallow copies so the original product array is never mutated.
 */
export function filterAndSortProducts(allProducts, { query = "", category = "all", sortBy = "default" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = allProducts.filter((product) => {
    const matchesQuery = normalizedQuery === "" || product.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory = category === "all" || product.category.toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  const sorted = [...filtered];

  if (sortBy === "price-asc") {
    sorted.sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price);
  } else if (sortBy === "price-desc") {
    sorted.sort((firstProduct, secondProduct) => secondProduct.price - firstProduct.price);
  }

  return sorted;
}

/**
 * Filter products by search query and category.
 */
export function filterProducts(allProducts, query = "", category = "all") {
  return filterAndSortProducts(allProducts, { query, category, sortBy: "default" });
}

/**
 * Sorts a copy of the product list by the selected option.
 */
export function sortProducts(productList, sortBy = "default") {
  const sortedCopy = [...productList];
  if (sortBy === "price-asc") {
    sortedCopy.sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price);
  } else if (sortBy === "price-desc") {
    sortedCopy.sort((firstProduct, secondProduct) => secondProduct.price - firstProduct.price);
  }
  return sortedCopy;
}

/**
 * Calculates total quantity of items in the cart.
 */
export function calculateCartCount(cartItems) {
  return cartItems.reduce((totalQuantity, currentItem) => totalQuantity + currentItem.qty, 0);
}

/**
 * Calculates total price of all items in the cart.
 */
export function calculateCartTotal(cartItems, allProducts) {
  const totalAmount = cartItems.reduce((runningTotal, currentItem) => {
    const matchedProduct = allProducts.find((product) => product.id === currentItem.id);
    if (!matchedProduct) return runningTotal;
    return runningTotal + matchedProduct.price * currentItem.qty;
  }, 0);

  return Number(totalAmount.toFixed(2));
}

export const getCartCount = calculateCartCount;
export const getCartTotal = calculateCartTotal;
