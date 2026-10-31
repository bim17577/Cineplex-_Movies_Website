// FOOD & DRINKS – cart and checkout

// Your Stripe PUBLISHABLE key (Dashboard → Developers → API keys).
// The matching secret key goes in stripe_config.php.
const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY";
const CART_STORAGE_KEY = "cineplex-food-cart";

const foodCards = document.querySelectorAll(".food-card");
const cartList = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const cartTotalValue = document.getElementById("cart-total-value");
const cartFab = document.getElementById("cart-fab");
const checkoutArea = document.getElementById("checkout-area");
const checkoutForm = document.getElementById("checkout-form");
const checkoutButton = document.getElementById("checkout-button");
const checkoutError = document.getElementById("checkout-error");
const cardPanel = document.getElementById("card-panel");
const orderSuccess = document.getElementById("order-success");

// Menu details are read from the cards so the prices live in one place on the page
const menu = {};
foodCards.forEach((card) => {
  menu[card.dataset.id] = {
    name: card.querySelector(".food-name").textContent,
    price: Number(card.dataset.price)
  };
});

const formatPrice = (amount) => "Rs. " + amount.toLocaleString("en-US");

// ---------- Cart state (remembered in this browser) ----------

let cart = {};
try {
  const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  Object.keys(saved).forEach((id) => {
    if (menu[id] && saved[id] > 0) cart[id] = saved[id];
  });
} catch {
  cart = {};
}

const saveCart = () => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage can be unavailable (private mode); the cart still works for this visit
  }
};

const cartCount = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
const cartSum = () => Object.entries(cart).reduce((sum, [id, qty]) => sum + menu[id].price * qty, 0);

function setQty(id, qty) {
  qty = Math.max(0, Math.min(20, qty));
  if (qty) cart[id] = qty;
  else delete cart[id];
  saveCart();
  render();
}

const stepperHTML = (id, qty, label) => `
  <div class="qty-stepper">
    <button type="button" data-action="dec" data-id="${id}" aria-label="Remove one ${label}"><i class="fas fa-minus"></i></button>
    <span aria-live="polite">${qty}</span>
    <button type="button" data-action="inc" data-id="${id}" aria-label="Add one more ${label}"><i class="fas fa-plus"></i></button>
  </div>`;

function render() {
  // Menu cards: "Add" button, or a quantity stepper once it's in the cart
  foodCards.forEach((card) => {
    const id = card.dataset.id;
    const qty = cart[id] || 0;
    card.classList.toggle("in-cart", qty > 0);
    card.querySelector(".food-actions").innerHTML = qty
      ? stepperHTML(id, qty, menu[id].name)
      : `<button type="button" class="add-button" data-action="inc" data-id="${id}"><i class="fas fa-plus"></i> Add</button>`;
  });

  // Order summary
  const ids = Object.keys(cart);
  cartList.innerHTML = ids
    .map((id) => `
      <li class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${menu[id].name}</span>
          <span class="cart-item-price">${formatPrice(menu[id].price)} each</span>
        </div>
        ${stepperHTML(id, cart[id], menu[id].name)}
        <strong class="cart-item-total">${formatPrice(menu[id].price * cart[id])}</strong>
      </li>`)
    .join("");

  const hasItems = ids.length > 0;
  const total = formatPrice(cartSum());
  cartEmpty.hidden = hasItems;
  cartTotal.hidden = !hasItems;
  checkoutForm.hidden = !hasItems;
  cartTotalValue.textContent = total;

  // Floating "view order" bar on small screens
  const count = cartCount();
  cartFab.hidden = !hasItems;
  document.getElementById("cart-fab-count").textContent = `${count} item${count === 1 ? "" : "s"}`;
  document.getElementById("cart-fab-total").textContent = total;

  updateCheckoutButton();
}

