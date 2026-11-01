const grid = document.querySelector("#products");

export function renderProducts(list) {
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No products found.</p>`;
    return;
  }
  grid.innerHTML = list
    .map(
      (p) => `
      <article class="card">
        <h3>${p.name}</h3>
        <p class="category">${p.category}</p>
        <p class="price">$${p.price}</p>
        <button type="button" data-id="${p.id}">Add to cart</button>
      </article>`,
    )
    .join("");
}

export function renderCart(count, total) {
  document.querySelector("#cart-counter").textContent = count;
  document.querySelector("#cart-total").textContent = `$${total}`;
}

export function onAddToCart(handler) {
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (button) handler(Number(button.dataset.id));
  });
}
