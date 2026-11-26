# DompetKeluarga — Anggaran Rumah Tangga

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/skykc/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/skykc/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga untuk keluarga Indonesia: beranda dengan aturan 50/30/20 dan grafik pemasukan vs pengeluaran Jun–Nov 2026, kalkulator 50/30/20 (termasuk pintasan UMP DKI Jakarta 2026 Rp 5.729.876), pelacak pengeluaran November 2026 (16 item contoh, total Rp 1.591.500), tiga tujuan tabungan dengan estimasi bulan menuju target, 16 harga pokok acuan nasional November 2026 (BPS) dengan kalkulator keranjang belanja, dan panduan 50/30/20 dengan checklist interaktif.

Angka nyata: penghasilan contoh Keluarga Hartono Rp 9.200.000/bulan, rencana belanja Rp 7.980.000, tabungan 19% (Rp 1.780.000). Semua data contoh tersimpan hanya di peramban (localStorage). Tanpa framework, tanpa request jaringan, tanpa font eksternal.

## Menjalankan

```sh
node serve.ts
```

Lalu buka alamat lokal yang dicetak di terminal.

## Menyerahkan (kit make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
