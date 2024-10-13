// sw.js
importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@5.1.4/build/workbox-sw.min.js');

if (workbox) {
  console.log `Workbox is loaded`;

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/'),
    new workbox.strategies.CacheFirst({
      cacheName: 'my-cache',
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'),
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith('.css') || url.pathname.endsWith('.js'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'asset-cache',
    })
  );

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          './index.html',
          './styles.css',
          './script.js',
          './src/assets/Intro.wav',
          './src/assets/Beat The Chasers.mp3',
        ]);
      })
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => {
            return cacheName !== 'my-cache';
          }).map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
} else {
  console.log `Workbox didn't load`;
}