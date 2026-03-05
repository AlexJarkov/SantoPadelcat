# Santo Padel — Guía de Implementación del Proyecto

## Resumen del Proyecto

Transformar el HTML estático de Santo Padel en un sitio multi-página optimizado para **GitHub Pages**, reemplazando toda lógica de e-commerce por **redirección a WhatsApp** con mensajes predeterminados, y consumiendo datos de productos desde archivos JSON estáticos.

---

## 1. Estructura del Proyecto

```
santo-padel/
├── index.html                  # Landing page (hero + categorías + banner destacado + newsletter + footer)
├── categorias/
│   └── index.html              # Vista general de todas las categorías
├── productos/
│   ├── index.html              # Catálogo completo con filtros
│   └── detalle.html            # Página de detalle de producto (renderizado dinámico por query param)
├── nosotros/
│   └── index.html              # Sobre Santo Padel
├── contacto/
│   └── index.html              # Información de contacto + mapa
├── assets/
│   ├── css/
│   │   ├── global.css          # Variables CSS, reset, tipografía, navbar, footer
│   │   ├── home.css            # Estilos específicos del landing
│   │   ├── catalog.css         # Grid de productos, filtros, paginación
│   │   └── detail.css          # Layout de página de detalle
│   ├── js/
│   │   ├── config.js           # Constantes globales (número WhatsApp, URL base, etc.)
│   │   ├── components.js       # Navbar, footer, y componentes reutilizables (inyección dinámica)
│   │   ├── products.js         # Fetch de JSON, renderizado de cards, filtros
│   │   ├── detail.js           # Lectura de query param, render de detalle, botón WhatsApp
│   │   ├── whatsapp.js         # Generación de enlaces de WhatsApp con mensajes predeterminados
│   │   └── utils.js            # Helpers: formatPrice, slugify, scrollReveal, etc.
│   └── img/
│       ├── logo.svg            # Logo Santo Padel
│       ├── og-image.jpg        # Open Graph para compartir en redes
│       └── productos/          # Imágenes de productos (placeholder o reales)
│           ├── paleta-vertex-04.webp
│           └── ...
├── data/
│   ├── products.json           # Catálogo completo de productos
│   ├── categories.json         # Definición de categorías
│   └── brands.json             # Marcas disponibles
├── 404.html                    # Página de error personalizada
├── CNAME                       # Dominio personalizado (si aplica)
└── README.md
```

### Justificación de la estructura

GitHub Pages sirve archivos estáticos, por lo que cada "ruta" del sitio es un directorio con su propio `index.html`. La lógica dinámica (filtros, detalle de producto) se resuelve 100% en el cliente con JavaScript vanilla consumiendo los JSON de `/data/`.

---

## 2. Archivos JSON de Datos

### 2.1 `data/products.json`

```json
{
  "products": [
    {
      "id": "bullpadel-vertex-04-pro",
      "name": "Vertex 04 Pro",
      "brand": "bullpadel",
      "category": "paletas",
      "price": 389.99,
      "originalPrice": null,
      "badge": "new",
      "rating": 5,
      "shortDesc": "Paleta profesional de carbono. Forma diamante.",
      "longDesc": "La Bullpadel Vertex 04 Pro ofrece máxima potencia con carbono multicapa y un punto dulce amplio. Diseñada para jugadores avanzados que buscan agresividad sin sacrificar control.",
      "specs": {
        "peso": "360-375g",
        "forma": "Diamante",
        "material": "Carbono 12K",
        "balance": "Alto",
        "nivel": "Avanzado / Profesional"
      },
      "images": [
        "assets/img/productos/paleta-vertex-04.webp"
      ],
      "featured": true,
      "inStock": true
    },
    {
      "id": "head-sprint-pro-clay",
      "name": "Sprint Pro Clay",
      "brand": "head",
      "category": "calzado",
      "price": 129.99,
      "originalPrice": 159.99,
      "badge": "sale",
      "rating": 4,
      "shortDesc": "Zapatillas para superficies de arcilla y cemento.",
      "longDesc": "...",
      "specs": {
        "tipo": "Clay/Cemento",
        "material": "Mesh + TPU",
        "suela": "Herringbone",
        "tallas": "39-46"
      },
      "images": ["assets/img/productos/head-sprint-pro.webp"],
      "featured": true,
      "inStock": true
    }
  ]
}
```

