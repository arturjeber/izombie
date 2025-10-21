const CACHE_NAME = 'meu-pwa-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, salva no cache (opcional, cache dinâmico)
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 1️⃣ Tenta pegar do cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;

          // 2️⃣ Se não tiver no cache e for navegação de página → redireciona para offline
          if (event.request.mode === 'navigate') {
            return caches.match('/offline');
          }
          // 3️⃣ Senão, apenas falha silenciosa
          return Response.error();
        });
      }),
  );
});
