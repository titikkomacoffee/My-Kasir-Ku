// ============================================
// SERVICE WORKER — KasirKu PWA
// ============================================

const CACHE_NAME = 'kasirku-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './dashboard.html',
  './kasir.html',
  './produk.html',
  './laporan.html',
  './piutang.html',
  './shift.html',
  './absensi.html',
  './karyawan.html',
  './pengaturan.html',
  './js/supabase.js',
  './js/auth-guard.js',
  './js/theme.js',
  './manifest.json'
];

// ============================================
// INSTALL — cache semua file penting
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch(err => {
        console.warn('[SW] Beberapa file gagal di-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ============================================
// ACTIVATE — hapus cache lama
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Hapus cache lama:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ============================================
// FETCH — strategi cache
// Network first untuk API, cache first untuk asset
// ============================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Jangan cache request ke Supabase (harus selalu fresh)
  if (url.hostname.includes('supabase.co')) {
    return; // biarkan browser handle langsung
  }

  // Jangan cache request ke Midtrans/API pihak ketiga
  if (url.hostname.includes('midtrans') || url.hostname.includes('api.')) {
    return;
  }

  // Untuk request GET saja
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        // Update cache dengan versi terbaru
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Kalau offline & tidak ada di cache → kasih halaman fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./dashboard.html');
        }
      });

      // Kembalikan cache dulu kalau ada, sambil update di background
      return cached || networkFetch;
    })
  );
});

// ============================================
// MESSAGE — handle dari halaman (opsional)
// ============================================
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
