# Eksperimen B: PRD + Skill (AutoAudit, Worksheet 12)

Repo ini berisi hasil Eksperimen B untuk Worksheet 12 Rekayasa Interaksi (Project Vibe Code). AI coding agent membangun aplikasi dari `PRD.md` yang sama dengan Eksperimen A, ditambah lima dokumen "skill": spesifikasi UX, design system, spesifikasi interaksi, acceptance criteria, dan instruksi kerja agent (`AGENTS.md`).

- Demo: https://mohammadfaizulilalbab.github.io/autoaudit-ws12-prd-skill/
- Repo pasangan: [Eksperimen A (PRD Only)](https://github.com/Mohammadfaizulilalbab/autoaudit-ws12-prd-only)

## Aplikasi yang dibangun

Aplikasi ini adalah tiruan fitur AutoAudit (aplikasi audit chat WhatsApp milik PT ORDO) untuk tim System Implementor. Fiturnya berasal dari empat kebutuhan UX berprioritas Must di Worksheet 8:

1. Ringkasan versi, status, dan file sebelum Upload mengganti file dashboard CRM Pages.
2. Konfirmasi tegas (mengetik nomor versi) sebelum versi Published diganti.
3. Daftar Continuous Audit yang memakai sebuah Saved Prompt, langsung di halaman prompt dan di pesan sesudah simpan.
4. Riwayat isi prompt dan file dashboard yang bisa dibandingkan dan dikembalikan.

Semua data fiktif dan disimpan di localStorage browser. Aplikasi tidak terhubung ke AutoAudit asli.

## Isi repo

| File | Isi |
|---|---|
| `PRD.md` | Dokumen kebutuhan produk, identik dengan Eksperimen A |
| `UX-SPEC.md` | Halaman, rute, alur pengguna, empty state |
| `DESIGN-SYSTEM.md` | Token warna, tipografi, jarak, komponen |
| `INTERACTION-SPEC.md` | Langkah interaksi, validasi, teks pesan, model data, data contoh |
| `ACCEPTANCE-CRITERIA.md` | 44 kriteria penerimaan Given/When/Then |
| `AGENTS.md` | Instruksi kerja untuk AI coding agent |
| `DECISIONS.md`, `TEST-REPORT.md`, `COMPLETION-REPORT.md` | Keputusan, hasil uji per kriteria, dan laporan akhir yang ditulis agent |
| `LOG-EKSPERIMEN.md` | Prompt verbatim, jeda, waktu kerja, dan catatan setiap iterasi agent |
| `src/` | Kode aplikasi (React, Vite, TypeScript) |

Histori commit di branch `main` mengikuti iterasi agent. Waktu kerja dan setiap prompt dari peneliti tercatat di `LOG-EKSPERIMEN.md`.

## Cara eksperimen dijalankan

Eksperimen A dan B memakai AI yang sama, yaitu Claude Code dengan model Claude Opus 5.5, dalam dua sesi agent terpisah. Prompt keduanya hanya berbeda pada dokumen yang boleh dibaca. Agent bekerja tanpa bisa bertanya, mencatat setiap iterasi, dan commit sendiri. Peneliti hanya menulis dokumen, menjalankan agent, memverifikasi build dan test, lalu men-deploy hasilnya ke GitHub Pages.

## Hasil evaluasi

Kedua situs diuji oleh agent evaluator terpisah dengan checklist yang sama, berdasarkan PRD yang sama. Detail bukti per butir ada di `EVALUASI.md`.

| Kelompok | A: PRD Only | B: PRD + Skill |
|---|---|---|
| Kriteria penerimaan PRD (lulus dari 11) | 11 | 11 |
| Kelengkapan fitur (dari 6) | 6 | 5,5 |
| Kesesuaian UX (dari 8) | 7,5 | 8 |
| Konsistensi desain (dari 6) | 5,5 | 6 |
| Test otomatis yang lolos | 11 | 65 |
| Prompt revisi dari peneliti | 0 | 0 |
| Waktu kerja aktif agent | sekitar 18 menit | sekitar 25 menit |

## Menjalankan di komputer sendiri

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
npm test
npm run build
```

## Penyusun

Mohammad Faiz Ulil Albab (202310370311424), Rekayasa Interaksi kelas C, Informatika Universitas Muhammadiyah Malang, 2026.
