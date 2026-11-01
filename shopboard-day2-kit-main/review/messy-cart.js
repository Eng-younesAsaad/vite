// messy-cart.js
// This code works. Would you approve it in a code review?

import { products } from "../starter/src/products.js";

let c = [];

function calc2(id) {
  const x = products.find((p) => p.id === id);
  c.push(x);
  let t = 0;
  for (let i = 0; i < c.length; i++) {
    t = t + c[i].price;
  }
  t = t * 1.2;
  if (t > 100) {
    document.querySelector("#shipping").textContent = "Free shipping!";
  } else {
    t = t + 7.5;
    document.querySelector("#shipping").textContent = "Shipping: $7.5";
  }
  document.querySelector("#total").textContent = "$" + t.toFixed(2);
  localStorage.setItem("c", JSON.stringify(c));
}

function calc3() {
  let t = 0;
  for (let i = 0; i < c.length; i++) {
    t = t + c[i].price;
  }
  t = t * 1.2;
  if (t > 100) {
    return t;
  }
  return t + 7.5;
}

function doStuff() {
  const saved = localStorage.getItem("c");
  if (saved) c = JSON.parse(saved);
  document.querySelector("#count").textContent = c.length;
  document.querySelector("#total").textContent = "$" + calc3().toFixed(2);
}

export { calc2, calc3, doStuff };
