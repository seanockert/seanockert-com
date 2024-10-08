const CACHE_NAME = 'parroty-003';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/style.css',
  '/assets/flag.svg',
  '/assets/localforage.min.js',
  '/assets/script.js',
  '/assets/petite-vue.es.js',
  '/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
