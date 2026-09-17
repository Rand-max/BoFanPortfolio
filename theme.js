// The site now uses light mode only, including for returning visitors.
document.documentElement.removeAttribute('data-theme');
try { localStorage.removeItem('bofan-theme'); } catch {}
