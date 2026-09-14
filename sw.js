/* ==========================================================================
   SiMika PWA - Service Worker Engine (Network-First with Offline Fallback)
   ========================================================================== */

const CACHE_NAME = 'simika-pwa-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './assets/simika-logo.png',
  './assets/simika-logo-hero.png',
  './js/data.js',
  './js/utils/calculators.js',
  './js/utils/security.js',
  './js/utils/validation.js',
  './js/components/public.js',
  './js/components/auth.js',
  './js/components/users.js',
  './js/components/dashboard.js',
  './js/components/participants.js',
  './js/components/scoring.js',
  './js/components/draw.js',
  './js/components/ranking.js',
  './js/components/combined.js',
  './js/components/announcement.js',
  './js/components/print.js',
  './js/app.js'
];

// Install Event: Pre-cache static assets & immediately activate
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker v6] Pre-caching fresh assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn(err));
    })
  );
});

// Activate Event: Delete all old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First strategy (Always get latest from server if online, fallback to cache if offline)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline Fallback from Cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});