> Repetir esta estructura para cada producto del catálogo. Usar `id` como slug para la página de detalle.

### 2.2 `data/categories.json`

```json
{
  "categories": [
    {
      "id": "paletas",
      "name": "Paletas",
      "icon": "🏓",
      "description": "Control, potencia y balance. Encontrá tu paleta ideal.",
      "productCount": 120
    },
    {
      "id": "calzado",
      "name": "Calzado",
      "icon": "👟",
      "description": "Agarre y comodidad para cada superficie de juego.",
      "productCount": 85
    },
    {
      "id": "indumentaria",
      "name": "Indumentaria",
      "icon": "👕",
      "description": "Ropa técnica con diseño y rendimiento profesional.",
      "productCount": 200
    },
    {
      "id": "accesorios",
      "name": "Accesorios",
      "icon": "🎒",
      "description": "Paleteros, grips, protectores, pelotas y más.",
      "productCount": 150
    }
  ]
}
```

### 2.3 `data/brands.json`

```json
{
  "brands": [
    { "id": "bullpadel", "name": "Bullpadel" },
    { "id": "head", "name": "Head" },
    { "id": "adidas", "name": "Adidas" },
    { "id": "nox", "name": "NOX" },
    { "id": "wilson", "name": "Wilson" },
    { "id": "babolat", "name": "Babolat" },
    { "id": "siux", "name": "Siux" }
  ]
}
```

---

## 3. Módulo de WhatsApp (`assets/js/whatsapp.js`)

Este módulo reemplaza toda la lógica de carrito y checkout.

```javascript
// whatsapp.js
const WHATSAPP_NUMBER = "591XXXXXXXX"; // Número de Santo Padel con código de país

/**
 * Genera la URL de la API de WhatsApp con un mensaje predeterminado.
 * @param {Object} product - Objeto del producto desde products.json
 * @param {string} [variant] - Variante opcional (talla, color, etc.)
 * @returns {string} URL completa de wa.me
 */
export function buildWhatsAppURL(product, variant = "") {
  const lines = [
    `¡Hola Santo Padel! 👋`,
    ``,
    `Me interesa el siguiente producto:`,
    ``,
    `🏷️ *${product.brand.toUpperCase()} ${product.name}*`,
    `💲 Precio: $${product.price.toFixed(2)}`,
    variant ? `📐 Variante: ${variant}` : "",
    ``,
    `¿Podrían confirmarme disponibilidad y forma de pago?`,
    `¡Gracias!`
  ].filter(Boolean).join("\n");

  const encoded = encodeURIComponent(lines);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Genera URL para consulta general (sin producto específico).
 * @param {string} subject - Asunto de la consulta
 * @returns {string}
 */
export function buildGeneralInquiryURL(subject = "Consulta general") {
  const message = encodeURIComponent(
    `¡Hola Santo Padel! 👋\n\nTengo una consulta sobre: ${subject}\n\n¿Podrían ayudarme?\n¡Gracias!`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
```

### Integración en las cards de producto

En cada card, el botón `+` (antiguo "agregar al carrito") se reemplaza por un ícono de WhatsApp que abre la conversación:

```javascript
// Dentro de products.js, al renderizar cada card:
const waURL = buildWhatsAppURL(product);

cardHTML += `
  <a href="${waURL}" target="_blank" rel="noopener"
     class="wa-btn" title="Consultar por WhatsApp">
    <svg>...</svg> <!-- Ícono de WhatsApp -->
  </a>
`;
```

### Integración en la página de detalle

El CTA principal de la página de detalle debe ser un botón verde de WhatsApp prominente:

```html
<a id="wa-cta" href="#" target="_blank" rel="noopener" class="btn-whatsapp">
  <svg>...</svg>
  CONSULTAR POR WHATSAPP
</a>
```

```javascript
// detail.js
import { buildWhatsAppURL } from "./whatsapp.js";

const product = await fetchProductById(productId);
document.getElementById("wa-cta").href = buildWhatsAppURL(product, selectedVariant);
```

---

## 4. Cambios Respecto al HTML Original

### 4.1 Elementos a Eliminar

