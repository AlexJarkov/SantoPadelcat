// utils.js — Helpers reutilizables

/**
 * Formatea un precio a string con 2 decimales.
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

/**
 * Convierte un string a slug URL-friendly.
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Genera estrellas HTML según rating (0-5).
 * @param {number} rating
 * @returns {string}
 */
export function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < rating ? "var(--primary)" : "rgba(177,229,1,0.2)"}">★</span>`
  ).join("");
}

/**
 * Retorna el label legible de un badge.
 * @param {string} badge
 * @returns {string}
 */
export function badgeLabel(badge) {
  const map = { new: "NUEVO", sale: "OFERTA", hot: "TOP" };
  return map[badge] ?? badge.toUpperCase();
}

/**
 * Activa scroll reveal en elementos mediante IntersectionObserver.
 * @param {string} selector - CSS selector
 */
export function scrollReveal(selector) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(selector).forEach(el => {
    el.classList.add("reveal-pending");
    observer.observe(el);
  });
}
