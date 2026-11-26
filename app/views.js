// Semua halaman DompetKeluarga. Render + ikat kontrol, tanpa request jaringan.
// Penyimpanan contoh hanya di localStorage peramban.

import { household, monthly, defaultExpenses, expenseCategories, defaultGoals, prices, tips } from './data.js';

export const fmt = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const plain = (n) => Math.round(n).toLocaleString('id-ID');

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* abaikan */ }
}

function donut(needs, wants, save) {
  const total = needs + wants + save;
  const r = 70;
  const c = 2 * Math.PI * r;
  const seg = (v) => (v / total) * c;
  const parts = [
    { v: needs, color: '#0e7a5f' },
    { v: wants, color: '#d97706' },
    { v: save, color: '#2563eb' },
  ];
  let offset = 0;
  const circles = parts.map((p) => {
    const len = seg(p.v);
    const s = `<circle cx="90" cy="90" r="${r}" fill="none" stroke="${p.color}" stroke-width="34" stroke-dasharray="${len.toFixed(1)} ${c.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += len;
    return s;
  }).join('');
  return `<svg viewBox="0 0 180 180" width="150" height="150" role="img" aria-label="Donat alokasi 50 30 20">${circles}<text x="90" y="86" text-anchor="middle" font-size="17" font-weight="800" fill="#1a2b26">50/30/20</text><text x="90" y="106" text-anchor="middle" font-size="12" fill="#5b6b65">dari penghasilan</text></svg>`;
}

/* ---------------- Beranda ---------------- */
export function dashboard(app) {
  const h = household;
  const saveRate = Math.round((h.planSave / h.income) * 100);
  const unallocated = h.income - h.planTotal;
  const maxV = 9200000;
  const bars = monthly.map((m) => `
    <div class="bar-row"><span>${m.month}</span>
      <span class="bar-pair">
        <span class="bar-track"><span class="bar-fill inc" style="display:block;width:${Math.round((m.income / maxV) * 100)}%"></span></span>
        <span class="bar-track"><span class="bar-fill exp" style="display:block;width:${Math.round((m.expense / maxV) * 100)}%"></span></span>
      </span>
      <span class="bar-val">${(m.expense / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} jt</span></div>`).join('');
  app.innerHTML = `
  <h1>Anggaran ${h.name}, November 2026</h1>
  <p class="lede">Keluarga ${h.members} orang di ${h.city}. Penghasilan, rencana belanja, dan tabungan bulan ini dalam satu layar.</p>
  <div class="grid-kpi">
    <div class="kpi"><div class="label">Penghasilan / bulan</div><div class="value">${fmt(h.income)}</div><div class="sub">Ayah ${fmt(6200000)} + Ibu ${fmt(3000000)}</div></div>
    <div class="kpi"><div class="label">Rencana belanja</div><div class="value">${fmt(h.planTotal)}</div><div class="sub">Belanja ${fmt(h.planSpend)} + tabungan ${fmt(h.planSave)}</div></div>
    <div class="kpi"><div class="label">Tabungan</div><div class="value green">${fmt(h.planSave)}</div><div class="sub">Tingkat tabungan ${saveRate}% dari penghasilan</div></div>
    <div class="kpi"><div class="label">Sisa belum dialokasikan</div><div class="value">${fmt(unallocated)}</div><div class="sub">Penghasilan dikurangi total rencana</div></div>
  </div>
  <div class="grid-2">
    <section class="card"><h2>Aturan 50/30/20</h2>
      ${donut(4600000, 2760000, 1840000)}
      <ul class="legend">
        <li><span><span class="dot" style="background:#0e7a5f"></span>Kebutuhan 50%</span><b>${fmt(4600000)}</b></li>
        <li><span><span class="dot" style="background:#d97706"></span>Keinginan 30%</span><b>${fmt(2760000)}</b></li>
        <li><span><span class="dot" style="background:#2563eb"></span>Tabungan 20%</span><b>${fmt(1840000)}</b></li>
      </ul>
      <p class="note">Target tabungan 50/30/20 adalah ${fmt(1840000)}; rencana keluarga ${fmt(h.planSave)} — selisih ${fmt(60000)} masuk ke sisa belum dialokasikan.</p>
    </section>
    <section class="card"><h2>Pemasukan vs pengeluaran</h2>
      <p class="note">Jun–Nov 2026. Hijau = pemasukan (Rp 9.200.000 tiap bulan), kuning = pengeluaran; angka kanan = pengeluaran (juta rupiah).</p>
      ${bars}
      <p class="note"><b>November paling hemat:</b> keluar ${fmt(7820000)}, di bawah rencana ${fmt(h.planTotal)}.</p>
    </section>
  </div>
  <section class="card"><h2>Rencana November 2026</h2>
    <div class="result-line"><span>Belanja — kebutuhan ${fmt(h.planNeeds)} + keinginan ${fmt(h.planWants)}</span><span class="amt">${fmt(h.planSpend)}</span></div>
    <div class="result-line"><span>Tabungan</span><span class="amt">${fmt(h.planSave)}</span></div>
    <div class="result-line"><span>Total rencana</span><span class="amt">${fmt(h.planTotal)}</span></div>
    <div class="result-line"><span>Sisa belum dialokasikan</span><span class="amt">${fmt(unallocated)}</span></div>
    <p class="note">Sisa belum dialokasikan = penghasilan ${fmt(h.income)} dikurangi total rencana ${fmt(h.planTotal)}. Sisa ini bisa masuk dana darurat atau ditahan untuk kebutuhan tak terduga.</p>
  </section>`;
}

/* ---------------- Kalkulator 50/30/20 ---------------- */
const calc = { income: 9200000, needs: 50, wants: 30, save: 20 };

export function calculator(app) {
  app.innerHTML = `
  <h1>Kalkulator 50/30/20</h1>
  <p class="lede">Masukkan penghasilan bulanan, geser alokasinya, dan lihat pembagian kebutuhan, keinginan, dan tabungan.</p>
  <section class="card">
    <label for="calc-income">Penghasilan per bulan (Rp)</label>
    <input type="number" id="calc-income" min="0" value="${calc.income}">
    <p><button type="button" class="secondary" id="calc-ump">Pakai UMP DKI Jakarta 2026 — Rp 5.729.876</button></p>
    <p class="note">UMP DKI Jakarta 2026 Rp 5.729.876 (Pemprov DKI Jakarta).</p>
    <div class="slider-row"><label for="calc-needs">Kebutuhan</label><input type="range" id="calc-needs" min="0" max="100" value="${calc.needs}"><output id="out-needs">${calc.needs}%</output></div>
    <div class="slider-row"><label for="calc-wants">Keinginan</label><input type="range" id="calc-wants" min="0" max="100" value="${calc.wants}"><output id="out-wants">${calc.wants}%</output></div>
    <div class="slider-row"><label for="calc-save">Tabungan</label><input type="range" id="calc-save" min="0" max="100" value="${calc.save}"><output id="out-save">${calc.save}%</output></div>
  </section>
  <section class="card"><h2>Hasil pembagian</h2><div id="calc-result"></div></section>`;
  const incomeEl = app.querySelector('#calc-income');
  const resultEl = app.querySelector('#calc-result');
  function render() {
    const inc = calc.income;
    const needsAmt = (inc * calc.needs) / 100;
    const wantsAmt = (inc * calc.wants) / 100;
    const saveAmt = (inc * calc.save) / 100;
    resultEl.innerHTML = `
      <div class="result-line"><span>Kebutuhan (${calc.needs}%) — tempat tinggal, makan, listrik, transport</span><span class="amt">${fmt(needsAmt)}</span></div>
      <div class="result-line"><span>Keinginan (${calc.wants}%) — hiburan, makan di luar, langganan</span><span class="amt">${fmt(wantsAmt)}</span></div>
      <div class="result-line"><span>Tabungan (${calc.save}%) — dana darurat, pendidikan, liburan</span><span class="amt">${fmt(saveAmt)}</span></div>`;
    app.querySelector('#out-needs').textContent = calc.needs + '%';
    app.querySelector('#out-wants').textContent = calc.wants + '%';
    app.querySelector('#out-save').textContent = calc.save + '%';
    app.querySelector('#calc-needs').value = calc.needs;
    app.querySelector('#calc-wants').value = calc.wants;
    app.querySelector('#calc-save').value = calc.save;
  }
  function balance(changed, value) {
    const order = { needs: ['save', 'wants'], wants: ['save', 'needs'], save: ['wants', 'needs'] };
    let delta = value - calc[changed];
    calc[changed] = value;
    if (delta > 0) {
      for (const k of order[changed]) {
        const take = Math.min(calc[k], delta);
        calc[k] -= take;
        delta -= take;
        if (delta <= 0) break;
      }
      if (delta > 0) calc[changed] -= delta;
    } else if (delta < 0) {
      calc[order[changed][0]] += -delta;
    }
  }
  incomeEl.addEventListener('input', () => {
    calc.income = Math.max(0, Number(incomeEl.value) || 0);
    render();
  });
  app.querySelector('#calc-ump').addEventListener('click', () => {
    calc.income = household.umpJakarta2026;
    incomeEl.value = String(calc.income);
    render();
  });
  for (const key of ['needs', 'wants', 'save']) {
    app.querySelector('#calc-' + key).addEventListener('input', (ev) => {
      balance(key, Number(ev.target.value));
      render();
    });
  }
  render();
}

/* ---------------- Pelacak pengeluaran ---------------- */
export function tracker(app) {
  let expenses = load('dk-expenses-v1', null);
  if (!expenses) { expenses = defaultExpenses.map((e) => ({ ...e })); save('dk-expenses-v1', expenses); }
  app.innerHTML = `
  <h1>Pelacak Pengeluaran</h1>
  <p class="lede">Pengeluaran contoh November 2026. Tambah, hapus, cari, atau saring menurut kategori.</p>
  <section class="card"><p id="tracker-summary"></p>
    <div class="toolbar">
      <div><label for="tracker-search">Cari pengeluaran</label><input type="text" id="tracker-search" placeholder="mis. beras"></div>
      <div><label for="tracker-filter">Saring kategori</label><select id="tracker-filter"><option value="">Semua kategori</option>${expenseCategories.map((c) => `<option>${c}</option>`).join('')}</select></div>
    </div>
    <div id="tracker-list"></div>
  </section>
  <section class="card"><h2>Tambah pengeluaran</h2>
    <form id="expense-form">
      <label for="exp-name">Nama pengeluaran</label>
      <input type="text" id="exp-name" required placeholder="mis. Beras medium 5 kg">
      <label for="exp-amount">Jumlah (Rp)</label>
      <input type="number" id="exp-amount" min="0" required placeholder="67500">
      <label for="exp-category">Kategori</label>
      <select id="exp-category">${expenseCategories.map((c) => `<option>${c}</option>`).join('')}</select>
      <button type="submit">Tambah</button>
    </form>
  </section>`;
  const summaryEl = app.querySelector('#tracker-summary');
  const listEl = app.querySelector('#tracker-list');
  const searchEl = app.querySelector('#tracker-search');
  const filterEl = app.querySelector('#tracker-filter');
  function total() { return expenses.reduce((s, e) => s + e.amount, 0); }
  function render() {
    summaryEl.innerHTML = `<b>Total November 2026: ${fmt(total())}</b> dari ${expenses.length} pengeluaran.`;
    const q = searchEl.value.trim().toLowerCase();
    const cat = filterEl.value;
    const shown = expenses.filter((e) =>
      (!q || e.name.toLowerCase().includes(q)) && (!cat || e.category === cat));
    listEl.innerHTML = shown.length ? shown.map((e) => `
      <div class="expense-row"><div><div>${e.name}</div><div class="cat">${e.category}</div></div>
      <div class="amt">${fmt(e.amount)}</div>
      <button type="button" class="danger" data-del="${e.id}">Hapus</button></div>`).join('')
      : '<p class="empty">Tidak ada pengeluaran yang cocok.</p>';
    listEl.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
      expenses = expenses.filter((e) => e.id !== b.dataset.del);
      save('dk-expenses-v1', expenses);
      render();
    }));
  }
  searchEl.addEventListener('input', render);
  filterEl.addEventListener('change', render);
  app.querySelector('#expense-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = app.querySelector('#exp-name').value.trim();
    const amount = Number(app.querySelector('#exp-amount').value);
    const category = app.querySelector('#exp-category').value;
    if (!name || !(amount >= 0)) return;
    expenses.unshift({ id: 'u' + Date.now(), name, category, amount });
    save('dk-expenses-v1', expenses);
    app.querySelector('#exp-name').value = '';
    app.querySelector('#exp-amount').value = '';
    render();
  });
  render();
}

/* ---------------- Tabungan / tujuan ---------------- */
export function goals(app) {
  let goals = load('dk-goals-v1', null);
  if (!goals) { goals = defaultGoals.map((g) => ({ ...g })); save('dk-goals-v1', goals); }
  app.innerHTML = `
  <h1>Tabungan dan Tujuan</h1>
  <p class="lede">Tiga tujuan keluarga Hartono, lengkap dengan estimasi bulan menuju target berdasarkan setoran rutin.</p>
  <div class="grid-2" id="goals-grid"></div>
  <section class="card"><h2>Tambah setoran</h2>
    <label for="goal-pick">Pilih tujuan</label>
    <select id="goal-pick">${goals.map((g) => `<option value="${g.id}">${g.name}</option>`).join('')}</select>
    <label for="goal-amount">Jumlah setoran (Rp)</label>
    <input type="number" id="goal-amount" min="0" value="250000">
    <button type="button" id="goal-add">Tambah setoran</button>
  </section>`;
  const grid = app.querySelector('#goals-grid');
  function render() {
    grid.innerHTML = goals.map((g) => {
      const pct = Math.min(100, Math.round((g.current / g.target) * 100));
      const rest = Math.max(0, g.target - g.current);
      const months = rest === 0 ? 0 : Math.max(1, Math.round(rest / g.monthly));
      return `<section class="card goal-card"><h3>${g.name}</h3>
        <p class="note">${g.note}</p>
        <div class="progress"><div style="width:${pct}%"></div></div>
        <div class="goal-meta"><span>Terkumpul <b>${fmt(g.current)}</b> dari ${fmt(g.target)}</span><b>${pct}%</b></div>
        <p>${rest === 0 ? '<span class="pill">Target tercapai</span>' : `Kurang ${fmt(rest)} — setoran ${fmt(g.monthly)}/bulan, sekitar ${months} bulan lagi.`}</p>
      </section>`;
    }).join('');
  }
  app.querySelector('#goal-add').addEventListener('click', () => {
    const id = app.querySelector('#goal-pick').value;
    const amt = Number(app.querySelector('#goal-amount').value);
    if (!(amt >= 0)) return;
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    g.current = Math.min(g.target, g.current + amt);
    save('dk-goals-v1', goals);
    render();
  });
  render();
}

/* ---------------- Harga pokok ---------------- */
export function pricesPage(app) {
  let basket = load('dk-basket-v1', []);
  app.innerHTML = `
  <h1>Harga Pokok</h1>
  <p class="lede">Harga acuan nasional November 2026 (Badan Pusat Statistik). Bandingkan dengan harga di pasar Anda, lalu susun keranjang belanja.</p>
  <section class="card"><h2>Daftar harga acuan</h2>
    <table><thead><tr><th>Komoditas</th><th>Satuan</th><th class="num">Harga acuan</th></tr></thead>
    <tbody>${prices.map((p) => `<tr><td>${p.name}</td><td>${p.unit}</td><td class="num">${p.range ? p.range + ' / ' + p.unit : fmt(p.price) + ' / ' + p.unit}</td></tr>`).join('')}</tbody></table>
    <p class="note">Minyak goreng memakai nilai tengah Rp 20.500/L untuk hitung keranjang.</p>
  </section>
  <section class="card"><h2>Kalkulator keranjang belanja</h2>
    <label for="price-item">Pilih komoditas</label>
    <select id="price-item">${prices.map((p, i) => `<option value="${i}">${p.name} — ${p.range ? p.range : fmt(p.price)} / ${p.unit}</option>`).join('')}</select>
    <label for="price-qty">Jumlah</label>
    <input type="number" id="price-qty" min="0" value="1">
    <button type="button" id="price-add">Tambah ke keranjang</button>
    <div id="price-basket"></div>
  </section>`;
  const basketEl = app.querySelector('#price-basket');
  function renderBasket() {
    if (!basket.length) { basketEl.innerHTML = '<p class="empty">Keranjang masih kosong.</p>'; return; }
    const total = basket.reduce((s, b) => s + b.subtotal, 0);
    basketEl.innerHTML = basket.map((b, i) => `
      <div class="result-line"><span>${b.name} × ${b.qty} ${b.unit}</span><span class="amt">${fmt(b.subtotal)}</span></div>`).join('')
      + `<div class="result-line"><span><b>Total keranjang</b></span><span class="amt">${fmt(total)}</span></div>
      <p><button type="button" class="secondary" id="basket-clear">Kosongkan keranjang</button></p>`;
    basketEl.querySelector('#basket-clear').addEventListener('click', () => {
      basket = [];
      save('dk-basket-v1', basket);
      renderBasket();
    });
  }
  app.querySelector('#price-add').addEventListener('click', () => {
    const idx = Number(app.querySelector('#price-item').value);
    const qty = Number(app.querySelector('#price-qty').value);
    if (!(qty > 0)) return;
    const p = prices[idx];
    basket.push({ name: p.name, qty, unit: p.unit, subtotal: p.price * qty });
    save('dk-basket-v1', basket);
    renderBasket();
  });
  renderBasket();
}

/* ---------------- Panduan ---------------- */
export function guide(app) {
  let done = load('dk-guide-v1', []);
  app.innerHTML = `
  <h1>Panduan Anggaran Rumah Tangga</h1>
  <p class="lede">Cara memakai aturan 50/30/20 untuk keluarga, langkah demi langkah.</p>
  <section class="card"><h2>Apa itu 50/30/20?</h2>
    <p>Bagi penghasilan bulanan menjadi tiga bagian: <b>50% kebutuhan</b> (tempat tinggal, makan, listrik, transport), <b>30% keinginan</b> (hiburan, makan di luar, langganan), dan <b>20% tabungan</b> (dana darurat, pendidikan, liburan). Untuk penghasilan Rp 9.200.000, pembagiannya Rp 4.600.000 kebutuhan, Rp 2.760.000 keinginan, dan Rp 1.840.000 tabungan.</p>
    <p>Aturan ini patokan, bukan hukum: keluarga dengan sewa rumah tinggi boleh memakai 60/25/15 sementara, lalu kembali ke 50/30/20 begitu ada ruang. Yang penting tabungan tidak pernah nol.</p>
  </section>
  <section class="card"><h2>6 tips hemat keluarga</h2>
    <p id="guide-progress"><b>${done.length} dari 6 selesai</b></p>
    ${tips.map((t, i) => `
      <label class="check-item${done.includes(i) ? ' done' : ''}"><input type="checkbox" data-check="${i}"${done.includes(i) ? ' checked' : ''}><span><b>${t.title}.</b> ${t.desc}</span></label>`).join('')}
  </section>
  <section class="card"><h2>Mulai bulan ini</h2>
    <p>Hitung penghasilan di <a href="#/kalkulator">Kalkulator</a>, catat belanja harian di <a href="#/pengeluaran">Pelacak Pengeluaran</a>, cek harga pasar di <a href="#/harga">Harga Pokok</a>, dan pantau tiga tujuan di <a href="#/tujuan">Tabungan</a>. Review bersama keluarga tiap akhir bulan.</p>
  </section>`;
  app.querySelectorAll('[data-check]').forEach((box) => box.addEventListener('change', () => {
    const i = Number(box.dataset.check);
    done = box.checked ? [...new Set([...done, i])] : done.filter((x) => x !== i);
    save('dk-guide-v1', done);
    app.querySelector('#guide-progress').innerHTML = `<b>${done.length} dari 6 selesai</b>`;
    box.closest('.check-item').classList.toggle('done', box.checked);
  }));
}