| Elemento | Razón |
|---|---|
| Sección "Lo Que Dicen Nuestros Jugadores" (testimonios) | Indicación explícita del cliente |
| Ícono de carrito en navbar + badge de contador | Sin sistema de compras online |
| Botón `+` de "agregar al carrito" en cada card | Reemplazado por botón WhatsApp |
| Overlay "VISTA RÁPIDA" en hover de producto | Reemplazado por enlace a página de detalle |
| Sección de newsletter (formulario de suscripción) | Requiere backend; reemplazar por CTA de WhatsApp o redes sociales |

### 4.2 Elementos a Modificar

| Elemento | Cambio |
|---|---|
| Botón "VER COLECCIÓN" del hero | Redirige a `/productos/` |
| Botón "EXPLORAR" del hero | Redirige a `/categorias/` |
| Cards de categoría | Cada una enlaza a `/productos/?categoria=paletas` (etc.) |
| Cards de producto | Click lleva a `/productos/detalle.html?id=bullpadel-vertex-04-pro` |
| Botón "COMPRAR AHORA" del banner destacado | Se convierte en botón WhatsApp con producto prefijado |
| Links del footer (Paletas, Calzado, etc.) | Apuntan a `/productos/?categoria=X` |
| Métodos de pago del footer | Reemplazar por íconos de redes sociales o info de contacto |
| Navbar: ícono de carrito | Reemplazar por ícono de WhatsApp que abra consulta general |
| Navbar: ícono de cuenta/usuario | Eliminar (no hay sistema de cuentas) |

### 4.3 Elementos a Agregar

| Elemento | Detalle |
|---|---|
| Botón flotante de WhatsApp | Fijo en esquina inferior derecha, siempre visible, abre consulta general |
| Página de detalle de producto | Layout: imagen + info + specs + botón WhatsApp como CTA principal |
| Breadcrumbs | En páginas internas: `Inicio > Productos > Paletas > Vertex 04 Pro` |
| Meta tags SEO | `<title>`, `<meta description>`, Open Graph por página |
| Favicon | SVG del logo o ícono SP |

---

## 5. Arquitectura de Componentes Reutilizables

Al ser HTML estático sin framework, los componentes compartidos (navbar y footer) se inyectan vía JavaScript:

### `assets/js/components.js`

```javascript
export function renderNavbar(activePage = "") {
  return `
  <nav>
    <a href="/" class="logo">
      <span class="logo-icon">SP</span>
      SANTO <span>PADEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="/categorias/" class="${activePage === 'categorias' ? 'active' : ''}">Categorías</a></li>
      <li><a href="/productos/" class="${activePage === 'productos' ? 'active' : ''}">Tienda</a></li>
      <li><a href="/nosotros/" class="${activePage === 'nosotros' ? 'active' : ''}">Nosotros</a></li>
      <li><a href="/contacto/" class="${activePage === 'contacto' ? 'active' : ''}">Contacto</a></li>
    </ul>
    <div class="nav-actions">
      <a href="https://wa.me/591XXXXXXXX" target="_blank" rel="noopener"
         class="nav-btn wa-nav" title="Escribinos por WhatsApp">
        💬
      </a>
    </div>
  </nav>`;
}

export function renderFooter() {
  return `<!-- Mismo footer del HTML original, sin métodos de pago -->`;
}

// Inyección automática
document.getElementById("navbar-root").innerHTML = renderNavbar();
document.getElementById("footer-root").innerHTML = renderFooter();
```

Cada HTML tendrá:

```html
<div id="navbar-root"></div>
<!-- contenido de la página -->
<div id="footer-root"></div>
<script type="module" src="/assets/js/components.js"></script>
```

---

## 6. Página de Catálogo (`productos/index.html`)

### Funcionalidad

1. Al cargar, hace `fetch("/data/products.json")` y renderiza todas las cards.
2. Lee `?categoria=paletas` de la URL para filtrar automáticamente.
3. Los filter tabs aplican filtro en el cliente (no recarga página).
4. Cada card enlaza a `detalle.html?id={product.id}`.
5. El botón de acción de cada card es un enlace directo a WhatsApp.

### `assets/js/products.js` (estructura)

