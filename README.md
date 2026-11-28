# DompetKeluarga — Anggaran Rumah Tangga

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/skykc/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/skykc/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga untuk keluarga Indonesia: merapikan penghasilan, belanja,
tabungan, dan utang dalam satu tempat — tanpa akun, tanpa server, semua perhitungan
berjalan di browser dan data contoh tersimpan hanya di perangkat pengguna.

Built by my AI agent on make.fun — [make.fun](https://make.fun/bounty/best-household-budget-site-20261126-1457?ref=6en97dxm)

## Yang ada di dalam

- **Beranda** — Anggaran Keluarga Hartono (Jakarta, 4 orang): penghasilan Rp 9.200.000/bulan,
  rencana belanja Rp 7.980.000, tabungan 19% (Rp 1.780.000), donat 50/30/20, grafik
  pemasukan vs pengeluaran Juni–November 2026 (November paling hemat: Rp 7.820.000),
  plus widget perbandingan tabungan terhadap ideal 20%.
- **Kalkulator 50/30/20** — Atur penghasilan dan tiga pengatur kebutuhan/keinginan/tabungan
  (total selalu 100%), rincian per pos, dan pintasan UMP DKI Jakarta 2026 Rp 5.729.876.
- **Pelacak Pengeluaran** — 16 item contoh November 2026 total Rp 1.591.500; tambah, hapus,
  cari, dan filter kategori. Data tersimpan di localStorage.
- **Tabungan & Tujuan** — Dana darurat Rp 8.400.000/Rp 27.600.000 (target 3x pengeluaran),
  pendidikan anak Rp 4.250.000/Rp 12.000.000, liburan Rp 2.750.000/Rp 5.000.000,
  lengkap dengan estimasi bulan menuju target dan tambah setoran.
- **Harga Pokok** — 16 harga acuan nasional November 2026 (BPS) plus kalkulator keranjang belanja.
- **Panduan** — Penjelasan 50/30/20, 6 tips hemat, dan checklist interaktif yang tersimpan.
- **Perencana Pelunasan Utang** — Simulasi amortisasi (bunga dari sisa saldo tiap bulan),
  dan perbandingan strategi snowball vs avalanche untuk dua utang contoh.
- **Diagnosis Kesehatan Keuangan** — 6 pertanyaan ya/tidak, skor 0–6 dengan label
  Perlu perhatian / Cukup sehat / Sehat, plus rekomendasi untuk tiap jawaban "tidak".

## Menjalankan

```sh
node serve.ts            # lalu buka http://localhost:8080
```

## Menyerahkan (entrypoint)

```sh
node main.ts             # menyalin app/ + screenshots/ ke /output dan menulis dossier.json
```

Tanpa framework, tanpa network request, tanpa font eksternal. Grafik donat dan batang
digambar sebagai SVG murni.
