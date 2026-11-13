// Foreground PWA update checks. Never reload an editing session automatically.
(() => {
  if (!('serviceWorker' in navigator)) return;
  let registration = null;
  let registering = null;
  let controlled = Boolean(navigator.serviceWorker.controller);
  let announced = false;
  function offerRefresh() {
    if (announced) return;
    announced = true;
    const banner = document.createElement('div');
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = 'position:fixed;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:10000;display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:16px;border-radius:12px;background:#263238;color:white;font:16px system-ui;box-shadow:0 4px 20px #0004';
    const text = document.createElement('span');
    text.textContent = 'Une nouvelle version de CM Pro est disponible.';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Actualiser';
    button.style.cssText = 'font:inherit;padding:10px 16px;border:0;border-radius:8px;cursor:pointer';
    button.addEventListener('click', () => window.location.reload());
    banner.append(text, button);
    document.body.append(banner);
  }
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (controlled) offerRefresh();
    controlled = true;
  });
  async function check() {
    if (!navigator.onLine) return;
    try {
      if (!registration) {
        registering ??= navigator.serviceWorker.register('cm_pro_sw.js', {scope:'./', updateViaCache:'none'});
        registration = await registering;
      }
      await registration.update();
    } catch (_) {
      // Keep the installed offline application; retry on the next online/resume event.
      if (!registration) registering = null;
    }
  }
  window.addEventListener('load', check);
  window.addEventListener('online', check);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
})();
