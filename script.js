// script.js

document.addEventListener("DOMContentLoaded", () => {
  // ---------- БУРГЕР-МЕНЮ ----------
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

  // ---------- КОРЗИНА ----------
  const cartButton = document.getElementById("cartButton");
  const cartButtonMobile = document.getElementById("cartButtonMobile");
  const cartCount = document.getElementById("cartCount");
  const cartCountMobile = document.getElementById("cartCountMobile");
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
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.warn("No se puede leer el carrito desde localStorage", e);
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem("filofino_cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    if (cartCount) {
      cartCount.textContent = totalQty.toString();
      cartCount.style.display = totalQty > 0 ? "inline-block" : "none";
    }
    if (cartCountMobile) {
      cartCountMobile.textContent = totalQty.toString();
      cartCountMobile.style.display = totalQty > 0 ? "inline-block" : "none";
    }
  }

  function addToCart(product) {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
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
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
  }

  function formatPrice(num) {
    return num.toFixed(2).replace(".", ",") + " €";
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    if (!cart.length) {
      cartItemsContainer.innerHTML =
        '<p class="text-center text-muted mb-0">Tu carrito está vacío.</p>';
      return;
    }

    let total = 0;

    const itemsHtml = cart
      .map((item) => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        return `
           <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
             <div class="d-flex align-items-center gap-3">
               ${
                 item.image
                   ? `<img src="${item.image}" alt="${item.name}" width="60" height="60" class="rounded">`
                   : ""
               }
               <div>
                 <strong>${item.name}</strong><br>
                 <small>${formatPrice(item.price)}</small>
               </div>
             </div>
             <div class="d-flex align-items-center gap-2">
               <button class="btn btn-sm btn-outline-secondary" data-cart-action="dec" data-id="${
                 item.id
               }">−</button>
               <span>${item.qty}</span>
               <button class="btn btn-sm btn-outline-secondary" data-cart-action="inc" data-id="${
                 item.id
               }">+</button>
               <button class="btn btn-sm btn-outline-danger" data-cart-action="remove" data-id="${
                 item.id
               }">
                 <i class="bi bi-trash"></i>
               </button>
             </div>
           </div>
         `;
      })
      .join("");

    cartItemsContainer.innerHTML = `
       <div class="cart-list">
         ${itemsHtml}
       </div>
       <div class="text-end mt-4">
         <h5>Total: <strong>${formatPrice(total)}</strong></h5>
       </div>
     `;
  }

  // Открытие корзины
  function openCart() {
    if (!cartModal) return;
    renderCart();
    cartModal.show();
  }

  if (cartButton) {
    cartButton.addEventListener("click", openCart);
  }

  if (cartButtonMobile) {
    cartButtonMobile.addEventListener("click", openCart);
  }

  // Клики внутри корзины (изменение количества / удаление)
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cart-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-cart-action");
      const id = btn.getAttribute("data-id");
      if (!id) return;

      if (action === "inc") changeQty(id, 1);
      else if (action === "dec") changeQty(id, -1);
      else if (action === "remove") removeFromCart(id);
    });
  }

  // Добавление товара в корзину (делегирование по всей странице)
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    // --- АНИМАЦИЯ ПОЛЁТА ---
    const card = btn.closest(".card");
    const imgEl = card ? card.querySelector("img") : null;
    const cartEl = document.getElementById("cartButton");
    if (imgEl && cartEl) flyToCartAnimation(imgEl, cartEl);

    const id = btn.getAttribute("data-id");
    const name = btn.getAttribute("data-name");
    const priceStr = btn.getAttribute("data-price");
    const image = btn.getAttribute("data-image");

    if (!id || !name || !priceStr) {
      console.warn("Faltan atributos data-* en el botón");
      return;
    }

    const price = Number(priceStr.replace(",", "."));
    if (Number.isNaN(price)) {
      console.warn("Precio incorrecto en data-price:", priceStr);
      return;
    }

    addToCart({ id, name, price, image });
  });

  // Оформление заказа — WhatsApp (можешь заменить на Telegram позже)
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!cart.length) {
        alert("Tu carrito está vacío.");
        return;
      }

      let total = 0;
      const lines = cart.map((item) => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        return `• ${item.name} — ${item.qty} ud. x ${item.price.toFixed(
          2
        )}€ = ${lineTotal.toFixed(2)}€`;
      });

      const message =
        "Nuevo pedido Filofino:%0A%0A" +
        lines.join("%0A") +
        `%0A%0ATotal: ${total.toFixed(2)}€`;

      // Номер подставь свой (тот, который используешь для WhatsApp)
      const phone = "34600111222";
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, "_blank");
    });
  }

  function flyToCartAnimation(imgEl, cartEl) {
    if (!imgEl || !cartEl) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const clone = imgEl.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = 9999;
    clone.style.transition = "all 0.8s cubic-bezier(.4,-0.3,.6,1.4)";
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.left = cartRect.left + cartRect.width / 2 + "px";
      clone.style.top = cartRect.top + cartRect.height / 2 + "px";
      clone.style.width = "20px";
      clone.style.height = "20px";
      clone.style.opacity = "0.4";
    });

    setTimeout(() => clone.remove(), 900);
  }

  // --- Изменение фона navbar при скролле ---
  document.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  function updateNavbarColor() {
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero-about");

    if (!navbar || !hero) return;

    const heroBottom = hero.getBoundingClientRect().bottom;

    // Если navbar НАД hero (фон тёмный) → белый текст
    if (heroBottom > 80) {
      navbar.classList.remove("light");
      navbar.classList.add("dark");
    }
    // Если navbar НА СВЕТЛОМ фоне
    else {
      navbar.classList.remove("dark");
      navbar.classList.add("light");
    }
  }

  document.addEventListener("scroll", updateNavbarColor);
  document.addEventListener("DOMContentLoaded", updateNavbarColor);

  function updateNavbarColor() {
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero-about");

    if (!navbar || !hero) return;

    const heroBottom = hero.getBoundingClientRect().bottom;

    // Если navbar НАД hero (фон тёмный) → белый текст
    if (heroBottom > 80) {
      navbar.classList.remove("light");
      navbar.classList.add("dark");
    }
    // Если navbar НА СВЕТЛОМ фоне
    else {
      navbar.classList.remove("dark");
      navbar.classList.add("light");
    }
  }

  document.addEventListener("scroll", updateNavbarColor);
  document.addEventListener("DOMContentLoaded", updateNavbarColor);

  // Первоначальное обновление счётчика
  updateCartCount();
});
