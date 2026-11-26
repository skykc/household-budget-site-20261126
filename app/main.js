// Router hash DompetKeluarga: 6 halaman, semua terjangkau dari nav.
// window.__shotReady false saat render, true setelah halaman tampil.

import { dashboard, calculator, tracker, goals, pricesPage, guide } from './views.js';

const app = document.getElementById('app');
const routes = {
  '': dashboard,
  kalkulator: calculator,
  pengeluaran: tracker,
  tujuan: goals,
  harga: pricesPage,
  panduan: guide,
};

function render() {
  window.__shotReady = false;
  const path = (location.hash.replace(/^#\/?/, '') || '').split('/')[0];
  const view = routes[path] || dashboard;
  view(app);
  document.querySelectorAll('.site-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#/' + path || (path === '' && href === '#/'));
  });
  document.title = path ? `DompetKeluarga — ${aTitle(path)}` : 'DompetKeluarga — Anggaran Rumah Tangga';
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function aTitle(path) {
  return { kalkulator: 'Kalkulator 50/30/20', pengeluaran: 'Pelacak Pengeluaran', tujuan: 'Tabungan dan Tujuan', harga: 'Harga Pokok', panduan: 'Panduan Anggaran' }[path] || 'Beranda';
}

window.addEventListener('hashchange', render);
render();
