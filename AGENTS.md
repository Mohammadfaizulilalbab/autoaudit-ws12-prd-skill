# AGENTS.md

AI Coding Agent Instructions
Project: Pengaman Perubahan Prompt dan Dashboard AutoAudit
Version: 1.0
Purpose: Instruksi kerja untuk AI coding agent di seluruh proyek ini.

## 1. Project context

Anda bertindak sebagai AI software engineer yang mengimplementasikan aplikasi web tiruan untuk fitur AutoAudit: ringkasan dan konfirmasi sebelum file dashboard CRM Pages diganti, informasi Continuous Audit yang memakai sebuah Saved Prompt, serta riwayat isi yang bisa dibandingkan dan dikembalikan.

Pengguna aplikasi adalah System Implementor yang memperbarui prompt dan dashboard yang sedang dipakai client. Kesalahan mereka langsung terlihat oleh client, jadi setiap alur yang mengubah data harus jelas akibatnya dan bisa dibatalkan.

Aplikasi harus benar-benar berfungsi. Tampilan yang terlihat benar tetapi tidak menyimpan, tidak memvalidasi, atau tidak bisa dikembalikan dianggap belum selesai.

## 2. Mandatory documentation

Sebelum menulis kode, baca seluruh dokumen berikut dengan urutan ini:

1. PRD.md: kebutuhan produk, user needs, functional requirement, business rules, dan ruang lingkup.
2. UX-SPEC.md: halaman, sitemap, rute, alur pengguna, dan empty state.
3. DESIGN-SYSTEM.md: token warna, tipografi, jarak, komponen, dan ikon.
4. INTERACTION-SPEC.md: langkah interaksi, validasi, teks pesan persis, model data, dan data contoh.
5. ACCEPTANCE-CRITERIA.md: kriteria penerimaan dan format laporan uji.

Dokumen tersebut adalah sumber kebenaran. Jika ada konflik antar dokumen:
- Tulis bagian yang bertentangan.
- Jangan memilih tafsiran secara diam-diam.
- Pakai urutan prioritas: ACCEPTANCE-CRITERIA dan INTERACTION-SPEC untuk perilaku dan teks, DESIGN-SYSTEM untuk tampilan, PRD untuk ruang lingkup.
- Catat keputusan di DECISIONS.md.

## 3. Core development principles

### 3.1 Specification-driven development
- Implementasikan sesuai spesifikasi.
- Jangan menambah fitur tanpa dasar di dokumen.
- Jangan menghilangkan requirement yang sudah ditetapkan.
- Pakai teks pesan dari INTERACTION-SPEC persis seperti tertulis.

### 3.2 UX-first implementation
- Isi tidak boleh berubah sebelum pengguna melihat ringkasan dan mengonfirmasi.
- Setiap aksi yang mengubah data diakhiri toast.
- Setiap modal bisa dibatalkan tanpa efek samping.

### 3.3 Design consistency
- Pakai token dari DESIGN-SYSTEM.md sebagai CSS custom properties.
- Pakai ulang komponen yang sudah ada. Jangan membuat varian baru tanpa kebutuhan.
- Jangan memakai nilai warna atau jarak acak.

### 3.4 Functional completeness
- Setiap tombol punya fungsi.
- Setiap form punya validasi.
- Setiap perubahan data tersimpan ke localStorage dan menghasilkan revisi bila spesifikasi memintanya.
- Jangan membuat kontrol yang hanya terlihat aktif.

## 4. Development workflow

### Phase 1: Analyze
1. Baca seluruh dokumen.
2. Daftar halaman, modal, dan aturan bisnis.
3. Identifikasi komponen yang dipakai ulang (Modal, Toast, StatusBadge, Button, DiffView).
4. Identifikasi requirement yang belum jelas.
5. Tulis rencana implementasi singkat di DECISIONS.md bagian "Rencana".

### Phase 2: Project setup
Stack sudah ditetapkan PRD (NFR-07) dan dirinci di sini:
- Vite + React 18 + TypeScript (mode strict).
- Routing dengan HashRouter dari react-router-dom, sesuai rute di UX-SPEC 3.1.
- Ikon dari lucide-react.
- Perbandingan baris boleh memakai paket `diff`.
- Test dengan Vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, dan jsdom.
- `base` di vite.config.ts diisi `'./'` agar aset termuat di subpath GitHub Pages.

Dependensi lain hanya boleh ditambahkan dengan alasan tertulis di DECISIONS.md.

