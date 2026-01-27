document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const categoryFromUrl = params.get("category") || "all";

  function initFilter() {
    const buttons = document.querySelectorAll(".blog-tag");
    const cards = document.querySelectorAll(".blog-card");

    if (!buttons.length || !cards.length) return false;

    function applyFilter(category) {
      buttons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === category);
      });

      cards.forEach((card) => {
        card.style.display =
          category === "all" || card.dataset.category === category
            ? "block"
            : "none";
      });
    }

    applyFilter(categoryFromUrl);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        history.replaceState(null, "", `?category=${category}`);
        applyFilter(category);
      });
    });

    return true;
  }

  // ждём, пока blog-categories.js дорисует кнопки
  const interval = setInterval(() => {
    if (initFilter()) clearInterval(interval);
  }, 50);
});
