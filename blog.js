document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalCustom");
  const title = document.getElementById("customTitle");
  const text = document.getElementById("customText");
  const closeBtn = document.querySelector(".modal-close");

  const articles = {
    1: {
      title: "¿Cuándo afilar tus tijeras?",
      text: "Si notas que tus tijeras no cortan bien o dejan hilos, es momento de afilarlas. Un buen afilado cada 2-3 meses mantiene el filo y evita el desgaste prematuro.",
    },
    2: {
      title: "Cómo cuidar tus herramientas",
      text: "Limpia tus tijeras después de cada uso, sécalas bien y guárdalas cerradas. Aplica una gota de aceite en el tornillo una vez por semana.",
    },
    3: {
      title: "Errores comunes en casa",
      text: "Afilar con papel de lija o piedra en casa puede dañar el ángulo original del filo. El resultado suele ser peor e incluso irreversible.",
    },
  };

  document.querySelectorAll(".leer-mas").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      if (!articles[id]) return;
      title.textContent = articles[id].title;
      text.textContent = articles[id].text;
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  // Ловим клики по кнопкам "Добавить"
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image || "images/default.jpg",
    };

    addToCart(product);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });
});