Script npm yang wajib ada: `dev`, `build`, `preview`, `test` (vitest run).

### Phase 3: Design implementation
Urutan:
1. Token dan gaya dasar.
2. Layout (sidebar, header, drawer mobile).
3. Komponen dasar: Button, StatusBadge, Modal, Toast, Table/Card list.
4. PAGE-01 dan PAGE-02.
5. PAGE-03 dan PAGE-04.
6. PAGE-05 dan DiffView.

### Phase 4: Functional implementation
Urutan:
1. Model data, data contoh, dan lapisan penyimpanan localStorage.
2. Upload, validasi file, MODAL-01, dan MODAL-02.
3. Ubah prompt, validasi, panel pemakaian audit, dan toast sesudah simpan.
4. Pencatatan revisi.
5. Riwayat, perbandingan, dan pengembalian.
6. Atur ulang data contoh dan penanganan data rusak.

Pastikan setiap perubahan langsung terlihat di semua halaman terkait.

### Phase 5: Validation
1. Jalankan `npm test` dan `npm run build` sampai tanpa error.
2. Jalankan aplikasi (`npm run dev` atau `npm run preview`) dan coba setiap alur di browser.
3. Periksa lebar 360px, 768px, dan 1280px.
4. Coba semua validasi dan kondisi error.
5. Cocokkan hasil dengan setiap kriteria di ACCEPTANCE-CRITERIA.md dan tulis hasilnya di TEST-REPORT.md.

Jangan menyatakan fitur selesai hanya karena berhasil di-build atau tampil.

## 5. Feature implementation rules

### 5.1 Upload
- Baca file dengan FileReader atau `file.text()` sebelum validasi isi.
- Validasi sesuai INTERACTION-SPEC 3.3 sebelum modal apa pun terbuka.
- Simpan perubahan hanya di handler tombol konfirmasi.
- Satu konfirmasi menghasilkan tepat satu revisi.

### 5.2 Versi Published
- Logika "apakah input cocok dengan nomor versi" ditulis sebagai fungsi murni dan diuji.
- MODAL-02 dipakai untuk Upload dan pengembalian pada versi Published.

### 5.3 Saved Prompt
- Jumlah dan daftar audit dihitung dari `ContinuousAudit.promptId === prompt.id`. Jangan menyimpan jumlah secara terpisah.
- Toast sesudah simpan mengikuti INTERACTION-SPEC 5.5.

### 5.4 Riwayat
- Revisi hanya ditambah, tidak pernah diubah atau dihapus (kecuali saat atur ulang data contoh).
- Nomor revisi dihitung per objek.
- Isi revisi dan isi file ditampilkan sebagai teks. Dilarang memakai dangerouslySetInnerHTML, innerHTML, atau iframe untuk isi file.

### 5.5 Data persistence
- Semua data di satu kunci localStorage `autoaudit-ws12:v1` dengan `schemaVersion: 1`.
- Bungkus baca dan tulis localStorage dengan try/catch. Jika tulis gagal, state di layar tidak berubah dan toast error tampil.
- Jangan menyimpan data hanya di state komponen.

## 6. Component architecture

Gunakan pendekatan berbasis komponen. Contoh struktur:

```
src/
├── components/
│   ├── layout/        (Sidebar, Header, Drawer)
│   ├── common/        (Button, StatusBadge, Modal, Toast, EmptyState)
│   ├── crm/           (VersionCard, UploadSummaryModal, PublishedConfirmModal)
│   ├── prompts/       (PromptTable, PromptForm, UsagePanel)
│   └── history/       (RevisionList, RevisionDetail, DiffView, RestoreModal)
├── pages/
├── store/             (state, aksi, localStorage, data contoh)
├── utils/             (validasi file, format ukuran dan waktu, diff, pencocokan nomor versi)
├── types/
├── styles/            (tokens.css, global.css)
└── tests/
```

Ketentuan:
- Jangan menaruh seluruh aplikasi di satu file.
- Pisahkan logika bisnis (store, utils) dari komponen tampilan.
- Nama file, fungsi, dan variabel deskriptif dalam bahasa Inggris. Teks antarmuka dalam bahasa Indonesia.

## 7. Code quality rules

1. Readability.
2. Maintainability.
3. Reusability.
4. Separation of concerns.
5. Error handling yang eksplisit.
6. Type safety dengan TypeScript strict, tanpa `any` yang tidak perlu.
7. Security: isi file tidak pernah dirender sebagai HTML.
8. Testing untuk logika utama.

