// Sirve la tienda pública con etiquetas Open Graph (WhatsApp, Facebook, etc.)
// generadas dinámicamente con el nombre, descripción y logo/portada reales
// de cada tienda. El resto de la página funciona igual que antes (el
// JavaScript del cliente carga los productos normalmente).

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://fdjoqjjzoayobtywfcto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkam9xamp6b2F5b2J0eXdmY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTQ3NzksImV4cCI6MjA5ODIzMDc3OX0.YeCtTdxB9C__Ih6DMeRJVmd3d-YS5qmcGG7Sze3okBI';
const DOMINIO_PUBLICO = 'https://tutiendabo.online';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

module.exports = async function handler(req, res) {
  const shop = req.query.shop;

  let nombre = 'Mi Tienda';
  let descripcion = 'Catálogo de productos por WhatsApp';
  let imagen = '';

  try {
    const url = `${SUPABASE_URL}/rest/v1/tiendas?slug=eq.${encodeURIComponent(shop)}&select=activa,config_tienda(nombre,descripcion,logo_url,portada_url)`;
    const r = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const data = await r.json();
    const tienda = Array.isArray(data) ? data[0] : null;
    const cfg = tienda && (Array.isArray(tienda.config_tienda) ? tienda.config_tienda[0] : tienda.config_tienda);

    if (cfg) {
      if (cfg.nombre)      nombre = cfg.nombre;
      if (cfg.descripcion) descripcion = cfg.descripcion;
      imagen = cfg.portada_url || cfg.logo_url || '';
    }
  } catch (e) {
    // Si Supabase falla, se sirve la página igual con los valores por defecto
  }

  const htmlPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const urlTienda = `${DOMINIO_PUBLICO}/${shop}`;
  const nombreSafe = escapeHtml(nombre);
  const descSafe   = escapeHtml(descripcion).slice(0, 200);

  const ogTags = `
  <meta property="og:type" content="website">
  <meta property="og:title" content="${nombreSafe}">
  <meta property="og:description" content="${descSafe}">
  <meta property="og:url" content="${urlTienda}">
  <meta property="og:site_name" content="${nombreSafe}">
  ${imagen ? `<meta property="og:image" content="${imagen}">
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="800">` : ''}
  <meta name="twitter:card" content="${imagen ? 'summary_large_image' : 'summary'}">
  <meta name="twitter:title" content="${nombreSafe}">
  <meta name="twitter:description" content="${descSafe}">
  ${imagen ? `<meta name="twitter:image" content="${imagen}">` : ''}
  <meta name="description" content="${descSafe}">`;

  html = html
    .replace('<title>Mi Tienda</title>', `<title>${nombreSafe}</title>`)
    .replace('<!-- OG_TAGS -->', ogTags);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
};
