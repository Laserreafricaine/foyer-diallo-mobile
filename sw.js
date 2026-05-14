const CACHE_NAME = 'foyer-mobile-v3';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {

  // Toujours essayer le réseau d'abord
  event.respondWith(
    fetch(event.request)
      .then(response => {

        const responseClone = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseClone));

        return response;

      })
      .catch(() => {
        return caches.match(event.request);
      })
  );

});