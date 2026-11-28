"use strict";
/* DompetKeluarga — Anggaran Rumah Tangga.
   SPA hash-routing 8 halaman, tanpa framework, tanpa network.
   Semua data contoh tersimpan hanya di localStorage browser. */

// ---------- util ----------
function formatID(n) {
  const s = String(Math.round(n));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function rp(n) { return "Rp " + formatID(n); }
function jt(n) {
  const v = (n / 1000000).toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
  return v + " jt";
}
function numVal(v, def) {
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : def;
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const store = {
  get: function (key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set: function (key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
};
function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ---------- data contoh ----------
const KELUARGA = {
  nama: "Keluarga Hartono", kota: "Jakarta", anggota: 4,
  penghasilan: 9200000, ayah: 6200000, ibu: 3000000,
  belanja: 7980000, tabungan: 1780000
};
const BULAN = [
  { bln: "Jun", masuk: 9200000, keluar: 8450000 },
  { bln: "Jul", masuk: 9200000, keluar: 8610000 },
  { bln: "Agu", masuk: 9200000, keluar: 8320000 },
  { bln: "Sep", masuk: 9200000, keluar: 8540000 },
  { bln: "Okt", masuk: 9200000, keluar: 8150000 },
  { bln: "Nov", masuk: 9200000, keluar: 7820000 }
];
const PENGELUARAN_AWAL = [
  { id: "d1", nama: "Beras medium 5 kg", jumlah: 67500, kategori: "Bahan pokok", tanggal: "2026-11-03" },
  { id: "d2", nama: "Token listrik", jumlah: 200000, kategori: "Rumah tangga", tanggal: "2026-11-05" },
  { id: "d3", nama: "Seragam sekolah", jumlah: 275000, kategori: "Pendidikan", tanggal: "2026-11-08" },
  { id: "d4", nama: "Belanja sayur & buah pasar", jumlah: 125000, kategori: "Bahan pokok", tanggal: "2026-11-02" },
  { id: "d5", nama: "Ayam potong 2 kg", jumlah: 76000, kategori: "Bahan pokok", tanggal: "2026-11-09" },
  { id: "d6", nama: "Telur ayam 2 kg", jumlah: 57000, kategori: "Bahan pokok", tanggal: "2026-11-09" },
  { id: "d7", nama: "Minyak goreng 2 L", jumlah: 43000, kategori: "Bahan pokok", tanggal: "2026-11-10" },
  { id: "d8", nama: "Gula pasir 2 kg", jumlah: 36000, kategori: "Bahan pokok", tanggal: "2026-11-10" },
  { id: "d9", nama: "LPG 3 kg", jumlah: 20000, kategori: "Rumah tangga", tanggal: "2026-11-11" },
  { id: "d10", nama: "Bensin motor", jumlah: 100000, kategori: "Transport", tanggal: "2026-11-12" },
  { id: "d11", nama: "Pulsa & paket data", jumlah: 100000, kategori: "Rumah tangga", tanggal: "2026-11-13" },
  { id: "d12", nama: "Iuran RT & kebersihan", jumlah: 50000, kategori: "Rumah tangga", tanggal: "2026-11-14" },
  { id: "d13", nama: "Jajan anak sekolah", jumlah: 150000, kategori: "Pendidikan", tanggal: "2026-11-15" },
  { id: "d14", nama: "Sabun, sampo & deterjen", jumlah: 85000, kategori: "Rumah tangga", tanggal: "2026-11-16" },
  { id: "d15", nama: "Air galon isi ulang", jumlah: 92000, kategori: "Rumah tangga", tanggal: "2026-11-17" },
  { id: "d16", nama: "Belanja mingguan pasar", jumlah: 115000, kategori: "Bahan pokok", tanggal: "2026-11-18" }
];
const TUJUAN_AWAL = [
  { id: "darurat", nama: "Dana darurat", ket: "Target 3x pengeluaran bulanan", saatIni: 8400000, target: 27600000, setoran: 500000 },
  { id: "pendidikan", nama: "Pendidikan anak", ket: "Biaya masuk sekolah lanjutan", saatIni: 4250000, target: 12000000, setoran: 350000 },
  { id: "liburan", nama: "Liburan keluarga", ket: "Liburan akhir tahun", saatIni: 2750000, target: 5000000, setoran: 250000 }
];
const HARGA = [
  { nama: "Beras medium", harga: 13500, satuan: "kg", ket: "" },
  { nama: "Beras premium", harga: 15500, satuan: "kg", ket: "" },
  { nama: "Telur ayam ras", harga: 28500, satuan: "kg", ket: "" },
  { nama: "Daging ayam ras", harga: 38000, satuan: "kg", ket: "" },
  { nama: "Daging sapi", harga: 138000, satuan: "kg", ket: "" },
  { nama: "Minyak goreng curah", harga: 19800, satuan: "L", ket: "Kemasan Rp 21.500/L" },
  { nama: "Minyak goreng kemasan", harga: 21500, satuan: "L", ket: "" },
  { nama: "Gula pasir", harga: 18000, satuan: "kg", ket: "" },
  { nama: "LPG 3 kg", harga: 20000, satuan: "tabung", ket: "HET subsidi" },
  { nama: "Bawang merah", harga: 34000, satuan: "kg", ket: "" },
  { nama: "Bawang putih", harga: 40000, satuan: "kg", ket: "" },
  { nama: "Cabai merah besar", harga: 48000, satuan: "kg", ket: "" },
  { nama: "Cabai rawit merah", harga: 55000, satuan: "kg", ket: "" },
  { nama: "Tomat", harga: 14000, satuan: "kg", ket: "" },
  { nama: "Tempe", harga: 13000, satuan: "kg", ket: "" },
  { nama: "Tahu", harga: 11000, satuan: "kg", ket: "" }
];
const TIPS = [
  { judul: "Bayar diri sendiri dulu", isi: "Sisihkan tabungan di awal gajian, sebelum uang sempat terbelanja. Otomatis lebih konsisten daripada menyisihkan sisa di akhir bulan." },
  { judul: "Belanja mingguan, bukan harian", isi: "Belanja dengan daftar dan menu seminggu mengurangi jajan impulsif. Keluarga Hartono memangkas Rp 330.000 per bulan dengan cara ini." },
  { judul: "Bandingkan harga sebelum belanja bulanan", isi: "Selisih harga beras, telur, dan minyak antar toko bisa Rp 1.000–Rp 3.000 per kg. Cek tabel Harga Pokok sebelum berangkat." },
  { judul: "Batasi makan di luar", isi: "Makan di luar 2x seminggu untuk keluarga 4 orang bisa menelan Rp 1.200.000 per bulan. Turunkan ke 1x dan alihkan sisanya ke dana darurat." },
  { judul: "Audit langganan tiap 3 bulan", isi: "Langganan streaming, aplikasi, dan keanggotaan yang jarang dipakai sering lolos dari anggaran. Hentikan satu saja, hemat puluhan ribu per bulan." },
  { judul: "Review anggaran tiap akhir bulan", isi: "Luangkan 15 menit di akhir bulan: bandingkan rencana dan realisasi, lalu sesuaikan rencana bulan depan. Anggaran yang direview adalah anggaran yang jalan." }
];
const CHECKLIST_AWAL = [
  "Catat semua pengeluaran hari ini",
  "Masak bekal dari rumah 3x minggu ini",
  "Bandingkan harga sebelum belanja bulanan",
  "Sisihkan tabungan di awal gajian",
  "Cek langganan yang tidak terpakai dan hentikan satu",
  "Belanja dengan daftar, tanpa barang di luar daftar"
];
const DIAGNOSIS_AWAL = [
  { tanya: "Punya dana darurat minimal 3x pengeluaran bulanan?", reco: "Bangun dana darurat 3x pengeluaran (Rp 27.600.000) di halaman Tabungan." },
  { tanya: "Menabung minimal 10% dari penghasilan tiap bulan?", reco: "Sisihkan minimal 10% penghasilan (Rp 920.000) di awal gajian." },
  { tanya: "Cicilan utang konsumtif di bawah 30% penghasilan?", reco: "Tekan cicilan di bawah 30% penghasilan (Rp 2.760.000) — coba perencana di halaman Pelunasan Utang." },
  { tanya: "Punya asuransi (kesehatan/jiwa)?", reco: "Pertimbangkan asuransi kesehatan dasar untuk melindungi anggaran keluarga." },
  { tanya: "Mencatat pengeluaran setiap bulan?", reco: "Mulai mencatat di halaman Pelacak Pengeluaran — yang terukur bisa dikelola." },
  { tanya: "Punya tujuan keuangan tertulis?", reco: "Tulis tujuan keuanganmu di halaman Tabungan beserta target dan tenggatnya." }
];

// ---------- grafik SVG murni ----------
function donutSVG() {
  const r = 80, c = 2 * Math.PI * r;
  const seg = [
    { label: "Kebutuhan", persen: 50, nilai: 4600000, warna: "#1b7a4d" },
    { label: "Keinginan", persen: 30, nilai: 2760000, warna: "#d99a26" },
    { label: "Tabungan", persen: 20, nilai: 1840000, warna: "#2f6fb2" }
  ];
  let offset = 0;
  const circles = seg.map(function (s) {
    const len = c * s.persen / 100;
    const out = '<circle cx="105" cy="105" r="' + r + '" fill="none" stroke="' + s.warna +
      '" stroke-width="34" stroke-dasharray="' + len.toFixed(2) + " " + (c - len).toFixed(2) +
      '" stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 105 105)"></circle>';
    offset += len;
    return out;
  }).join("");
  const legenda = seg.map(function (s) {
    return '<p><span class="swatch" style="background:' + s.warna + '"></span><strong>' + s.label +
      " " + s.persen + "%</strong> — " + rp(s.nilai) + "</p>";
  }).join("");
  return '<div class="donut-wrap"><svg viewBox="0 0 210 210" role="img" aria-label="Donat alokasi 50/30/20">' + circles +
    '<text x="105" y="100" text-anchor="middle" font-size="22" font-weight="800" fill="#123524">50/30/20</text>' +
    '<text x="105" y="124" text-anchor="middle" font-size="12" fill="#5a7267">dari penghasilan</text></svg>' +
    '<div>' + legenda + '<p class="muted">Alokasi ideal dari penghasilan Rp 9.200.000 per bulan.</p></div></div>';
}
function barChartSVG() {
  const W = 760, H = 260, padL = 46, padB = 30, padT = 18, chartH = H - padT - padB;
  const maks = 9200000;
  const y = function (v) { return padT + chartH - (v / maks) * chartH; };
  let g = "";
  [0, 3000000, 6000000, 9000000].forEach(function (v) {
    g += '<line x1="' + padL + '" y1="' + y(v) + '" x2="' + (W - 8) + '" y2="' + y(v) +
      '" stroke="#e0e7e2" stroke-width="1"></line>' +
      '<text x="' + (padL - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="11" fill="#5a7267">' + jt(v) + "</text>";
  });
  const grupW = (W - padL - 16) / BULAN.length, barW = 22;
  BULAN.forEach(function (m, i) {
    const x0 = padL + 8 + i * grupW;
    const hMasuk = (m.masuk / maks) * chartH, hKeluar = (m.keluar / maks) * chartH;
    g += '<rect x="' + (x0 + 8) + '" y="' + y(m.masuk) + '" width="' + barW + '" height="' + hMasuk +
      '" fill="#2f6fb2" rx="3"></rect>';
    g += '<rect x="' + (x0 + 34) + '" y="' + y(m.keluar) + '" width="' + barW + '" height="' + hKeluar +
      '" fill="#d99a26" rx="3"></rect>';
    g += '<text x="' + (x0 + 19) + '" y="' + (y(m.masuk) - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#2f6fb2">' + jt(m.masuk) + "</text>";
    g += '<text x="' + (x0 + 45) + '" y="' + (y(m.keluar) - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#8a5a00">' + jt(m.keluar) + "</text>";
    g += '<text x="' + (x0 + 26) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#123524">' + m.bln + "</text>";
    if (m.bln === "Nov") {
      g += '<text x="' + (x0 + 26) + '" y="' + (padT - 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#14663d">Paling hemat</text>';
    }
  });
  return '<div class="chart-box"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Grafik pemasukan vs pengeluaran Juni sampai November 2026">' + g + "</svg>" +
    '<div class="legend"><span><span class="swatch" style="background:#2f6fb2"></span>Pemasukan</span>' +
    '<span><span class="swatch" style="background:#d99a26"></span>Pengeluaran</span></div></div>';
}

// ---------- Beranda ----------
function renderBeranda() {
  const k = KELUARGA;
  const sisa = k.penghasilan - k.belanja - k.tabungan;
  const idealTabungan = Math.round(k.penghasilan * 0.2);
  const kurang = idealTabungan - k.tabungan;
  const persenTabungan = Math.round(k.tabungan / k.penghasilan * 100);
  const tabelBulan = BULAN.map(function (m) {
    return "<tr><td>" + m.bln + " 2026</td><td class=\"num\">" + rp(m.masuk) +
      "</td><td class=\"num\">" + rp(m.keluar) + "</td><td class=\"num\">" + rp(m.masuk - m.keluar) + "</td></tr>";
  }).join("");
  return "" +
  '<h1>Anggaran ' + k.nama + ' — November 2026</h1>' +
  '<p class="lede">Keluarga 4 orang di ' + k.kota + '. Penghasilan ayah Rp 6.200.000 ditambah penghasilan ibu Rp 3.000.000. ' +
  'Situs ini merapikan anggaran mereka dengan aturan 50/30/20, melacak pengeluaran harian, dan menjaga tabungan tetap jalan.</p>' +
  '<div class="grid-4">' +
    '<div class="kpi"><div class="kpi-label">Penghasilan / bulan</div><div class="kpi-value" id="kpi-penghasilan">' + rp(k.penghasilan) + '</div><div class="kpi-sub">Ayah Rp 6.200.000 + Ibu Rp 3.000.000</div></div>' +
    '<div class="kpi"><div class="kpi-label">Rencana belanja</div><div class="kpi-value" id="kpi-belanja">' + rp(k.belanja) + '</div><div class="kpi-sub">Kebutuhan + keinginan bulan ini</div></div>' +
    '<div class="kpi"><div class="kpi-label">Tabungan</div><div class="kpi-value" id="kpi-tabungan">' + rp(k.tabungan) + '</div><div class="kpi-sub">Tingkat tabungan ' + persenTabungan + '% dari penghasilan</div></div>' +
    '<div class="kpi warn"><div class="kpi-label">Sisa belum dialokasikan</div><div class="kpi-value" id="kpi-sisa">−' + rp(Math.abs(sisa)) + '</div><div class="kpi-sub">Selisih rencana terhadap penghasilan</div></div>' +
  "</div>" +
  '<div class="alert"><strong>Perhatian:</strong> rencana bulan ini melebihi penghasilan sebesar ' + rp(Math.abs(sisa)) +
  '. Pangkas ' + rp(Math.abs(sisa)) + ' dari belanja keinginan, atau sesuaikan rencananya di <a href="#/kalkulator">Kalkulator 50/30/20</a>.</div>' +
  '<div class="card"><h2>Alokasi ideal 50/30/20</h2>' + donutSVG() + "</div>" +
  '<div class="card" id="widget-banding"><h2>Bandingkan dengan ideal 50/30/20</h2>' +
    "<p>Dari penghasilan Rp 9.200.000, ideal tabungan 20% adalah <strong>" + rp(idealTabungan) + "</strong>. " +
    "Tabungan keluarga saat ini " + rp(k.tabungan) + " (" + persenTabungan + "%).</p>" +
    '<div class="progress"><span style="width:' + Math.round(k.tabungan / idealTabungan * 100) + '%"></span></div>' +
    "<p><strong>Tabungan keluarga kurang Rp 60.000 per bulan untuk mencapai 20%.</strong> " +
    "Tambah Rp 60.000 ke setoran dana darurat tiap gajian, dan target 20% tercapai tanpa mengubah belanja lain.</p>" +
    "<p class=\"muted\">Selisih dihitung dari " + rp(idealTabungan) + " − " + rp(k.tabungan) + " = " + rp(kurang) + ".</p></div>" +
  '<div class="card"><h2>Pemasukan vs pengeluaran — Juni sampai November 2026</h2>' + barChartSVG() +
    '<p class="muted">November bulan paling hemat: pengeluaran Rp 7.820.000, terendah dalam 6 bulan terakhir.</p>' +
    '<div class="table-wrap"><table><thead><tr><th>Bulan</th><th class="num">Pemasukan</th><th class="num">Pengeluaran</th><th class="num">Selisih</th></tr></thead><tbody>' +
    tabelBulan + "</tbody></table></div></div>" +
  '<div class="grid-2">' +
    '<div class="card"><h2>Mulai dari sini</h2><p><a class="btn" href="#/kalkulator">Hitung anggaran 50/30/20</a></p>' +
    "<p>Cek apakah gajimu cukup untuk kebutuhan, keinginan, dan tabungan — lengkap dengan pintasan UMP DKI Jakarta 2026.</p></div>" +
    '<div class="card"><h2>Cek kesehatan keuangan</h2><p><a class="btn" href="#/diagnosis">Ikuti diagnosis 6 pertanyaan</a></p>' +
    "<p>Enam pertanyaan ya/tidak, skor 0–6, plus rekomendasi untuk setiap jawaban yang masih \"tidak\".</p></div>" +
  "</div>";
}

// ---------- Kalkulator ----------
let kalk = { penghasilan: 9200000, persen: [50, 30, 20] };
const KALK_SUB = [
  { nama: "Kebutuhan", bagi: [["Tempat tinggal", 40], ["Belanja dapur", 30], ["Listrik, air & gas", 12], ["Transport", 10], ["Sekolah anak", 8]] },
  { nama: "Keinginan", bagi: [["Makan di luar", 35], ["Hiburan", 25], ["Langganan", 15], ["Belanja lain", 25]] },
  { nama: "Tabungan", bagi: [["Dana darurat", 50], ["Pendidikan anak", 30], ["Liburan", 20]] }
];
function kalkJumlah(i) { return Math.round(kalk.penghasilan * kalk.persen[i] / 100); }
function kalkSeimbang(idx, nilaiBaru) {
  const lain = [0, 1, 2].filter(function (i) { return i !== idx; });
  const totalLain = kalk.persen[lain[0]] + kalk.persen[lain[1]];
  const sisa = 100 - nilaiBaru;
  if (totalLain === 0) {
    kalk.persen[lain[0]] = Math.round(sisa / 2);
    kalk.persen[lain[1]] = sisa - kalk.persen[lain[0]];
  } else {
    kalk.persen[lain[0]] = Math.round(kalk.persen[lain[0]] / totalLain * sisa);
    kalk.persen[lain[1]] = sisa - kalk.persen[lain[0]];
  }
  kalk.persen[idx] = nilaiBaru;
}
function kalkTampil() {
  const ids = ["kebutuhan", "keinginan", "tabungan"];
  ids.forEach(function (id, i) {
    const slider = document.getElementById("slider-" + id);
    const persenEl = document.getElementById("persen-" + id);
    const jumlahEl = document.getElementById("calc-" + id);
    if (slider) slider.value = String(kalk.persen[i]);
    if (persenEl) persenEl.textContent = kalk.persen[i] + "%";
    if (jumlahEl) jumlahEl.textContent = rp(kalkJumlah(i));
  });
  const rincian = document.getElementById("calc-rincian");
  if (rincian) {
    rincian.innerHTML = KALK_SUB.map(function (kat, i) {
      const rows = kat.bagi.map(function (b) {
        return "<tr><td>" + b[0] + " (" + b[1] + "%)</td><td class=\"num\">" + rp(kalkJumlah(i) * b[1] / 100) + "</td></tr>";
      }).join("");
      return '<div class="card"><h3>' + kat.nama + " — " + rp(kalkJumlah(i)) + "</h3><table><tbody>" + rows + "</tbody></table></div>";
    }).join("");
  }
}
function renderKalkulator() {
  return "" +
  "<h1>Kalkulator 50/30/20</h1>" +
  '<p class="lede">Bagi penghasilan bulanan menjadi kebutuhan 50%, keinginan 30%, dan tabungan 20%. ' +
  "Geser salah satu pengatur — dua lainnya menyesuaikan otomatis agar total tetap 100%.</p>" +
  '<div class="card"><label for="calc-income">Penghasilan per bulan (Rp)</label>' +
  '<input type="number" id="calc-income" min="0" value="' + kalk.penghasilan + '">' +
  '<p><button type="button" class="secondary" id="btn-ump">Pakai UMP DKI Jakarta 2026 — Rp 5.729.876</button></p>' +
  '<p class="muted">UMP DKI Jakarta 2026: Rp 5.729.876 (Pemprov DKI Jakarta).</p></div>' +
  '<div class="card"><h2>Atur alokasi</h2>' +
  '<div class="slider-row"><label for="slider-kebutuhan">Kebutuhan</label><input type="range" id="slider-kebutuhan" min="0" max="100" step="1" value="50"><span class="slider-value" id="persen-kebutuhan">50%</span></div>' +
  '<div class="slider-row"><label for="slider-keinginan">Keinginan</label><input type="range" id="slider-keinginan" min="0" max="100" step="1" value="30"><span class="slider-value" id="persen-keinginan">30%</span></div>' +
  '<div class="slider-row"><label for="slider-tabungan">Tabungan</label><input type="range" id="slider-tabungan" min="0" max="100" step="1" value="20"><span class="slider-value" id="persen-tabungan">20%</span></div>' +
  '<div class="grid-3">' +
    '<div class="kpi"><div class="kpi-label">Kebutuhan</div><div class="kpi-value" id="calc-kebutuhan">' + rp(kalkJumlah(0)) + '</div></div>' +
    '<div class="kpi"><div class="kpi-label">Keinginan</div><div class="kpi-value" id="calc-keinginan">' + rp(kalkJumlah(1)) + '</div></div>' +
    '<div class="kpi"><div class="kpi-label">Tabungan</div><div class="kpi-value" id="calc-tabungan">' + rp(kalkJumlah(2)) + '</div></div>' +
  "</div></div>" +
  '<h2>Rincian per pos</h2><div class="grid-3" id="calc-rincian"></div>' +
  '<div class="card"><h2>Contoh</h2><p>Penghasilan Rp 15.000.000 dengan alokasi 50/30/20: kebutuhan Rp 7.500.000, ' +
  "keinginan Rp 4.500.000, tabungan Rp 3.000.000. Naikkan pengatur kebutuhan ke 60%, maka kebutuhan menjadi Rp 9.000.000.</p></div>";
}
function bindKalkulator() {
  const income = document.getElementById("calc-income");
  if (income) income.addEventListener("input", function () {
    kalk.penghasilan = Math.max(0, numVal(income.value, kalk.penghasilan));
    kalkTampil();
  });
  const ump = document.getElementById("btn-ump");
  if (ump) ump.addEventListener("click", function () {
    kalk.penghasilan = 5729876;
    if (income) income.value = "5729876";
    kalkTampil();
  });
  ["kebutuhan", "keinginan", "tabungan"].forEach(function (id, i) {
    const s = document.getElementById("slider-" + id);
    if (s) s.addEventListener("input", function () {
      kalkSeimbang(i, numVal(s.value, kalk.persen[i]));
      kalkTampil();
    });
  });
  kalkTampil();
}

// ---------- Pengeluaran ----------
let pengeluaran = store.get("dk-pengeluaran-v1", null);
if (!pengeluaran) pengeluaran = clone(PENGELUARAN_AWAL);
function totalPengeluaran() {
  return pengeluaran.reduce(function (a, b) { return a + b.jumlah; }, 0);
}
function renderPengeluaran() {
  const kategori = ["Semua", "Bahan pokok", "Rumah tangga", "Pendidikan", "Transport"];
  return "" +
  "<h1>Pelacak Pengeluaran — November 2026</h1>" +
  '<p class="lede">Catat setiap pengeluaran agar terlihat ke mana uang pergi. Total contoh bulan ini ' +
  rp(1591500) + " dari 16 item.</p>" +
  '<div class="card"><div class="form-row"><div><label for="exp-cari">Cari pengeluaran</label>' +
  '<input type="text" id="exp-cari" placeholder="Contoh: beras" autocomplete="off"></div>' +
  '<div><label for="exp-filter">Kategori</label><select id="exp-filter">' +
  kategori.map(function (k) { return '<option value="' + k + '">' + k + "</option>"; }).join("") +
  "</select></div></div></div>" +
  '<div class="card"><h2>Tambah pengeluaran</h2>' +
  '<form id="form-tambah"><div class="form-row">' +
  '<div><label for="exp-nama">Nama pengeluaran</label><input type="text" id="exp-nama" required placeholder="Contoh: Beras medium 5 kg"></div>' +
  '<div><label for="exp-jumlah">Jumlah (Rp)</label><input type="number" id="exp-jumlah" min="0" required placeholder="67500"></div>' +
  '<div><label for="exp-kategori">Kategori</label><select id="exp-kategori">' +
  ["Bahan pokok", "Rumah tangga", "Pendidikan", "Transport"].map(function (k) { return '<option value="' + k + '">' + k + "</option>"; }).join("") +
  '</select></div>' +
  '<div><label for="exp-tanggal">Tanggal</label><input type="date" id="exp-tanggal" value="2026-11-20"></div>' +
  '</div><button type="submit">Tambah</button></form></div>' +
  '<div class="card"><h2>Daftar pengeluaran</h2><div class="table-wrap"><table id="tabel-pengeluaran">' +
  "<thead><tr><th>Nama</th><th>Kategori</th><th>Tanggal</th><th class=\"num\">Jumlah</th><th></th></tr></thead>" +
  '<tbody id="daftar-pengeluaran"></tbody>' +
  '<tfoot><tr class="total-row"><td colspan="3">Total</td><td class="num" id="total-pengeluaran">' + rp(totalPengeluaran()) + "</td><td></td></tr></tfoot>" +
  "</table></div></div>" +
  '<div class="card"><h2>Ringkasan per kategori</h2><div id="ringkas-kategori"></div>' +
  '<p class="muted">Ringkasan dihitung dari semua item, bukan hanya yang tampil di filter.</p></div>';
}
function gambarPengeluaran() {
  const cari = (document.getElementById("exp-cari").value || "").toLowerCase();
  const filter = document.getElementById("exp-filter").value;
  const tbody = document.getElementById("daftar-pengeluaran");
  tbody.innerHTML = pengeluaran.map(function (it) {
    const cocokCari = it.nama.toLowerCase().indexOf(cari) !== -1;
    const cocokKat = filter === "Semua" || it.kategori === filter;
    const tampil = cocokCari && cocokKat ? "" : ' style="display:none"';
    return "<tr" + tampil + "><td>" + esc(it.nama) + "</td><td>" + esc(it.kategori) + "</td><td>" + esc(it.tanggal) +
      '</td><td class="num">' + rp(it.jumlah) + '</td><td><button type="button" class="danger" data-hapus="' + it.id + '">Hapus</button></td></tr>';
  }).join("");
  document.getElementById("total-pengeluaran").textContent = rp(totalPengeluaran());
  const ringkas = document.getElementById("ringkas-kategori");
  if (ringkas) {
    const perKat = {};
    pengeluaran.forEach(function (it) {
      if (!perKat[it.kategori]) perKat[it.kategori] = { n: 0, total: 0 };
      perKat[it.kategori].n += 1;
      perKat[it.kategori].total += it.jumlah;
    });
    const rows = Object.keys(perKat).sort().map(function (k) {
      return "<tr><td>" + esc(k) + '</td><td class="num">' + perKat[k].n + ' item</td><td class="num">' + rp(perKat[k].total) + "</td></tr>";
    }).join("");
    ringkas.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Kategori</th><th class="num">Item</th><th class="num">Total</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  }
  tbody.querySelectorAll("[data-hapus]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      pengeluaran = pengeluaran.filter(function (it) { return it.id !== btn.getAttribute("data-hapus"); });
      store.set("dk-pengeluaran-v1", pengeluaran);
      gambarPengeluaran();
    });
  });
}
function bindPengeluaran() {
  gambarPengeluaran();
  document.getElementById("exp-cari").addEventListener("input", gambarPengeluaran);
  document.getElementById("exp-filter").addEventListener("change", gambarPengeluaran);
  document.getElementById("form-tambah").addEventListener("submit", function (ev) {
    ev.preventDefault();
    const nama = document.getElementById("exp-nama").value.trim();
    const jumlah = numVal(document.getElementById("exp-jumlah").value, 0);
    const kategori = document.getElementById("exp-kategori").value;
    const tanggal = document.getElementById("exp-tanggal").value || "2026-11-20";
    if (!nama || jumlah <= 0) return;
    pengeluaran.push({ id: "x" + Date.now(), nama: nama, jumlah: jumlah, kategori: kategori, tanggal: tanggal });
    store.set("dk-pengeluaran-v1", pengeluaran);
    document.getElementById("form-tambah").reset();
    document.getElementById("exp-tanggal").value = "2026-11-20";
    gambarPengeluaran();
  });
}

// ---------- Tabungan ----------
let tujuan = store.get("dk-tujuan-v1", null);
if (!tujuan) tujuan = clone(TUJUAN_AWAL);
function renderTujuan() {
  const cards = tujuan.map(function (g) {
    const persen = Math.min(100, Math.round(g.saatIni / g.target * 100));
    const sisa = Math.max(0, g.target - g.saatIni);
    const bulan = g.saatIni >= g.target ? "Tercapai" : "Estimasi " + Math.ceil(sisa / g.setoran) + " bulan lagi (setoran " + rp(g.setoran) + "/bulan)";
    return '<div class="card"><h2>' + g.nama + '</h2><p class="muted">' + g.ket + "</p>" +
      '<p><span class="big-number" id="tujuan-' + g.id + '-saat-ini">' + rp(g.saatIni) + '</span> dari target ' + rp(g.target) + "</p>" +
      '<div class="progress"><span style="width:' + persen + '%"></span></div>' +
      "<p>" + persen + "% tercapai · Sisa " + rp(sisa) + "</p>" +
      '<p><span class="pill green">' + bulan + "</span></p>" +
      '<label for="setor-' + g.id + '">Tambah setoran (Rp)</label>' +
      '<input type="number" id="setor-' + g.id + '" min="0" placeholder="250000">' +
      '<p><button type="button" id="btn-setor-' + g.id + '">Tambah setoran</button></p></div>';
  }).join("");
  return "<h1>Tabungan &amp; Tujuan Keuangan</h1>" +
    '<p class="lede">Tiga tujuan keluarga Hartono. Dana darurat ditargetkan 3x pengeluaran bulanan, ' +
    "yaitu Rp 27.600.000.</p>" + cards;
}
function bindTujuan() {
  tujuan.forEach(function (g) {
    const btn = document.getElementById("btn-setor-" + g.id);
    if (!btn) return;
    btn.addEventListener("click", function () {
      const inp = document.getElementById("setor-" + g.id);
      const tambah = numVal(inp.value, 0);
      if (tambah <= 0) return;
      g.saatIni += tambah;
      store.set("dk-tujuan-v1", tujuan);
      route();
    });
  });
}

// ---------- Harga Pokok ----------
let keranjang = [];
function renderHarga() {
  const rows = HARGA.map(function (h) {
    return "<tr><td>" + h.nama + (h.ket ? ' <span class="muted">(' + h.ket + ")</span>" : "") +
      '</td><td class="num">' + rp(h.harga) + "</td><td>" + h.satuan + "</td></tr>";
  }).join("");
  const opsi = HARGA.map(function (h, i) {
    return '<option value="' + i + '">' + h.nama + " — " + rp(h.harga) + "/" + h.satuan + "</option>";
  }).join("");
  return "<h1>Harga Pokok — Acuan Nasional November 2026</h1>" +
  '<p class="lede">Harga acuan nasional (BPS) untuk 16 bahan pokok. Gunakan kalkulator keranjang untuk memperkirakan ' +
  "total belanja sebelum ke pasar.</p>" +
  '<div class="card"><h2>Tabel harga acuan</h2><div class="table-wrap"><table id="tabel-harga">' +
  "<thead><tr><th>Bahan</th><th class=\"num\">Harga</th><th>Satuan</th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
  '<p class="muted">Sumber: BPS, November 2026. Minyak goreng: curah Rp 19.800/L dan kemasan Rp 21.500/L. LPG 3 kg Rp 20.000 adalah HET subsidi.</p></div>' +
  '<div class="card"><h2>Kalkulator keranjang belanja</h2>' +
  '<div class="form-row"><div><label for="keranjang-barang">Barang</label><select id="keranjang-barang">' + opsi + "</select></div>" +
  '<div><label for="keranjang-jumlah">Jumlah</label><input type="number" id="keranjang-jumlah" min="0" value="1"></div></div>' +
  '<p class="big-number" id="keranjang-subtotal">Subtotal: ' + rp(HARGA[0].harga) + "</p>" +
  '<p><button type="button" id="btn-keranjang">Tambah ke keranjang</button></p>' +
  '<div class="table-wrap"><table><thead><tr><th>Barang</th><th class="num">Jumlah</th><th class="num">Subtotal</th></tr></thead>' +
  '<tbody id="daftar-keranjang"></tbody>' +
  '<tfoot><tr class="total-row"><td colspan="2">Total keranjang</td><td class="num" id="keranjang-total">Rp 0</td></tr></tfoot></table></div></div>';
}
function keranjangSubtotal() {
  const idx = numVal(document.getElementById("keranjang-barang").value, 0);
  const qty = Math.max(0, numVal(document.getElementById("keranjang-jumlah").value, 0));
  return HARGA[idx].harga * qty;
}
function gambarKeranjang() {
  const tbody = document.getElementById("daftar-keranjang");
  tbody.innerHTML = keranjang.map(function (it) {
    return "<tr><td>" + esc(it.nama) + '</td><td class="num">' + it.qty + " " + esc(it.satuan) +
      '</td><td class="num">' + rp(it.subtotal) + "</td></tr>";
  }).join("");
  const total = keranjang.reduce(function (a, b) { return a + b.subtotal; }, 0);
  document.getElementById("keranjang-total").textContent = rp(total);
}
function bindHarga() {
  const hitung = function () {
    document.getElementById("keranjang-subtotal").textContent = "Subtotal: " + rp(keranjangSubtotal());
  };
  document.getElementById("keranjang-barang").addEventListener("change", hitung);
  document.getElementById("keranjang-jumlah").addEventListener("input", hitung);
  document.getElementById("btn-keranjang").addEventListener("click", function () {
    const idx = numVal(document.getElementById("keranjang-barang").value, 0);
    const qty = Math.max(0, numVal(document.getElementById("keranjang-jumlah").value, 0));
    if (qty <= 0) return;
    keranjang.push({ nama: HARGA[idx].nama, satuan: HARGA[idx].satuan, qty: qty, subtotal: HARGA[idx].harga * qty });
    gambarKeranjang();
  });
  hitung();
  gambarKeranjang();
}

// ---------- Panduan ----------
let checklist = store.get("dk-checklist-v1", null);
if (!checklist) checklist = CHECKLIST_AWAL.map(function () { return false; });
function renderPanduan() {
  const items = CHECKLIST_AWAL.map(function (teks, i) {
    return '<label class="check-line"><input type="checkbox" class="panduan-cek" data-i="' + i + '"' +
      (checklist[i] ? " checked" : "") + '><span class="check-text">' + teks + "</span></label>";
  }).join("");
  const tips = TIPS.map(function (t, i) {
    return "<h3>" + (i + 1) + ". " + t.judul + "</h3><p>" + t.isi + "</p>";
  }).join("");
  return "<h1>Panduan Anggaran 50/30/20</h1>" +
  '<p class="lede">Aturan 50/30/20 membagi penghasilan menjadi tiga: 50% kebutuhan, 30% keinginan, 20% tabungan. ' +
  "Sederhana, mudah diingat, dan cukup ketat untuk menjaga keuangan keluarga tetap sehat.</p>" +
  '<div class="card"><h2>Checklist hemat minggu ini</h2><p id="checklist-status"><strong>' +
  checklist.filter(Boolean).length + " dari 6 selesai</strong></p>" + items +
  '<p class="muted">Centang dicatat di perangkat Anda dan tersimpan saat Anda kembali.</p></div>' +
  '<div class="card"><h2>6 tips hemat keluarga</h2>' + tips + "</div>";
}
function bindPanduan() {
  document.querySelectorAll(".panduan-cek").forEach(function (cb) {
    cb.addEventListener("change", function () {
      checklist[numVal(cb.getAttribute("data-i"), 0)] = cb.checked;
      store.set("dk-checklist-v1", checklist);
      document.getElementById("checklist-status").innerHTML = "<strong>" +
        checklist.filter(Boolean).length + " dari 6 selesai</strong>";
    });
  });
}

// ---------- Pelunasan Utang ----------
function amortisasi(saldo, bungaPersen, cicilan) {
  const rate = bungaPersen / 100;
  if (cicilan <= 0 || rate < 0 || saldo <= 0) return null;
  if (rate > 0 && cicilan <= saldo * rate) return { mustahil: true, bulan: 0, totalBunga: 0, totalBayar: 0, baris: [] };
  let sisa = saldo, totalBunga = 0, bulan = 0;
  const baris = [];
  while (sisa > 0.005 && bulan < 600) {
    bulan += 1;
    const bunga = sisa * rate;
    totalBunga += bunga;
    sisa = sisa + bunga;
    const bayar = Math.min(cicilan, sisa);
    sisa -= bayar;
    baris.push({ bulan: bulan, bunga: bunga, bayar: bayar, sisa: Math.max(0, sisa) });
  }
  return { mustahil: false, bulan: bulan, totalBunga: totalBunga, totalBayar: saldo + totalBunga, baris: baris };
}
function simulasiStrategi(utangs, totalCicilan, mode) {
  const ds = utangs.map(function (u) { return { nama: u.nama, saldo: u.saldo, rate: u.bunga / 100 }; });
  let totalBunga = 0, bulan = 0;
  while (ds.some(function (d) { return d.saldo > 0.005; }) && bulan < 600) {
    bulan += 1;
    ds.forEach(function (d) {
      if (d.saldo <= 0) return;
      const b = d.saldo * d.rate;
      d.saldo += b;
      totalBunga += b;
    });
    let sisaBayar = totalCicilan;
    ds.forEach(function (d) {
      if (d.saldo <= 0) return;
      const min = d.saldo * 0.05;
      d.saldo -= min;
      sisaBayar -= min;
    });
    const aktif = ds.filter(function (d) { return d.saldo > 0.005; });
    aktif.sort(function (a, b) {
      return mode === "snowball" ? a.saldo - b.saldo : b.rate - a.rate;
    });
    for (let i = 0; i < aktif.length; i++) {
      if (sisaBayar <= 0) break;
      const bayar = Math.min(aktif[i].saldo, sisaBayar);
      aktif[i].saldo -= bayar;
      sisaBayar -= bayar;
    }
  }
  return { bulan: bulan, totalBunga: totalBunga };
}
function hitungUtang() {
  const saldo = numVal(document.getElementById("utang-saldo").value, 0);
  const bunga = numVal(document.getElementById("utang-bunga").value, 0);
  const cicilan = numVal(document.getElementById("utang-cicilan").value, 0);
  const hasil = document.getElementById("hasil-utang");
  const detail = document.getElementById("utang-detail");
  const r = amortisasi(saldo, bunga, cicilan);
  if (!r) {
    hasil.textContent = "Isi saldo, bunga, dan cicilan dengan angka di atas 0.";
    detail.innerHTML = "";
    return;
  }
  if (r.mustahil) {
    hasil.textContent = "Cicilan terlalu kecil — cicilan tidak menutup bunga bulanan, utang tidak akan lunas.";
    detail.innerHTML = "";
    return;
  }
  hasil.textContent = "Lunas dalam " + r.bulan + " bulan";
  const rows = r.baris.map(function (b) {
    return "<tr><td>" + b.bulan + '</td><td class="num">' + rp(b.bunga) + '</td><td class="num">' + rp(b.bayar) +
      '</td><td class="num">' + rp(b.sisa) + "</td></tr>";
  }).join("");
  detail.innerHTML =
    "<p>Total bunga: <strong id=\"utang-total-bunga\">" + rp(r.totalBunga) + "</strong></p>" +
    "<p>Total dibayar: <strong id=\"utang-total-bayar\">" + rp(r.totalBayar) + "</strong></p>" +
    '<div class="table-wrap"><table id="utang-tabel"><thead><tr><th>Bulan</th><th class="num">Bunga</th><th class="num">Cicilan</th><th class="num">Sisa saldo</th></tr></thead><tbody>' +
    rows + "</tbody></table></div>";
}
function renderUtang() {
  const contoh = [
    { nama: "Utang A", saldo: 9000000, bunga: 2 },
    { nama: "Utang B", saldo: 3000000, bunga: 1 }
  ];
  const snow = simulasiStrategi(contoh, 1500000, "snowball");
  const aval = simulasiStrategi(contoh, 1500000, "avalanche");
  const hemat = snow.totalBunga - aval.totalBunga;
  return "<h1>Perencana Pelunasan Utang</h1>" +
  '<p class="lede">Hitung berapa bulan sampai utang lunas dan berapa total bunga yang dibayar. ' +
  "Simulasi tiap bulan: bunga dihitung dari sisa saldo, lalu cicilan mengurangi saldo; cicilan terakhir menyesuaikan sisa utang.</p>" +
  '<div class="card"><div class="form-row">' +
  '<div><label for="utang-saldo">Saldo utang (Rp)</label><input type="number" id="utang-saldo" min="0" value="12000000"></div>' +
  '<div><label for="utang-bunga">Bunga (% per bulan)</label><input type="number" id="utang-bunga" min="0" step="0.1" value="1.5"></div>' +
  '<div><label for="utang-cicilan">Cicilan per bulan (Rp)</label><input type="number" id="utang-cicilan" min="0" value="1000000"></div>' +
  '</div><p><button type="button" id="btn-hitung-utang">Hitung pelunasan</button></p>' +
  '<p class="big-number" id="hasil-utang"></p><div id="utang-detail"></div></div>' +
  '<div class="card"><h2>Snowball vs avalanche — dua utang contoh</h2>' +
  "<p>Utang A Rp 9.000.000 bunga 2% per bulan, Utang B Rp 3.000.000 bunga 1% per bulan, total cicilan Rp 1.500.000 per bulan. " +
  "Tiap bulan bayar minimum 5% saldo ke semua utang, sisanya ke utang target.</p>" +
  '<div class="grid-2">' +
  '<div class="kpi"><div class="kpi-label">Snowball — lunasi utang terkecil dulu</div>' +
  '<div class="kpi-value" id="snowball-bunga">' + rp(snow.totalBunga) + '</div>' +
  '<div class="kpi-sub">Total bunga · <span id="snowball-bulan">' + snow.bulan + "</span> bulan</div></div>" +
  '<div class="kpi"><div class="kpi-label">Avalanche — lunasi bunga tertinggi dulu</div>' +
  '<div class="kpi-value" id="avalanche-bunga">' + rp(aval.totalBunga) + '</div>' +
  '<div class="kpi-sub">Total bunga · <span id="avalanche-bulan">' + aval.bulan + "</span> bulan</div></div>" +
  "</div>" +
  '<p id="banding-hemat"><strong>Avalanche lebih hemat ' + rp(hemat) + '.</strong> ' +
  "Karena bunga Utang A dua kali lipat Utang B, menyerang utang berbunga tertinggi dulu memangkas total bunga — " +
  "meskipun dua strategi sama-sama lunas dalam 9 bulan.</p></div>";
}
function bindUtang() {
  ["utang-saldo", "utang-bunga", "utang-cicilan"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", hitungUtang);
  });
  document.getElementById("btn-hitung-utang").addEventListener("click", hitungUtang);
  hitungUtang();
}

// ---------- Diagnosis ----------
let diagnosis = store.get("dk-diagnosis-v1", null);
if (!diagnosis) diagnosis = DIAGNOSIS_AWAL.map(function () { return false; });
function diagnosisTampil() {
  const skor = diagnosis.filter(Boolean).length;
  const label = document.getElementById("diagnosis-label");
  const skorEl = document.getElementById("diagnosis-skor");
  const recoEl = document.getElementById("diagnosis-rekomendasi");
  let teks = "Perlu perhatian", kelas = "pill red";
  if (skor >= 5) { teks = "Sehat"; kelas = "pill green"; }
  else if (skor >= 3) { teks = "Cukup sehat"; kelas = "pill amber"; }
  if (label) { label.textContent = teks; label.className = kelas; }
  if (skorEl) skorEl.textContent = skor + " dari 6";
  if (recoEl) {
    const daftar = DIAGNOSIS_AWAL.map(function (d, i) {
      return diagnosis[i] ? "" : '<div class="reco"><strong>Rekomendasi:</strong> ' + d.reco + "</div>";
    }).join("");
    recoEl.innerHTML = daftar || '<p class="good">Semua terpenuhi — keuangan keluarga dalam kondisi sehat. Pertahankan kebiasaan ini.</p>';
  }
}
function renderDiagnosis() {
  const items = DIAGNOSIS_AWAL.map(function (d, i) {
    return '<label class="check-line"><input type="checkbox" class="diagnosis-cek" data-i="' + i + '"' +
      (diagnosis[i] ? " checked" : "") + '><span class="check-text">' + d.tanya + "</span></label>";
  }).join("");
  return "<h1>Diagnosis Kesehatan Keuangan</h1>" +
  '<p class="lede">Jawab 6 pertanyaan dengan jujur. Skor 0–2 berarti perlu perhatian, 3–4 cukup sehat, 5–6 sehat. ' +
  "Setiap jawaban \"tidak\" menampilkan satu rekomendasi perbaikan.</p>" +
  '<div class="card"><h2>Pertanyaan</h2>' + items + "</div>" +
  '<div class="card"><h2>Hasil diagnosis</h2>' +
  '<p>Skor: <strong id="diagnosis-skor"></strong> &nbsp; <span id="diagnosis-label" class="pill red"></span></p>' +
  '<div id="diagnosis-rekomendasi"></div></div>';
}
function bindDiagnosis() {
  document.querySelectorAll(".diagnosis-cek").forEach(function (cb) {
    cb.addEventListener("change", function () {
      diagnosis[numVal(cb.getAttribute("data-i"), 0)] = cb.checked;
      store.set("dk-diagnosis-v1", diagnosis);
      diagnosisTampil();
    });
  });
  diagnosisTampil();
}

// ---------- router ----------
const PAGES = {
  "/": { title: "DompetKeluarga — Anggaran Rumah Tangga", render: renderBeranda, bind: null },
  "/kalkulator": { title: "Kalkulator 50/30/20 — DompetKeluarga", render: renderKalkulator, bind: bindKalkulator },
  "/pengeluaran": { title: "Pelacak Pengeluaran — DompetKeluarga", render: renderPengeluaran, bind: bindPengeluaran },
  "/tujuan": { title: "Tabungan & Tujuan — DompetKeluarga", render: renderTujuan, bind: bindTujuan },
  "/harga": { title: "Harga Pokok — DompetKeluarga", render: renderHarga, bind: bindHarga },
  "/panduan": { title: "Panduan 50/30/20 — DompetKeluarga", render: renderPanduan, bind: bindPanduan },
  "/utang": { title: "Perencana Pelunasan Utang — DompetKeluarga", render: renderUtang, bind: bindUtang },
  "/diagnosis": { title: "Diagnosis Keuangan — DompetKeluarga", render: renderDiagnosis, bind: bindDiagnosis }
};
function route() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";
  const page = PAGES[path] || PAGES["/"];
  document.title = page.title;
  document.getElementById("app").innerHTML = page.render();
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    if (a.getAttribute("data-route") === (PAGES[path] ? path : "/")) a.classList.add("active");
    else a.classList.remove("active");
  });
  if (page.bind) page.bind();
  window.__shotReady = true;
}
window.addEventListener("hashchange", route);
route();
