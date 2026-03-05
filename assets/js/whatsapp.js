// whatsapp.js — Generación de enlaces de WhatsApp
import { CONFIG } from "./config.js";

/**
 * Genera la URL de wa.me con mensaje predeterminado para un producto.
 * @param {Object} product - Objeto de producto desde products.json
 * @param {string} [variant] - Variante opcional (talla, color, etc.)
 * @returns {string}
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
    `¡Gracias!`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(lines)}`;
}

/**
 * Genera URL para consulta general (sin producto específico).
 * @param {string} [subject]
 * @returns {string}
 */
export function buildGeneralInquiryURL(subject = "Consulta general") {
  const message = `¡Hola Santo Padel! 👋\n\nTengo una consulta sobre: ${subject}\n\n¿Podrían ayudarme?\n¡Gracias!`;
  return `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