Jangan:
- Membuat fungsi yang tidak dipakai.
- Menambah dependensi tanpa alasan.
- Menyembunyikan error dengan fallback yang menyesatkan.
- Meninggalkan placeholder atau TODO sebagai implementasi akhir.

## 8. Responsive design rules

Aplikasi harus bisa dipakai pada:
- Mobile: di bawah 640px.
- Tablet: 640 sampai 1023px.
- Desktop: 1024px ke atas.
- Wide desktop: 1440px ke atas.

Perhatikan sidebar dan drawer, tabel prompt (menjadi kartu di mobile), modal, panel riwayat, dan diff view. Halaman tidak boleh punya scroll horizontal.

## 9. Testing requirements

Gunakan ACCEPTANCE-CRITERIA.md sebagai dasar. Minimal ada test otomatis untuk:

- Validasi file (format, kosong, ukuran).
- Pencocokan nomor versi di MODAL-02.
- Upload: ringkasan tampil, batal tidak mengubah data, konfirmasi menambah revisi.
- Simpan prompt: validasi, toast dengan nama audit, tidak ada perubahan.
- Riwayat: perbandingan baris, pengembalian membuat revisi baru, nomor revisi per objek.
- Data contoh dimuat saat localStorage kosong.
- Tulis localStorage gagal tidak mengubah data.

Laporkan setiap kriteria dengan status Pass, Fail, Blocked, atau Not Tested di TEST-REPORT.md. Jangan menulis Pass tanpa bukti.

## 10. Visual validation

Bandingkan hasil dengan UX-SPEC.md, DESIGN-SYSTEM.md, dan INTERACTION-SPEC.md. Periksa struktur halaman, hierarki informasi, warna, tipografi, jarak, konsistensi komponen, perilaku interaksi, dan responsivitas.

Jika tersedia browser automation atau screenshot, pakai untuk memeriksa tampilan sebenarnya. Jangan menganggap desain sesuai hanya dari kode CSS.

## 11. Scope control

Yang termasuk ruang lingkup:
- Daftar CRM Page dan kartu versi.
- Upload dengan validasi, ringkasan, dan konfirmasi tegas untuk versi Published.
- Daftar dan ubah Saved Prompt dengan panel pemakaian audit.
- Riwayat, perbandingan, dan pengembalian.
- Data contoh, localStorage, dan atur ulang.
- Tampilan responsif.

Jangan menambahkan secara otomatis:
- Login atau multi pengguna.
- Membuat, menghapus, Publish, atau Archive versi.
- Membuat atau menduplikasi prompt dan audit, atau mengganti prompt di pengaturan audit.
- Pratinjau dashboard, peringatan perubahan belum disimpan, tampilan sebagai SPV.
- Integrasi API AutoAudit.

Ide tambahan dicatat sebagai usulan di DECISIONS.md, tidak diimplementasikan.

## 12. Decision and assumption management

Selama eksperimen ini tidak ada orang yang bisa ditanya. Jika menemukan requirement yang belum jelas:
1. Tulis bagian yang belum jelas dan dampaknya.
2. Pilih solusi paling sederhana yang tetap sesuai dokumen.
3. Catat keputusan dan alasannya di DECISIONS.md.
4. Jangan mengubah requirement inti.

## 13. Completion report

Akhiri pekerjaan dengan COMPLETION-REPORT.md yang memuat:

Implementation summary
- Fitur yang selesai.
- Komponen yang dibuat.
- Struktur proyek.

Acceptance criteria status
- Jumlah kriteria Pass, Fail, Blocked, dan Not Tested (detail di TEST-REPORT.md).

Known issues
- Bug yang diketahui.
- Batasan implementasi.

Next steps
- Pekerjaan yang masih perlu dilakukan.

Jangan menyatakan aplikasi selesai jika masih ada kriteria Must Have yang belum lulus.

## 14. Final instruction

Urutan prioritas:
1. Kebenaran fungsi.
2. Kesesuaian dengan kebutuhan pengguna.
3. Kesesuaian UX dan interaksi.
4. Konsistensi desain.
5. Kualitas kode.
6. Kinerja dan keamanan.
7. Kemudahan pemeliharaan.

Build what is specified, validate what is built, and report what is not yet complete.

End of AGENTS.md v1.0
