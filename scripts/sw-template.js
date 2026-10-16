self.addEventListener('install', (event) =>
  event.waitUntil(
    (async () => {
      await (await caches.open(SHELL)).addAll(['/offline.html']);
      // Activating deletes the old caches, so a visitor who saved the site offline would
      // lose it on the next update. Installs happen online: save this version's core now.
      // If that fails, install fails and the old version keeps serving the saved copy.
      for (const key of await caches.keys())
        if (key.startsWith('songying-core-') && key !== CORE)
          if (await (await caches.open(key)).match('/__saved')) return saveCore();
    })(),
  ),
);
self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      // Waiting workers activate only after old clients close; never force-reload a visit.
      for (const key of await caches.keys())
        if (
          (key.startsWith('songying-core-') || key.startsWith('songying-shell-')) &&
          key !== CORE &&
          key !== SHELL
        )
          await caches.delete(key);
      await self.clients.claim();
    })(),
  ),
);
let saving;
async function saveCore() {
  const cache = await caches.open(CORE);
  const responses = await Promise.all(
    URLS.map(async (path) => {
      const response = await fetch(path, { cache: 'reload' });
      if (!response.ok) throw new Error('fetch');
      return [path, response];
    }),
  );
  for (const [path, response] of responses) await cache.put(path, response);
  const savedAt = new Date().toISOString();
  await cache.put('/__saved', new Response(JSON.stringify({ ready: true, savedAt })));
  return { ready: true, savedAt };
}
self.addEventListener('message', (event) => {
  if (!event.ports[0]) return;
  event.waitUntil(
    (async () => {
      try {
        if (event.data.type === 'SAVE_CORE') {
          saving ??= saveCore().finally(() => (saving = undefined));
          event.ports[0].postMessage(await saving);
        } else {
          const saved = await (await caches.open(CORE)).match('/__saved');
          event.ports[0].postMessage(saved ? await saved.json() : { ready: false });
        }
      } catch {
        event.ports[0].postMessage({ ready: false, error: 'save-failed' });
      }
    })(),
  );
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/')
  )
    return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CORE);
        const saved = await cache.match('/__saved');
        // If this build has been saved, pair its shell with its immutable data/code.
        if (saved) {
          const shell = await cache.match('/');
          if (shell) return shell;
        }
        try {
          return await fetch(event.request);
        } catch {
          return (
            (await (await caches.open(SHELL)).match('/offline.html')) ||
            new Response('離線內容尚未儲存。', {
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            })
          );
        }
      })(),
    );
    return;
  }
  if (URLS.includes(url.pathname))
    event.respondWith(
      (async () => {
        const cache = await caches.open(CORE);
        return (await cache.match(url.pathname)) || fetch(event.request);
      })(),
    );
  // No arbitrary runtime cache, third-party cache, or automatic 3D download.
});
