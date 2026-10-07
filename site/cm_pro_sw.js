// App resources only. Business data stays in IndexedDB, never HTTP caches.
const VERSION = 'cm-pro-shell-64830ff324afdf4e916a';
const ASSETS = ["./", "assets/AssetManifest.bin", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/NOTICES", "assets/assets/branding/cm_pro/app_icon.png", "assets/assets/branding/cm_pro/logo.png", "assets/assets/fonts/DejaVuSans-Bold.ttf", "assets/assets/fonts/DejaVuSans.ttf", "assets/assets/fonts/LICENSE-DejaVu.txt", "assets/assets/technical/catalogue.json", "assets/fonts/MaterialIcons-Regular.otf", "assets/fonts/fallback/Roboto-Regular.ttf", "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "canvaskit/canvaskit.js", "canvaskit/canvaskit.js.symbols", "canvaskit/canvaskit.wasm", "canvaskit/chromium/canvaskit.js", "canvaskit/chromium/canvaskit.js.symbols", "canvaskit/chromium/canvaskit.wasm", "canvaskit/skwasm.js", "canvaskit/skwasm.js.symbols", "canvaskit/skwasm.wasm", "canvaskit/skwasm_heavy.js", "canvaskit/skwasm_heavy.js.symbols", "canvaskit/skwasm_heavy.wasm", "canvaskit/webparagraph/canvaskit.js", "canvaskit/webparagraph/canvaskit.js.symbols", "canvaskit/webparagraph/canvaskit.wasm", "canvaskit/wimp.js", "canvaskit/wimp.js.symbols", "canvaskit/wimp.wasm", "favicon.png", "flutter.js", "flutter_bootstrap.js", "icons/Icon-192.png", "icons/Icon-512.png", "icons/Icon-maskable-192.png", "icons/Icon-maskable-512.png", "icons/apple-touch-icon.png", "index.html", "main.dart.js", "manifest.json", "sqflite_sw.js", "sqlite3.wasm", "version.json"];
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(VERSION);
  await cache.addAll(ASSETS);
  self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) {
    if (key.startsWith('cm-pro-shell-') && key !== VERSION) await caches.delete(key);
  }
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.pathname.startsWith(new URL('./', self.location.href).pathname) ||
      url.pathname.includes('/auth/') || url.pathname.includes('/rest/') ||
      url.pathname.includes('/storage/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok && ASSETS.some(path => new URL(path, self.location.href).href === url.href)) {
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return await cache.match('./');
      throw error;
    }
  })());
});
