const CACHE_NAME = 'cluckulator-001';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-egg.png',
  'https://pub-f4adc2b52417432b8b0d1eceb5c7d1f4.r2.dev/effect-cluck.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
