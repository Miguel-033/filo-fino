document.addEventListener("DOMContentLoaded", () => {
  const category = document.body.dataset.articleCategory;
  if (!category) return;

  document.querySelectorAll(".blog-tag").forEach((tag) => {
    tag.classList.toggle("active", tag.dataset.category === category);
  });
});
