// DompetKeluarga — entri best-household-budget-site-20261126-1457 (Node 22, stdlib saja).
// Situs ini file statis di app/ (modul ES, CSS, tanpa build step); isinya file sendiri:
// tidak ada yang dimuat dari jaringan. Program ini menyerahkan situs: menyalin app/ dan
// screenshots/ dari samping file ini ke /output lalu menulis /output/dossier.json,
// ringkasan yang dibaca juri (screenshot, file dan byte muat pertama, dan sumber),
// dengan pustaka make.fun yang divendor. Biarkan vendor/makefun-frontend.ts apa adanya:
// scorer mengharuskan dossier.json sama byte demi byte dengan yang ditulis salinannya.
//
// Serve lokal: node serve.ts, lalu buka alamat lokal yang dicetak.
// Di luar container grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas scorer (reference/gate.json): hanya text_max_bytes membentuk byte; sisanya
// menolak entri yang scorer tolak (lebih dari 4 screenshot atau satu di atas 256 KiB;
// lebih dari 993 file dan direktori di app/ atau 16 MiB file app/).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
