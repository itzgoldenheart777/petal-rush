const CACHE = 'petal-rush-v1';
const ASSETS = ['./index.html','./buyer.html','./seller.html','./delivery.html','./admin.html','./shared.css','./firebase-config.js','./manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('firestore') || e.request.url.includes('googleapis') || e.request.url.includes('firebase')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (resp.ok) { const c = resp.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
      return resp;
    })).catch(() => caches.match('./index.html'))
  );
});
