const CACHE = 'pendu-v2.1.6';

const FILES_CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './01.mp3',
  './02.mp3',
  './03.mp3',
  './menu.mp3',
  './Motmagique.mp3',
  './Motmagique.gif',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg'
];

const FILES_EXTRA = [
  './vid/1.mp4',
  './vid/2.mp4',
  './vid/3.mp4',
  './vid/4.mp4',
  './vid/5.mp4',
  './vid/6.mp4'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(FILES_CORE.map(f => new Request(f, { cache: 'reload' })))
        .then(() => {
          FILES_EXTRA.forEach((f) => {
            cache.add(new Request(f, { cache: 'reload' })).catch(() => {});
          });
        })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html', { ignoreSearch: true })
        .then((response) =>
          response || fetch(e.request).catch(() => new Response('', { status: 404 }))
        )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true })
      .then((response) =>
        response || fetch(e.request).catch(() => new Response('', { status: 404 }))
      )
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'getVersion') {
    e.source.postMessage(CACHE);
  }
});