document.addEventListener("click", (e) => {
  const button = e.target.closest("[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  setQty(id, (cart[id] || 0) + (button.dataset.action === "inc" ? 1 : -1));
});

// ---------- Category filters ----------

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    const filter = chip.dataset.filter;
    foodCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// ---------- Payment ----------

const stripeReady = typeof Stripe === "function" && !STRIPE_PUBLISHABLE_KEY.includes("REPLACE");
const stripe = stripeReady ? Stripe(STRIPE_PUBLISHABLE_KEY) : null;
let cardElement = null;

const paymentMethod = () => checkoutForm.elements.payment.value;

// Until Stripe keys are added, start on cash so customers can still order
if (!stripe) checkoutForm.querySelector('input[value="cash"]').checked = true;

function updateCheckoutButton() {
  const isCard = paymentMethod() === "card";
  cardPanel.hidden = !isCard;
  checkoutButton.innerHTML = isCard
    ? `<i class="fas fa-lock"></i> Pay ${formatPrice(cartSum())}`
    : `<i class="fas fa-check"></i> Place Order · ${formatPrice(cartSum())}`;

  if (isCard && !cardElement) mountCardElement();
}

function mountCardElement() {
  if (!stripe) {
    document.getElementById("card-element").innerHTML =
      '<p class="card-unavailable">Card payments are not set up yet. Please choose Cash in Hand.</p>';
    return;
  }

  cardElement = stripe.elements().create("card", {
    hidePostalCode: true,
    style: {
      base: {
        color: "#f4f4f6",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "16px",
        iconColor: "#d6fc00",
        "::placeholder": { color: "#8a82ab" }
      },
      invalid: { color: "#ff6b6b", iconColor: "#ff6b6b" }
    }
  });
  cardElement.mount("#card-element");
  cardElement.on("change", (e) => (checkoutError.textContent = e.error ? e.error.message : ""));
}

checkoutForm.querySelectorAll('input[name="payment"]').forEach((radio) =>
  radio.addEventListener("change", () => {
    checkoutError.textContent = "";
    updateCheckoutButton();
  })
);

async function postJSON(url, data) {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch {
    throw new Error("We couldn't reach the server. Please make sure the site is running on your PHP server (e.g. XAMPP).");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
  return result;
}

function setBusy(busy) {
  checkoutButton.disabled = busy;
  checkoutButton.classList.toggle("is-busy", busy);
  if (busy) checkoutButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing…';
  else updateCheckoutButton();
}

function showSuccess(order, method) {
  checkoutArea.hidden = true;
  orderSuccess.hidden = false;
  document.getElementById("success-title").textContent = `Order #${order.orderId} confirmed!`;
  document.getElementById("success-text").textContent =
    method === "card"
      ? `We've received your card payment of ${formatPrice(order.total)}. Show your order number at the counter to collect.`
      : `Please pay ${formatPrice(order.total)} in cash at the counter when you collect your order.`;
  orderSuccess.scrollIntoView({ behavior: "smooth", block: "center" });

  cart = {};
  saveCart();
  render();
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  checkoutError.textContent = "";

  if (!checkoutForm.checkValidity()) {
    checkoutError.textContent = "Please enter your name and a valid email.";
    checkoutForm.reportValidity();
    return;
  }

  const method = paymentMethod();
  const order = {
    items: cart,
    name: checkoutForm.elements.name.value.trim(),
    email: checkoutForm.elements.email.value.trim(),
    payment_method: method
  };

  if (method === "card" && !cardElement) {
    checkoutError.textContent = "Card payments are not set up yet. Please choose Cash in Hand.";
    return;
  }

  setBusy(true);
  try {
    if (method === "card") {
      // 1. Server prepares the payment, 2. Stripe charges the card, 3. server saves the order
      const { clientSecret } = await postJSON("create_payment_intent.php", { items: cart });
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: order.name, email: order.email } }
      });
      if (result.error) throw new Error(result.error.message);
      order.payment_intent_id = result.paymentIntent.id;
    }

    const saved = await postJSON("food_order.php", order);
    showSuccess(saved, method);
  } catch (err) {
    checkoutError.textContent = err.message;
  } finally {
    setBusy(false);
  }
});

document.getElementById("new-order").addEventListener("click", () => {
  orderSuccess.hidden = true;
  checkoutArea.hidden = false;
  cardElement?.clear();
  render();
  document.querySelector(".food-menu").scrollIntoView({ behavior: "smooth" });
});

render();
