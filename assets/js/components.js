// components.js — Navbar, footer y botón flotante de WhatsApp
import { CONFIG } from "./config.js";
import { buildGeneralInquiryURL } from "./whatsapp.js";
import { getPrefix } from "./utils.js";

const WA_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.885a.5.5 0 0 0 .606.64l6.249-1.637A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.522-5.188-1.43l-.372-.22-3.856 1.011 1.03-3.763-.241-.389A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
</svg>`;

/**
 * Renderiza el HTML del navbar.
 * @param {string} activePage - ID de la página activa ('home'|'productos'|'categorias'|'nosotros'|'contacto')
 * @returns {string}
 */
export function renderNavbar(activePage = "") {
  const waURL = buildGeneralInquiryURL("productos y disponibilidad");
  const p = getPrefix();
  return `
  <nav id="main-nav">
    <a href="${p || "./"}" class="logo">
      <img src="${p}assets/images/logos/IMG_2075.png" alt="Santo Padel" style="height: 120px; width: auto; object-fit: contain;">
    </a>
    <ul class="nav-links">
      <li><a href="${p}categorias/" class="${activePage === "categorias" ? "active" : ""}">Categorías</a></li>
      <li><a href="${p}productos/" class="${activePage === "productos" ? "active" : ""}">Tienda</a></li>
      <li><a href="${p}nosotros/" class="${activePage === "nosotros" ? "active" : ""}">Nosotros</a></li>
      <li><a href="${p}contacto/" class="${activePage === "contacto" ? "active" : ""}">Contacto</a></li>
    </ul>
    <div class="nav-actions">
      <a href="${waURL}" target="_blank" rel="noopener" class="nav-btn" title="Escribinos por WhatsApp" aria-label="WhatsApp">
        💬
      </a>
    </div>
    <button class="nav-hamburger" aria-label="Menú" id="nav-hamburger-btn">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="nav-mobile-menu" id="nav-mobile-menu">
    <ul>
      <li><a href="${p}categorias/">Categorías</a></li>
      <li><a href="${p}productos/">Tienda</a></li>
      <li><a href="${p}nosotros/">Nosotros</a></li>
      <li><a href="${p}contacto/">Contacto</a></li>
      <li><a href="${waURL}" target="_blank" rel="noopener">WhatsApp</a></li>
    </ul>
  </div>`;
}

/**
 * Renderiza el HTML del footer.
 * @returns {string}
 */
export function renderFooter() {
  const waURL = buildGeneralInquiryURL("productos y disponibilidad");
  const p = getPrefix();
  return `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${p || "./"}" class="logo">
          <img src="${p}assets/images/logos/IMG_2075.png" alt="Santo Padel" style="height: 100px; width: auto; object-fit: contain;">
        </a>
        <p>Tu tienda especializada en padel. Equipamiento profesional de las mejores marcas del mundo, directo a Bolivia.</p>
        <div class="footer-socials">
          <a href="#" class="social-icon" aria-label="Instagram">IG</a>
          <a href="#" class="social-icon" aria-label="Facebook">FB</a>
          <a href="#" class="social-icon" aria-label="TikTok">TK</a>
          <a href="${waURL}" target="_blank" rel="noopener" class="social-icon" aria-label="WhatsApp">WA</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>TIENDA</h4>
        <a href="${p}productos/?categoria=paletas">Paletas</a>
        <a href="${p}productos/?categoria=calzado">Calzado</a>
        <a href="${p}productos/?categoria=indumentaria">Indumentaria</a>
        <a href="${p}productos/?categoria=accesorios">Accesorios</a>
      </div>
      <div class="footer-col">
        <h4>EMPRESA</h4>
        <a href="${p}nosotros/">Sobre Nosotros</a>
        <a href="${p}contacto/">Contacto</a>
      </div>
      <div class="footer-col">
        <h4>AYUDA</h4>
        <a href="${waURL}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        <a href="${p}contacto/">Información de contacto</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Santo Padel. Todos los derechos reservados.</span>
      <div class="footer-socials-bottom">
        <a href="#" class="social-icon" aria-label="Instagram">IG</a>
        <a href="#" class="social-icon" aria-label="TikTok">TK</a>
        <a href="${waURL}" target="_blank" rel="noopener" class="social-icon" aria-label="WhatsApp">WA</a>
      </div>
    </div>
  </footer>`;
}

/**
 * Renderiza el botón flotante de WhatsApp.
 * @returns {string}
 */
export function renderWAFloat() {
  const waURL = buildGeneralInquiryURL("productos y disponibilidad");
  return `
  <a href="${waURL}" target="_blank" rel="noopener"
     class="wa-float" aria-label="Contactar por WhatsApp">
    ${WA_SVG}
  </a>`;
}

/**
 * Inyecta navbar, footer y botón flotante en el DOM.
 * Llama a esta función con el nombre de la página activa.
 * @param {string} activePage
 */
export function initComponents(activePage = "") {
  const navRoot = document.getElementById("navbar-root");
  const footerRoot = document.getElementById("footer-root");
  const waRoot = document.getElementById("wa-root");

  if (navRoot) navRoot.innerHTML = renderNavbar(activePage);
  if (footerRoot) footerRoot.innerHTML = renderFooter();
  if (waRoot) waRoot.innerHTML = renderWAFloat();

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.style.padding = "0.2rem 3rem";
      nav.style.borderBottomColor = "rgba(177,229,1,0.12)";
    } else {
      nav.style.padding = "0.5rem 3rem";
      nav.style.borderBottomColor = "rgba(177,229,1,0.08)";
    }
  });

  // Hamburger toggle
  document.addEventListener("click", (e) => {
    if (e.target.closest("#nav-hamburger-btn")) {
      document.getElementById("nav-mobile-menu")?.classList.toggle("open");
    }
  });
}
