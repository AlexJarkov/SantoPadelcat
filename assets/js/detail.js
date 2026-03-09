// detail.js — Renderizado de página de detalle de producto
import { fetchProducts, renderProductCard } from "./products.js";
import { buildWhatsAppURL } from "./whatsapp.js";
import { formatPrice, renderStars, badgeLabel, scrollReveal, getPrefix } from "./utils.js";

const WA_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.885a.5.5 0 0 0 .606.64l6.249-1.637A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.522-5.188-1.43l-.372-.22-3.856 1.011 1.03-3.763-.241-.389A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
</svg>`;

const CATEGORY_NAMES = {
  paletas: "Paletas",
  calzado: "Calzado",
  indumentaria: "Indumentaria",
  accesorios: "Accesorios",
};

export async function initDetail() {
  const container = document.getElementById("detail-root");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    renderError(container);
    return;
  }

  let products;
  try {
    products = await fetchProducts();
  } catch {
    renderError(container, "No se pudo cargar el catálogo.");
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    renderError(container, "Producto no encontrado.");
    return;
  }

  // Update page title
  document.title = `${product.brand.toUpperCase()} ${product.name} | Santo Padel`;

  // Update breadcrumb
  const bc = document.getElementById("breadcrumb-product");
  if (bc) {
    bc.textContent = product.name;
    const bcCat = document.getElementById("breadcrumb-category");
    if (bcCat) {
      bcCat.textContent = CATEGORY_NAMES[product.category] ?? product.category;
      bcCat.href = `${getPrefix()}productos/?categoria=${product.category}`;
    }
  }

  // Render detail
  const waURL = buildWhatsAppURL(product);
  const imgContent = product.images?.[0]
    ? `<img src="${getPrefix()}${product.images[0]}" alt="${product.name}">`
    : `<svg class="detail-img-placeholder" viewBox="0 0 100 100"><circle cx="50" cy="35" r="20" fill="#b1e501" opacity="0.2"/><rect x="46" y="55" width="8" height="30" rx="3" fill="#b1e501" opacity="0.15"/></svg>`;

  const specsHTML = product.specs
    ? Object.entries(product.specs).map(([k, v]) =>
        `<tr><td>${k}</td><td>${v}</td></tr>`
      ).join("")
    : "";

  container.innerHTML = `
  <div class="detail-layout">
    <div class="detail-img-wrap">
      ${imgContent}
      ${product.badge ? `<span class="product-badge badge-${product.badge}" style="position:absolute;top:1rem;left:1rem">${badgeLabel(product.badge)}</span>` : ""}
    </div>
    <div class="detail-info">
      <div class="detail-brand">${product.brand.toUpperCase()}</div>
      <h1 class="detail-name">${product.name}</h1>
      <div class="detail-rating">
        ${renderStars(product.rating)}
        <span>(${product.rating}/5)</span>
      </div>
      <div class="detail-price">
        ${formatPrice(product.price)}
        ${product.originalPrice ? `<span class="old-price">${formatPrice(product.originalPrice)}</span>` : ""}
      </div>
      <p class="detail-desc">${product.longDesc}</p>
      ${specsHTML ? `
      <div class="detail-specs">
        <h4>ESPECIFICACIONES</h4>
        <table class="specs-table"><tbody>${specsHTML}</tbody></table>
      </div>` : ""}
      <div class="detail-cta">
        <a id="wa-cta" href="${waURL}" target="_blank" rel="noopener" class="btn-whatsapp">
          ${WA_SVG}
          CONSULTAR POR WHATSAPP
        </a>
      </div>
    </div>
  </div>`;

  // Related products
  const relatedGrid = document.getElementById("related-grid");
  if (relatedGrid) {
    const related = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
    if (related.length > 0) {
      relatedGrid.innerHTML = related.map(renderProductCard).join("");
      scrollReveal(".product-card");
    } else {
      document.getElementById("related-section")?.remove();
    }
  }
}

function renderError(container, msg = "Producto no encontrado.") {
  container.innerHTML = `
  <div class="detail-error">
    <h2>Oops</h2>
    <p>${msg}</p>
    <a href="${getPrefix()}productos/" class="btn-primary">Ver catálogo</a>
  </div>`;
}