```javascript
import { buildWhatsAppURL } from "./whatsapp.js";

let allProducts = [];

async function init() {
  const res = await fetch("/data/products.json");
  const data = await res.json();
  allProducts = data.products;

  // Leer filtro de URL
  const params = new URLSearchParams(window.location.search);
  const categoryFilter = params.get("categoria");

  if (categoryFilter) {
    setActiveTab(categoryFilter);
    renderProducts(allProducts.filter(p => p.category === categoryFilter));
  } else {
    renderProducts(allProducts);
  }

  setupFilterTabs();
}

function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="detalle.html?id=${product.id}" class="product-img">
        <img src="/${product.images[0]}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge badge-${product.badge}">${badgeLabel(product.badge)}</span>` : ""}
      </a>
      <div class="product-info">
        <div class="product-brand">${product.brand.toUpperCase()}</div>
        <a href="detalle.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-desc">${product.shortDesc}</div>
        <div class="product-bottom">
          <div class="product-price">
            $${product.price.toFixed(2)}
            ${product.originalPrice ? `<span class="old">$${product.originalPrice.toFixed(2)}</span>` : ""}
          </div>
          <a href="${buildWhatsAppURL(product)}" target="_blank" rel="noopener"
             class="wa-btn" title="Consultar por WhatsApp">💬</a>
        </div>
      </div>
    </div>
  `).join("");
}

function setupFilterTabs() {
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const cat = tab.dataset.category;
      const filtered = cat === "todos"
        ? allProducts
        : allProducts.filter(p => p.category === cat);
      renderProducts(filtered);
      // Actualizar URL sin recargar
      const url = new URL(window.location);
      cat === "todos" ? url.searchParams.delete("categoria") : url.searchParams.set("categoria", cat);
      history.replaceState(null, "", url);
    });
  });
}

init();
```

---

## 7. Página de Detalle (`productos/detalle.html`)

### Funcionalidad

1. Lee `?id=bullpadel-vertex-04-pro` de la URL.
2. Busca el producto en `products.json`.
3. Renderiza: imagen, nombre, marca, precio, descripción larga, tabla de specs.
4. CTA principal: botón grande de WhatsApp con mensaje predeterminado.
5. Sección inferior: productos relacionados (misma categoría).

### Layout sugerido

```
┌──────────────────────────────────────────────┐
│  Breadcrumb: Inicio > Paletas > Vertex 04    │
├──────────────────┬───────────────────────────┤
│                  │  BULLPADEL                │
│   [Imagen del    │  Vertex 04 Pro            │
│    producto]     │  ★★★★★                    │
│                  │  $389.99                  │
│                  │                           │
│                  │  Descripción larga...     │
│                  │                           │
│                  │  ┌─────────────────────┐  │
│                  │  │ Peso    │ 360-375g  │  │
│                  │  │ Forma   │ Diamante  │  │
│                  │  │ Material│ Carbono   │  │
│                  │  └─────────────────────┘  │
│                  │                           │
│                  │  [  💬 CONSULTAR POR WA ] │
├──────────────────┴───────────────────────────┤
│  PRODUCTOS RELACIONADOS                      │
│  [card] [card] [card] [card]                 │
└──────────────────────────────────────────────┘
```

---

## 8. Botón Flotante de WhatsApp

Presente en todas las páginas, fijo en la esquina inferior derecha:

```css
.wa-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: #25D366;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  z-index: 999;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.wa-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37, 211, 102, 0.5);
}
.wa-float svg {
  width: 28px;
  height: 28px;
  fill: white;
}
```

```html
<a href="https://wa.me/591XXXXXXXX?text=¡Hola%20Santo%20Padel!%20Tengo%20una%20consulta."
   target="_blank" rel="noopener" class="wa-float" aria-label="Contactar por WhatsApp">
  <svg viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."/>
  </svg>
</a>
```

---

## 9. Configuración de GitHub Pages

### 9.1 Repositorio

1. Crear repositorio `santo-padel` en GitHub.
2. Subir toda la estructura del proyecto.
3. En **Settings > Pages**, seleccionar source: `main` branch, directorio `/` (root).

### 9.2 Rutas base

Si el sitio se publica en `https://usuario.github.io/santo-padel/`, todas las rutas absolutas deben contemplar el prefijo. Definir esto en `config.js`:

