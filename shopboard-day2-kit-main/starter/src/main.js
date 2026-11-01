// main.js: application entry point connecting data, logic, state, and UI modules.

import { products } from "./data.js";
import { filterAndSortProducts, calculateCartCount, calculateCartTotal } from "./logic.js";
import { getCart, addToCart, changeQuantity, removeFromCart, clearCart } from "./state.js";
import {
  renderProducts,
  renderCart,
  getFilterValues,
  setCategoryFilter,
  openCartDrawer,
  scrollToShop,
  setupUIListeners,
} from "./ui.js";

/**
 * Re-filters and re-sorts products based on current UI inputs, then renders them.
 */
function updateProductView() {
  const filterOptions = getFilterValues();
  const visibleProducts = filterAndSortProducts(products, filterOptions);
  renderProducts(visibleProducts);
}

/**
 * Calculates current cart metrics and re-renders the cart drawer and badges.
 */
function updateCartView() {
  const currentCart = getCart();
  const totalCount = calculateCartCount(currentCart);
  const totalAmount = calculateCartTotal(currentCart, products);

  renderCart(currentCart, products, { count: totalCount, total: totalAmount });
}

/**
 * Handles adding a product to cart and updates cart UI.
 */
function handleAddToCart(productId) {
  addToCart(productId);
  updateCartView();
  openCartDrawer();
}

/**
 * Handles changing an item's quantity (+1 or -1) and updates cart UI.
 */
function handleQuantityChange(productId, delta) {
  changeQuantity(productId, delta);
  updateCartView();
}

/**
 * Handles removing an item from the cart and updates cart UI.
 */
function handleRemoveItem(productId) {
  removeFromCart(productId);
  updateCartView();
}

/**
 * Handles clearing all items from the cart and updates cart UI.
 */
function handleClearCart() {
  clearCart();
  updateCartView();
}

/**
 * Handles clicking a category card from the category strip section.
 */
function handleCategoryCardClick(categoryName) {
  setCategoryFilter(categoryName);
  updateProductView();
  scrollToShop();
}

// Wire up event listeners once (using event delegation inside ui.js)
setupUIListeners({
  onFilterChange: updateProductView,
  onAddToCart: handleAddToCart,
  onQuantityChange: handleQuantityChange,
  onRemoveItem: handleRemoveItem,
  onClearCart: handleClearCart,
  onCategoryCardClick: handleCategoryCardClick,
});

// Initial application render
updateProductView();
updateCartView();
