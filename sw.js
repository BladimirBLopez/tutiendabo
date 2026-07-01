// sw.js — Service Worker de TuTiendaBo
const CACHE_VERSION = 'tutiendabo-v2';
const ASSETS = ['/supabase.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS))
  );
  // Activa inmediatamente sin esperar que se cierren otras pestañas
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION)
          .map(k => caches.delete(k))
      )
    )
  );
  // Toma control de todas las pestañas abiertas inmediatamente
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Nunca cachear llamadas a Supabase — siempre deben ser frescas
  if (e.request.url.includes('supabase.co')) return;
  // Nunca cachear HTML — siempre debe ser fresco para recibir actualizaciones
  if (e.request.destination === 'document') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Solo cachear respuestas válidas
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        return response;
      });
    })
  );
});
