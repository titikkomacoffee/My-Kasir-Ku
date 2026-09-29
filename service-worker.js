const CACHE_NAME = 'kasirpro-v3';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './dashboard.html',
  './kasir.html',
  './riwayat.html',
  './produk.html',
  './laporan.html',
  './piutang.html',
  './shift.html',
  './absensi.html',
  './karyawan.html',
  './pengaturan.html',
  './manifest.json',
  // HAPUS baris di bawah ini jika kamu memang tidak punya folder js/
  // Jika punya, pastikan path nya benar
  './js/supabase.js',
  './js/auth-guard.js',
  './js/ui.js',
  './js/theme.js',
  './js/midtrans.js'
];

// Install - Cache semua asset inti
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate - Hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Stale While Revalidate + Offline Fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // JANGAN cache API & Payment
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('midtrans')) return;
  if (url.hostname.includes('googleapis')) return;
  if (event.request.method !== 'GET') return;

  // Untuk halaman navigasi (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html') || caches.match('./dashboard.html');
      })
    );
    return;
  }

  // Untuk asset lain (CSS, JS, Manifest) - Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
