const CACHE_NAME = 'kasirpro-v1';
const URLS_TO_CACHE = [
  './', './index.html', './dashboard.html', './kasir.html',
  './produk.html', './laporan.html', './piutang.html', './shift.html',
  './absensi.html', './karyawan.html', './pengaturan.html',
  './js/supabase.js', './js/auth-guard.js', './js/ui.js', './js/theme.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('midtrans')) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./dashboard.html');
        }
      });
      return cached || networkFetch;
    })
  );
});