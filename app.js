const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, icon: '\uD83C\uDFA7' },
  { id: 2, name: 'Leather Wallet', price: 34.99, icon: '\uD83D\uDCB3' },
  { id: 3, name: 'Canvas Backpack', price: 59.99, icon: '\uD83C\uDF92' },
  { id: 4, name: 'Sunglasses', price: 24.99, icon: '\uD83D\uDC76' },
];

let state = products.map(p => ({ ...p, qty: 1 }));

const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const summary = document.getElementById('cart-summary');

function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}

function render() {
  cartItems.innerHTML = '';

  if (state.length === 0) {
    cartItems.innerHTML =
      '<div class="empty-cart">' +
      '<div class="empty-icon">\uD83D\uDED2</div>' +
      '<p>Your cart is empty</p>' +
      '<p>Add some items to get started!</p>' +
      '</div>';
    cartCount.textContent = '0 items';
    return;
  }

  const totalItems = state.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '');

  state.forEach(item => {
    const lineTotal = item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;
    div.innerHTML =
      '<div class="cart-item-img">' + item.icon + '</div>' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-price">' + formatPrice(item.price) + '</div>' +
      '</div>' +
      '<div class="cart-item-qty">' +
        '<button class="qty-btn" data-action="decrease">\u2212</button>' +
        '<span>' + item.qty + '</span>' +
        '<button class="qty-btn" data-action="increase">+</button>' +
      '</div>' +
      '<div class="cart-item-total">' + formatPrice(lineTotal) + '</div>' +
      '<button class="cart-item-remove" data-action="remove">\u2715</button>';
    cartItems.appendChild(div);
  });

  updateSummary();

  if (!summary.classList.contains('empty-cart')) {
    summary.removeAttribute('class');
  }
}

function updateSummary() {
  const subtotal = state.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 100 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  taxEl.textContent = formatPrice(tax);
  totalEl.textContent = formatPrice(total);
}

function updateQuantity(id, delta) {
  const item = state.find(i => i.id === id);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty < 1) return;
  item.qty = newQty;
  render();
}

function removeItem(id) {
  state = state.filter(i => i.id !== id);
  render();
}

cartItems.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const itemEl = btn.closest('.cart-item');
  if (!itemEl) return;
  const id = parseInt(itemEl.dataset.id, 10);
  const action = btn.dataset.action;

  if (action === 'increase') updateQuantity(id, 1);
  else if (action === 'decrease') updateQuantity(id, -1);
  else if (action === 'remove') removeItem(id);
});

render();
