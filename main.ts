// DompetKeluarga — Anggaran Rumah Tangga (Node 22, standard library only).
// Menyalin app/ dan screenshots/ dari samping file ini ke /output lalu menulis
// /output/dossier.json dengan library make.fun yang divendor. Semua path input
// relatif terhadap file skrip ini (import.meta.url), bukan terhadap cwd:
// grader menjalankan `node /bot/main.ts` dari cwd lain.
// /output tidak pernah dihapus keseluruhannya (di grader itu mount point):
// hanya ISINYA yang dibersihkan satu per satu.
// Di luar container grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
// Bersihkan ISI /output saja — jangan pernah menghapus direktori /output itu sendiri.
for (const entry of readdirSync(out)) {
  rmSync(join(out, entry), { recursive: true, force: true });
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas dari scorer (reference/gate.json): hanya text_max_bytes membentuk byte;
// yang lain menolak entry yang scorer tolak (lebih dari 4 screenshot atau satu
// di atas 256 KiB; lebih dari 993 file dan direktori di app/ atau 16 MiB file app/).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