```javascript
// config.js
export const CONFIG = {
  BASE_URL: "/santo-padel",  // Cambiar a "" si se usa dominio personalizado
  WA_NUMBER: "591XXXXXXXX",
  SITE_NAME: "Santo Padel",
};
```

Y usarlo en todos los enlaces:

```javascript
import { CONFIG } from "./config.js";
// href = `${CONFIG.BASE_URL}/productos/?categoria=paletas`
```

### 9.3 SPA fallback con 404.html

GitHub Pages no soporta rewrite rules. Para manejar rutas dinámicas, usar un truco con `404.html` que redirija al `index.html` correspondiente, o simplemente mantener la estructura de directorios con `index.html` por carpeta (enfoque recomendado ya implementado en la estructura propuesta).

### 9.4 Dominio personalizado

Si se configura un dominio (ej: `santopadel.com.bo`):

1. Crear archivo `CNAME` en la raíz con el dominio.
2. Configurar registros DNS en el proveedor de dominio.
3. Cambiar `CONFIG.BASE_URL` a `""`.

---

## 10. SEO y Metadatos

Cada página debe incluir en su `<head>`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Paletas de Padel | Santo Padel Bolivia</title>
<meta name="description" content="Paletas profesionales de padel de las mejores marcas: Bullpadel, Head, NOX, Wilson. Envíos a toda Bolivia.">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:title" content="Santo Padel — Tienda de Padel en Bolivia">
<meta property="og:description" content="Equipamiento profesional de padel. Consultá disponibilidad por WhatsApp.">
<meta property="og:image" content="/assets/img/og-image.jpg">
<meta property="og:url" content="https://santopadel.com.bo/productos/">
<meta property="og:type" content="website">

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/assets/img/logo.svg">
```

---

## 11. Checklist de Implementación

### Fase 1 — Estructura base
- [ ] Crear estructura de directorios
- [ ] Extraer CSS del HTML monolítico a archivos separados (`global.css`, `home.css`, etc.)
- [ ] Crear `config.js` con número de WhatsApp y BASE_URL
- [ ] Implementar `components.js` con navbar y footer dinámicos
- [ ] Crear `404.html` personalizada

### Fase 2 — Datos y catálogo
- [ ] Poblar `products.json` con todos los productos (mínimo 8-10 iniciales)
- [ ] Poblar `categories.json` y `brands.json`
- [ ] Implementar `products.js` con fetch, renderizado y filtros
- [ ] Crear página de catálogo funcional con query params

### Fase 3 — WhatsApp y detalle
- [ ] Implementar `whatsapp.js` con el número real de Santo Padel
- [ ] Crear página de detalle con renderizado dinámico
- [ ] Agregar botón flotante de WhatsApp global
- [ ] Reemplazar todos los CTAs de compra por WhatsApp
- [ ] Eliminar carrito, testimonios, newsletter

### Fase 4 — Pulido y deploy
- [ ] Agregar imágenes reales de productos (o placeholders de calidad)
- [ ] Implementar meta tags SEO por página
- [ ] Agregar favicon y og-image
- [ ] Testing responsive (mobile-first ya que WhatsApp es mobile-heavy)
- [ ] Testing de todos los enlaces de WhatsApp (verificar que los mensajes se armen correctamente)
- [ ] Deploy en GitHub Pages
- [ ] Configurar dominio personalizado (si aplica)

---

## 12. Consideraciones Técnicas

**JavaScript Modules:** Todos los archivos JS usan `type="module"` para soporte de `import/export` nativo. GitHub Pages sirve archivos estáticos sin problemas con ES Modules en navegadores modernos.

**Sin dependencias externas de JS:** El proyecto no requiere npm, bundlers ni build steps. Todo corre directamente en el navegador. Los únicos recursos externos son las fuentes de Google Fonts y los CDN de íconos si se usan.

**Imágenes:** Usar formato WebP para productos (mejor compresión). Proveer fallback JPG con `<picture>` si se necesita soporte amplio. Implementar `loading="lazy"` en todas las imágenes del catálogo.

**Cache busting:** Para actualizaciones de JSON, agregar query param de versión al fetch: `fetch("/data/products.json?v=1.1")`. Esto fuerza al navegador a no usar cache viejo cuando se actualizan productos.
