# Log eksperimen

Eksperimen B: PRD + Skill (UX-driven, dokumentasi lengkap)

Mata kuliah Rekayasa Interaksi, Worksheet 12 (Project Vibe Code). Penyusun dokumen dan peneliti: Mohammad Faiz Ulil Albab (202310370311424).

## Kondisi

| Item | Isi |
|---|---|
| Input dokumen | PRD.md, UX-SPEC.md, DESIGN-SYSTEM.md, INTERACTION-SPEC.md, ACCEPTANCE-CRITERIA.md, AGENTS.md |
| AI coding agent | Claude Code, subagent general-purpose, model Claude Opus 5.5 (sama untuk Eksperimen A dan B) |
| Isolasi | Agent hanya bekerja di folder repo ini dan hanya membaca dokumen di atas |
| Stack | Ditetapkan di PRD (NFR-07): React, Vite, TypeScript, localStorage, GitHub Pages |

## Catatan peneliti

Bagian ini ditulis peneliti: prompt yang diberikan ke agent (verbatim), waktu mulai dan selesai, serta setiap prompt revisi.

### Prompt awal

Waktu mulai: 2026-11-20 22:01 WIB

```text
Kamu adalah AI coding agent dalam sebuah eksperimen vibe coding.

Folder kerja: /Users/macbookpro/Downloads/Rekayasa Interaksi/ws12_vibecode/autoaudit-ws12-prd-skill
Bangun aplikasi sesuai dokumen di folder ini. Mulai dengan membaca AGENTS.md dan ikuti instruksinya.

Aturan eksperimen (sama untuk semua peserta):
1. Bekerja dan membaca file hanya di dalam folder kerja. Jangan membuka atau mencari file di luar folder kerja.
2. Tidak ada orang yang bisa ditanya selama pengerjaan. Kalau ada yang belum jelas, ambil keputusan sendiri dan catat alasannya.
3. Setiap selesai satu iterasi (satu langkah kerja yang berarti, termasuk perbaikan), tambahkan entri di bagian "Iterasi agent" pada LOG-EKSPERIMEN.md: nomor iterasi, waktu mulai dan selesai (ambil dari perintah date "+%Y-%m-%d %H:%M"), tujuan, file yang berubah, masalah yang ditemui, dan hasil build/test. Jangan mengubah bagian "Kondisi" dan "Catatan peneliti".
4. Commit setiap iterasi ke git (branch main) dengan pesan yang jelas dalam bahasa Indonesia, diakhiri baris kosong lalu baris: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>. Jangan push dan jangan membuat repo GitHub; peneliti yang melakukannya.
5. Jangan commit node_modules atau dist.
6. Jika menjalankan dev server, pakai port 5182 dan matikan sebelum selesai. Jika memakai browser untuk memeriksa tampilan, buka tab sendiri dan jangan menutup tab lain.
7. Perintah yang lama (misalnya npm install) boleh dijalankan di background.

Selesai ketika kamu menilai aplikasi sudah memenuhi dokumen. Pesan terakhirmu berisi: ringkasan yang dibangun, perintah untuk menjalankan, hasil build dan test terakhir, serta hal yang belum selesai.
```

### Jeda karena batas pemakaian

Agent berhenti sekitar 2026-11-20 22:12 WIB karena batas pemakaian API (HTTP 429). Hal yang sama terjadi pada Eksperimen A dan B pada waktu yang sama. Agent dilanjutkan 2026-11-21 02:22 WIB dengan pesan yang sama untuk A dan B:

```text
Lanjutkan pekerjaanmu dari titik terakhir. Pengerjaan sempat terhenti sekitar 22:12 WIB karena batas pemakaian API, bukan karena kesalahanmu. Aturan eksperimen tetap sama. Periksa keadaan folder (git status dan LOG-EKSPERIMEN.md) dulu, lalu lanjutkan sampai selesai.
```

Jeda ini tidak dihitung sebagai waktu pengembangan dan tidak dihitung sebagai revisi.

## Iterasi agent

Bagian ini ditulis agent setiap selesai satu iterasi: waktu, tujuan, file yang berubah, masalah, dan hasil build/test.

### Iterasi 1: Analisis dokumen dan setup proyek

- Mulai: 2026-11-20 22:02
- Selesai: 2026-11-20 22:05
- Tujuan: membaca AGENTS.md, PRD, UX-SPEC, DESIGN-SYSTEM, INTERACTION-SPEC, ACCEPTANCE-CRITERIA; menulis rencana, konflik, dan keputusan di DECISIONS.md; menyiapkan Vite + React 18 + TypeScript strict + Vitest.
- File berubah: DECISIONS.md, package.json, package-lock.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx, src/tests/setup.ts
- Masalah: tipe @types/diff tidak memuat opsi `timeout`, jadi batas kinerja diff memakai `maxEditLength` (dicatat D-14). Script build memakai `tsc --noEmit && vite build` karena hanya ada satu tsconfig.
- Hasil build/test: `npm run build` berhasil. Belum ada test.

### Iterasi 2: Model data, data contoh, penyimpanan, dan logika murni

- Mulai: 2026-11-20 22:05
- Selesai: 2026-11-20 22:07
- Tujuan: menulis model data (INTERACTION-SPEC 11.2), data contoh (11.3), baca/tulis localStorage dengan try/catch, aksi murni (upload, simpan prompt, kembalikan revisi), selector, validasi, format, diff, dan teks pesan, beserta unit test.
- File berubah: src/types/index.ts, src/store/{seed,storage,actions,selectors}.ts, src/utils/{format,validation,diff,messages}.ts, src/tests/logic.test.ts
- Masalah: perlu memastikan diff 500 KB tetap cepat untuk file yang sangat berbeda; dipakai `maxEditLength` dengan fallback semua baris ditandai (D-14). Test kinerja lulus. Pemeriksaan tsc pertama gagal karena narrowing tipe snapshot di test; diperbaiki dengan helper bertipe sebelum commit di-amend.
- Hasil build/test: `npx tsc --noEmit` tanpa error; `vitest run` 32 test lulus.
