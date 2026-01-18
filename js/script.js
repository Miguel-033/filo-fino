// script.js — CLEAN VERSION

document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     BURGER MENU
  =============================== */
  const burgerToggle = document.getElementById("burgerToggle");
  const burgerMenu = document.getElementById("burgerMenu");
  const closeBurger = document.getElementById("closeBurger");

  if (burgerToggle && burgerMenu) {
    burgerToggle.addEventListener("click", () => {
      burgerMenu.classList.add("open");
      document.body.classList.add("overflow-hidden");
    });
  }

  if (closeBurger && burgerMenu) {
    closeBurger.addEventListener("click", () => {
      burgerMenu.classList.remove("open");
      document.body.classList.remove("overflow-hidden");
    });
  }

  if (burgerMenu) {
    burgerMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        burgerMenu.classList.remove("open");
        document.body.classList.remove("overflow-hidden");
      });
    });
  }

  /* ===============================
     NAVBAR SCROLL EFFECT
  =============================== */
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    const handleNavbarScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    handleNavbarScroll(); // initial state
    window.addEventListener("scroll", handleNavbarScroll);
  }

  /* ===============================
     CART LOGIC
  =============================== */
  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  const cartModalEl = document.getElementById("cartModal");
  const cartItemsContainer = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const cartModal =
    cartModalEl && typeof bootstrap !== "undefined"
      ? new bootstrap.Modal(cartModalEl)
      : null;

  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem("filofino_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem("filofino_cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) {
      cartCount.textContent = totalQty;
      cartCount.style.display = totalQty > 0 ? "inline-block" : "none";
    }
  }

  function addToCart(product) {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      renderCart();
    }
  }

  function formatPrice(num) {
    return num.toFixed(2).replace(".", ",") + " €";
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    if (!cart.length) {
      cartItemsContainer.innerHTML =
        '<p class="text-center text-muted">Tu carrito está vacío.</p>';
      return;
    }

    let total = 0;

    cartItemsContainer.innerHTML =
      cart
        .map((item) => {
          total += item.price * item.qty;
          return `
          <div class="cart-item">
            <strong>${item.name}</strong>
            <div>
              <button data-dec="${item.id}">−</button>
              <span>${item.qty}</span>
              <button data-inc="${item.id}">+</button>
              <button data-remove="${item.id}">🗑</button>
            </div>
          </div>
        `;
        })
        .join("") +
      `<div class="text-end mt-3"><strong>Total: ${formatPrice(
        total
      )}</strong></div>`;
  }

  if (cartButton && cartModal) {
    cartButton.addEventListener("click", () => {
      renderCart();
      cartModal.show();
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      const id =
        e.target.dataset.inc || e.target.dataset.dec || e.target.dataset.remove;

      if (!id) return;

      if (e.target.dataset.inc) changeQty(id, 1);
      if (e.target.dataset.dec) changeQty(id, -1);
      if (e.target.dataset.remove) removeFromCart(id);
    });
  }

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image || "",
    };

    if (!product.id || !product.name || isNaN(product.price)) return;
    addToCart(product);
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!cart.length) return alert("Tu carrito está vacío");

      const text = cart
        .map((i) => `${i.name} x${i.qty} = ${i.price * i.qty}€`)
        .join("%0A");

      window.open(
        `https://wa.me/34600111222?text=Pedido Filofino:%0A${text}`,
        "_blank"
      );
    });
  }

  updateCartCount();
});
