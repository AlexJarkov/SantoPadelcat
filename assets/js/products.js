// products.js — Fetch, renderizado y filtros del catálogo
import { CONFIG } from "./config.js";
import { buildWhatsAppURL } from "./whatsapp.js";
import { formatPrice, renderStars, badgeLabel, scrollReveal } from "./utils.js";

const WA_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.885a.5.5 0 0 0 .606.64l6.249-1.637A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.522-5.188-1.43l-.372-.22-3.856 1.011 1.03-3.763-.241-.389A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
</svg>`;

let allProducts = [];

/**
 * Carga products.json y devuelve el array de productos.
 * @returns {Promise<Array>}
 */
export async function fetchProducts() {
  const res = await fetch(`${CONFIG.BASE_URL}/data/products.json?v=1.0`);
  if (!res.ok) throw new Error("No se pudo cargar products.json");
  const data = await res.json();
  return data.products;
}

/**
 * Renderiza HTML de una card de producto.
 * @param {Object} product
 * @returns {string}
 */
export function renderProductCard(product) {
  const waURL = buildWhatsAppURL(product);
  const detailURL = `${CONFIG.BASE_URL}/productos/detalle.html?id=${product.id}`;
  const imgContent = product.images?.[0]
    ? `<img src="${CONFIG.BASE_URL}/${product.images[0]}" alt="${product.name}" loading="lazy">`
    : `<svg class="placeholder-svg" viewBox="0 0 100 100"><circle cx="50" cy="35" r="20" fill="#b1e501" opacity="0.2"/><rect x="46" y="55" width="8" height="30" rx="3" fill="#b1e501" opacity="0.15"/></svg>`;

  return `
  <div class="product-card" data-category="${product.category}">
    <a href="${detailURL}" class="product-img" tabindex="-1">
      ${imgContent}
      ${product.badge ? `<span class="product-badge badge-${product.badge}">${badgeLabel(product.badge)}</span>` : ""}
    </a>
    <div class="product-info">
      <div class="product-brand">${product.brand.toUpperCase()}</div>
      <a href="${detailURL}" class="product-name">${product.name}</a>
      <div class="product-desc">${product.shortDesc}</div>
      <div class="product-rating">${renderStars(product.rating)}</div>
      <div class="product-bottom">
        <div class="product-price">
          ${formatPrice(product.price)}
          ${product.originalPrice ? `<span class="old">${formatPrice(product.originalPrice)}</span>` : ""}
        </div>
        <a href="${waURL}" target="_blank" rel="noopener"
           class="wa-card-btn" title="Consultar por WhatsApp" aria-label="WhatsApp">
          ${WA_SVG}
        </a>
      </div>
    </div>
  </div>`;
}

/**
 * Inicializa el catálogo en una página que tenga #products-grid y .filter-tab.
 * Lee ?categoria= de la URL para filtro inicial.
 */
export async function initCatalog() {
  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("products-count");
  if (!grid) return;

  try {
    allProducts = await fetchProducts();
  } catch {
    grid.innerHTML = `<div class="catalog-empty"><p>No se pudo cargar el catálogo. Intentá de nuevo.</p></div>`;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get("categoria") || "todos";

  // Marcar tab activo inicial
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === initialCat);
  });

  renderFiltered(initialCat, grid, countEl);
  setupFilterTabs(grid, countEl);
  scrollReveal(".product-card");
}

function renderFiltered(category, grid, countEl) {
  const filtered = category === "todos"
    ? allProducts
    : allProducts.filter(p => p.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="catalog-empty"><p>No hay productos en esta categoría por el momento.</p></div>`;
  } else {
    grid.innerHTML = filtered.map(renderProductCard).join("");
    scrollReveal(".product-card");
  }

  if (countEl) {
    countEl.innerHTML = `<strong>${filtered.length}</strong> producto${filtered.length !== 1 ? "s" : ""}`;
  }
}

function setupFilterTabs(grid, countEl) {
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.dataset.category;
      renderFiltered(cat, grid, countEl);
      // Actualizar URL sin recargar
      const url = new URL(window.location.href);
      cat === "todos"
        ? url.searchParams.delete("categoria")
        : url.searchParams.set("categoria", cat);
      history.replaceState(null, "", url);
    });
  });
}

/**
 * Renderiza un grid reducido de productos destacados (para home).
 * @param {string} gridId - ID del elemento contenedor
 * @param {number} [limit=8]
 */
export async function initFeaturedGrid(gridId, limit = 8) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  try {
    allProducts = await fetchProducts();
  } catch {
    return;
  }

  let displayed = allProducts.slice(0, limit);
  grid.innerHTML = displayed.map(renderProductCard).join("");
  scrollReveal(".product-card");

  // Filter tabs en home
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.dataset.category;
      const filtered = cat === "todos"
        ? allProducts.slice(0, limit)
        : allProducts.filter(p => p.category === cat).slice(0, limit);
      grid.innerHTML = filtered.map(renderProductCard).join("");
      scrollReveal(".product-card");
    });
  });
}
