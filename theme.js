// The site now uses light mode only, including for returning visitors.
document.documentElement.removeAttribute('data-theme');
try { localStorage.removeItem('bofan-theme'); } catch {}

// Share pointer gestures between the two carousels; keep vertical scrolling native.
document.addEventListener('DOMContentLoaded', () => {
  function addSwipe(surface, enabled, previous, next) {
    if (!surface) return;
    let gesture = null, suppressClickUntil = 0;
    surface.addEventListener('pointerdown', event => {
      if (gesture) { gesture = null; surface.classList.remove('is-dragging'); return; }
      if (!enabled() || !event.isPrimary || event.button !== 0 ||
          event.target.closest('#enable-sound, .single-controls, .video-arrow')) return;
      gesture = {id:event.pointerId, x:event.clientX, y:event.clientY, horizontal:false};
    });
    window.addEventListener('pointermove', event => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      if (!gesture.horizontal) {
        if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) { gesture = null; return; }
        if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
        gesture.horizontal = true;
        surface.classList.add('is-dragging');
      }
      event.preventDefault();
    }, {passive:false});
    const cancel = () => { gesture = null; surface.classList.remove('is-dragging'); };
    window.addEventListener('pointerup', event => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x, dragged = gesture.horizontal;
      cancel();
      if (!dragged) return;
      suppressClickUntil = Date.now() + 500;
      if (enabled() && Math.abs(dx) >= 45) (dx < 0 ? next : previous).click();
    });
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', cancel);
    surface.addEventListener('dragstart', event => { if (enabled()) event.preventDefault(); });
    surface.addEventListener('click', event => {
      if (event.isTrusted && Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }
  const view = document.querySelector('#work-view');
  addSwipe(view, () => view.classList.contains('is-single'),
    document.querySelector('#video-prev'), document.querySelector('#video-next'));
  addSwipe(document.querySelector('.project-stage'), () => true,
    document.querySelector('#previous'), document.querySelector('#next'));
});
