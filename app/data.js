// Data DompetKeluarga: angka nyata keluarga contoh + harga acuan BPS November 2026.
// Semua angka ditulis di sini; tidak ada yang diambil dari jaringan.

export const household = {
  name: 'Keluarga Hartono',
  city: 'Jakarta',
  members: 4,
  income: 9200000,
  incomeParts: [
    { who: 'Ayah', amount: 6200000 },
    { who: 'Ibu', amount: 3000000 },
  ],
  // Rencana November 2026: belanja Rp 6.200.000 + tabungan Rp 1.780.000 = Rp 7.980.000.
  planTotal: 7980000,
  planSpend: 6200000,
  planNeeds: 4350000,
  planWants: 1850000,
  planSave: 1780000,
  umpJakarta2026: 5729876,
};

// Pemasukan vs pengeluaran Jun–Nov 2026. November paling hemat.
export const monthly = [
  { month: 'Jun', income: 9200000, expense: 8450000 },
  { month: 'Jul', income: 9200000, expense: 8120000 },
  { month: 'Agu', income: 9200000, expense: 8300000 },
  { month: 'Sep', income: 9200000, expense: 7950000 },
  { month: 'Okt', income: 9200000, expense: 8050000 },
  { month: 'Nov', income: 9200000, expense: 7820000 },
];

// 16 pengeluaran contoh November 2026. Total persis Rp 1.591.500.
export const defaultExpenses = [
  { id: 'e01', name: 'Beras medium 5 kg', category: 'Belanja dapur', amount: 67500 },
  { id: 'e02', name: 'Token listrik', category: 'Utilitas', amount: 200000 },
  { id: 'e03', name: 'Seragam sekolah', category: 'Pendidikan', amount: 275000 },
  { id: 'e04', name: 'Telur ayam 1 kg', category: 'Belanja dapur', amount: 28500 },
  { id: 'e05', name: 'Ayam potong 1 kg', category: 'Belanja dapur', amount: 38000 },
  { id: 'e06', name: 'Minyak goreng 2 L', category: 'Belanja dapur', amount: 41000 },
  { id: 'e07', name: 'Gula pasir 1 kg', category: 'Belanja dapur', amount: 18000 },
  { id: 'e08', name: 'LPG 3 kg', category: 'Utilitas', amount: 20000 },
  { id: 'e09', name: 'Sayur dan buah pasar', category: 'Belanja dapur', amount: 85000 },
  { id: 'e10', name: 'Sabun dan deterjen', category: 'Rumah tangga', amount: 62000 },
  { id: 'e11', name: 'Pulsa dan internet', category: 'Utilitas', amount: 150000 },
  { id: 'e12', name: 'Transportasi (bensin)', category: 'Transportasi', amount: 180000 },
  { id: 'e13', name: 'Jajan anak sekolah', category: 'Pendidikan', amount: 120000 },
  { id: 'e14', name: 'Obat dan vitamin', category: 'Kesehatan', amount: 96500 },
  { id: 'e15', name: 'Iuran RT dan sampah', category: 'Rumah tangga', amount: 50000 },
  { id: 'e16', name: 'Nonton dan hiburan keluarga', category: 'Hiburan', amount: 160000 },
];

export const expenseCategories = [
  'Belanja dapur', 'Utilitas', 'Pendidikan', 'Transportasi', 'Rumah tangga', 'Kesehatan', 'Hiburan',
];

// Tiga tujuan tabungan. Dana darurat = 3 x pengeluaran bulanan (3 x Rp 9.200.000).
export const defaultGoals = [
  { id: 'g1', name: 'Dana darurat', current: 8400000, target: 27600000, monthly: 500000, note: 'Target 3x pengeluaran bulanan' },
  { id: 'g2', name: 'Pendidikan anak', current: 4250000, target: 12000000, monthly: 350000, note: 'Biaya masuk sekolah tahun depan' },
  { id: 'g3', name: 'Liburan keluarga', current: 2750000, target: 5000000, monthly: 250000, note: 'Liburan akhir tahun ke Yogyakarta' },
];

// 16 harga acuan nasional, November 2026 (BPS). Minyak goreng memakai nilai tengah
// Rp 20.500/L untuk hitung keranjang; rentang aslinya Rp 19.800–21.500/L.
export const prices = [
  { name: 'Beras medium', unit: 'kg', price: 13500 },
  { name: 'Telur ayam ras', unit: 'kg', price: 28500 },
  { name: 'Daging ayam ras', unit: 'kg', price: 38000 },
  { name: 'Minyak goreng', unit: 'liter', price: 20500, range: 'Rp 19.800–21.500' },
  { name: 'Gula pasir', unit: 'kg', price: 18000 },
  { name: 'LPG 3 kg (HET subsidi)', unit: 'tabung', price: 20000 },
  { name: 'Daging sapi', unit: 'kg', price: 135000 },
  { name: 'Cabai merah keriting', unit: 'kg', price: 42000 },
  { name: 'Bawang merah', unit: 'kg', price: 38500 },
  { name: 'Bawang putih', unit: 'kg', price: 42500 },
  { name: 'Tepung terigu', unit: 'kg', price: 13000 },
  { name: 'Mie instan', unit: 'bungkus', price: 3000 },
  { name: 'Susu UHT 1 liter', unit: 'karton', price: 19500 },
  { name: 'Tempe', unit: 'kg', price: 18000 },
  { name: 'Tahu', unit: 'bungkus', price: 12000 },
  { name: 'Garam dapur 500 g', unit: 'bungkus', price: 6000 },
];

// 6 tips hemat untuk checklist panduan.
export const tips = [
  { title: 'Catat semua pengeluaran selama 30 hari', desc: 'Tulis setiap rupiah yang keluar, sekecil apa pun, supaya kebocoran ketahuan.' },
  { title: 'Pisahkan rekening tabungan dari rekening belanja', desc: 'Tabungan pindah otomatis di awal gajian, sebelum sempat terpakai.' },
  { title: 'Belanja mingguan dengan daftar dan patokan harga', desc: 'Cek harga acuan BPS di halaman Harga Pokok sebelum ke pasar.' },
  { title: 'Masak di rumah minimal 5 kali seminggu', desc: 'Satu kali makan di luar bisa sama dengan bahan masakan dua hari.' },
  { title: 'Sisihkan tabungan di awal gajian', desc: 'Prinsip bayar diri sendiri dulu: tabungan keluar pertama, bukan dari sisa.' },
  { title: 'Review anggaran tiap akhir bulan bersama keluarga', desc: 'Bandingkan rencana dan realisasi, lalu perbaiki rencana bulan depan.' },
];
