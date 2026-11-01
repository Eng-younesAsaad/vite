import { products } from "./data.js";
import { searchProducts, filterByCategory, sortProducts, cartCount, cartTotal } from "./logic.js";
import { loadCart, saveCart, addToCart } from "./state.js";
import { renderProducts, renderCart, onAddToCart } from "./ui.js";

const search = document.querySelector("#search");
const category = document.querySelector("#category");
const sort = document.querySelector("#sort");

let cart = loadCart();

function update() {
  let list = searchProducts(products, search.value);
  list = filterByCategory(list, category.value);
  list = sortProducts(list, sort.value);
  renderProducts(list);

  onAddToCart((id) => {
    cart = addToCart(cart, id);
    saveCart(cart);
    updateCart();
  });
}

function updateCart() {
  renderCart(cartCount(cart), cartTotal(cart, products));
}

search.addEventListener("input", () => upadte());
category.addEventListener("change", () => update());
sort.addEventListener("change", () => update());

update();
updateCart();
