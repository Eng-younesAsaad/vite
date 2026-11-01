// ui.js: the ONLY file in the project allowed to touch document and the DOM.

const productGrid = document.querySelector("#product-grid");
const cartBadge = document.querySelector("#cart-count");
const cartTotalElement = document.querySelector("#cart-total");
const cartItemsContainer = document.querySelector("#cart-items");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-select");
const sortSelect = document.querySelector("#sort-select");

/**
 * Renders the products array into semantic article cards inside #product-grid.
 * Uses .map().join("") to eliminate stray commas.
 */
export function renderProducts(productList) {
  if (!productGrid) return;

  if (productList.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No bakery treats found</p>
        <p class="empty-subtitle">Try adjusting your search terms or selecting another category.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = productList
    .map((product) => `
      <article class="product-card" data-category="${product.category}">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
          <span class="product-badge">${product.category}</span>
        </div>
        <div class="product-details">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button
              type="button"
              class="btn-add-cart"
              data-action="add-to-cart"
              data-id="${product.id}"
              aria-label="Add ${product.name} to cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `)
    .join("");
}

/**
 * Renders the cart drawer contents, item rows, total price, and header badge.
 */
export function renderCart(cartItems, allProducts, { count, total } = {}) {
  // Update header cart count badge
  if (cartBadge) {
    cartBadge.textContent = String(count ?? 0);
  }

  // Update total in drawer
  if (cartTotalElement) {
    const formattedTotal = typeof total === "number" ? total.toFixed(2) : "0.00";
    cartTotalElement.textContent = `$${formattedTotal}`;
  }

  // Update cart item rows
  if (!cartItemsContainer) return;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <p class="cart-empty-title">Your cart is currently empty</p>
        <p class="cart-empty-text">Fill it with our handcrafted cookies, pastries, and treats!</p>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cartItems
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.id);
      if (!product) return "";
      const itemSubtotal = (product.price * item.qty).toFixed(2);

      return `
        <article class="cart-row" data-id="${item.id}">
          <img src="${product.image}" alt="${product.name}" class="cart-row-img" />
          <div class="cart-row-info">
            <h4 class="cart-row-title">${product.name}</h4>
            <span class="cart-row-unit-price">$${product.price.toFixed(2)} each</span>
            <div class="cart-row-controls">
              <div class="qty-stepper">
                <button
                  type="button"
                  class="qty-btn"
                  data-action="decrease-qty"
                  data-id="${item.id}"
                  aria-label="Decrease quantity of ${product.name}"
                >−</button>
                <span class="qty-display" aria-label="Quantity: ${item.qty}">${item.qty}</span>
                <button
                  type="button"
                  class="qty-btn"
                  data-action="increase-qty"
                  data-id="${item.id}"
                  aria-label="Increase quantity of ${product.name}"
                >+</button>
              </div>
              <span class="cart-row-subtotal">$${itemSubtotal}</span>
            </div>
          </div>
          <button
            type="button"
            class="cart-row-remove"
            data-action="remove-item"
            data-id="${item.id}"
            aria-label="Remove ${product.name} from cart"
          >
            Remove
          </button>
        </article>
      `;
    })
    .join("");
}

/**
 * Reads current values of the search input, category select, and sort select.
 */
export function getFilterValues() {
  return {
    query: searchInput ? searchInput.value : "",
    category: categorySelect ? categorySelect.value : "all",
    sortBy: sortSelect ? sortSelect.value : "default",
  };
}

/**
 * Sets category in the select dropdown and scrolls to shop section.
 */
export function setCategoryFilter(categoryName) {
  if (categorySelect) {
    categorySelect.value = categoryName;
  }
}

/**
 * Smoothly scrolls the window to the interactive shop section.
 */
export function scrollToShop() {
  const shopSection = document.querySelector("#shop");
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Opens the interactive cart drawer.
 */
export function openCartDrawer() {
  if (cartDrawer) {
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
  }
  if (cartOverlay) {
    cartOverlay.classList.add("is-visible");
  }
}

/**
 * Closes the interactive cart drawer.
 */
export function closeCartDrawer() {
  if (cartDrawer) {
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
  }
  if (cartOverlay) {
    cartOverlay.classList.remove("is-visible");
  }
}

/**
 * Toggles the cart drawer open or closed.
 */
export function toggleCartDrawer() {
  if (cartDrawer && cartDrawer.classList.contains("is-open")) {
    closeCartDrawer();
  } else {
    openCartDrawer();
  }
}

/**
 * Binds DOM event listeners ONCE using event delegation.
 * This ensures no event listener is attached inside render loops.
 */
export function setupUIListeners({
  onFilterChange,
  onAddToCart,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  onCategoryCardClick,
}) {
  // Input and change listeners for filter controls
  if (searchInput) {
    searchInput.addEventListener("input", onFilterChange);
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", onFilterChange);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", onFilterChange);
  }

  // Cart toggle buttons (header cart button & close button)
  const cartToggleBtn = document.querySelector("#cart-toggle");
  if (cartToggleBtn) {
    cartToggleBtn.addEventListener("click", toggleCartDrawer);
  }

  const closeCartBtn = document.querySelector("#close-cart-btn");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCartDrawer);
  }

  // Clear cart button
  const clearCartBtn = document.querySelector("#clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", onClearCart);
  }

  // Event delegation on document body for dynamic buttons
  document.body.addEventListener("click", (event) => {
    // 1. Add to cart button
    const addBtn = event.target.closest('[data-action="add-to-cart"]');
    if (addBtn) {
      const productId = Number(addBtn.dataset.id);
      if (!Number.isNaN(productId)) {
        onAddToCart(productId);
      }
      return;
    }

    // 2. Increase quantity button
    const increaseBtn = event.target.closest('[data-action="increase-qty"]');
    if (increaseBtn) {
      const productId = Number(increaseBtn.dataset.id);
      if (!Number.isNaN(productId)) {
        onQuantityChange(productId, 1);
      }
      return;
    }

    // 3. Decrease quantity button
    const decreaseBtn = event.target.closest('[data-action="decrease-qty"]');
    if (decreaseBtn) {
      const productId = Number(decreaseBtn.dataset.id);
      if (!Number.isNaN(productId)) {
        onQuantityChange(productId, -1);
      }
      return;
    }

    // 4. Remove item button
    const removeBtn = event.target.closest('[data-action="remove-item"]');
    if (removeBtn) {
      const productId = Number(removeBtn.dataset.id);
      if (!Number.isNaN(productId)) {
        onRemoveItem(productId);
      }
      return;
    }

    // 5. Category card click
    const categoryCard = event.target.closest("[data-category-filter]");
    if (categoryCard) {
      const selectedCategory = categoryCard.dataset.categoryFilter;
      if (selectedCategory) {
        onCategoryCardClick(selectedCategory);
      }
    }
  });

  // Close drawer on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartDrawer && cartDrawer.classList.contains("is-open")) {
      closeCartDrawer();
    }
  });
}
