# DECISIONS.md

Catatan rencana, konflik antar dokumen, dan keputusan yang diambil agent selama eksperimen. Tidak ada orang yang bisa ditanya, jadi setiap keputusan dipilih yang paling sederhana dan tetap sesuai dokumen.

## Rencana

### Halaman dan rute (UX-SPEC 3.1)
- PAGE-01 Daftar CRM Pages: `#/crm-pages`
- PAGE-02 Detail CRM Page: `#/crm-pages/:pageId`
- PAGE-03 Daftar Saved Prompt: `#/prompts`
- PAGE-04 Ubah Saved Prompt: `#/prompts/:promptId`
- PAGE-05 Riwayat: `#/riwayat/versi/:versionId` dan `#/riwayat/prompt/:promptId`
- Rute lain diarahkan ke `#/crm-pages`.

### Modal
- MODAL-01 Ringkasan Upload (Draft/Archived)
- MODAL-02 Ganti versi tayang (Upload dan pengembalian pada versi Published)
- MODAL-03 Kembalikan revisi (prompt, Draft, Archived)
- MODAL-04 Atur ulang data contoh

### Aturan bisnis yang dijaga di kode
1. Isi versi hanya berubah di handler tombol konfirmasi modal.
2. Versi Published wajib lewat MODAL-02 (ketik nomor versi), termasuk pengembalian.
3. Satu simpan/konfirmasi = tepat satu revisi; nomor revisi dihitung per objek.
4. Revisi hanya ditambah, tidak diubah atau dihapus (kecuali atur ulang data contoh).
5. Jumlah dan daftar audit dihitung dari `ContinuousAudit.promptId === prompt.id`.
6. Isi sama persis tidak membuat revisi (toast info).
7. File: .html/.htm, tidak kosong, paling besar 512.000 byte.

### Komponen yang dipakai ulang
Button, StatusBadge, Modal (dasar untuk MODAL-01 s.d. 04), Toast, EmptyState, DataTable (PAGE-01 dan PAGE-03), SummaryTable (MODAL-01 dan MODAL-02), DiffView.

### Lapisan kode
- `src/types`: model data INTERACTION-SPEC 11.2.
- `src/store`: data contoh, baca/tulis localStorage (try/catch), aksi murni (upload, simpan prompt, kembalikan revisi, atur ulang), context React.
- `src/utils`: validasi file, validasi form prompt, pencocokan nomor versi, format ukuran dan waktu, diff baris, teks toast simpan prompt.
- `src/components` dan `src/pages`: tampilan.
- `src/tests`: unit test utils/store dan test alur dengan Testing Library.

### Urutan kerja
1. Setup proyek, rencana ini.
2. Model data, data contoh, storage, aksi murni, utils + unit test.
3. Token, layout, komponen dasar, semua halaman dan modal.
4. Test alur UI sesuai ACCEPTANCE-CRITERIA.
5. Pemeriksaan di browser (360/768/1280 px), perbaikan.
6. TEST-REPORT.md dan COMPLETION-REPORT.md.

## Konflik antar dokumen

| No | Bagian yang bertentangan | Keputusan |
|---|---|---|
| K-1 | DESIGN-SYSTEM 11.5 meminta teks tombol menyebut akibat seperti "Kembalikan revisi #3", sedangkan INTERACTION-SPEC 7.4 butir 3 dan AC-012 meminta pengembalian pada versi Published memakai MODAL-02 yang tombolnya "Ganti versi tayang". | Ikut INTERACTION-SPEC/AC (prioritas perilaku dan teks): MODAL-02 untuk pengembalian Published memakai judul dan tombol "Ganti versi tayang". Tombol pemicu di panel detail tetap "Kembalikan revisi #n". |
| K-2 | UX-SPEC 3.2 hanya menyebut "layar kecil" untuk drawer, sedangkan DESIGN-SYSTEM 5.2 dan AC-034 menyebut drawer di bawah 1024px. | Drawer dipakai di bawah 1024px (DESIGN-SYSTEM + AC). |
| K-3 | AC-036 melarang hex di luar file token, tetapi DESIGN-SYSTEM 2.5 memberi warna teks diff (#14532D, #7F1D1D) dan overlay "hitam 50%" yang tidak ada di tabel token bagian 9. | Warna tersebut ditambahkan sebagai token tambahan di `src/styles/tokens.css` (bukan di komponen), sehingga tetap tidak ada hex di luar file token. |

## Keputusan atas hal yang belum jelas

| No | Hal yang belum jelas | Dampak | Keputusan dan alasan |
|---|---|---|---|
| D-1 | Tabel ringkasan MODAL-01 menulis "sama" pada kolom File baru untuk baris CRM Page dan Versi. | Bisa dibaca sebagai teks literal "sama". | Nilai yang sama ditampilkan di kedua kolom, supaya kolom File baru tetap terbaca lengkap. |
| D-2 | Format "[ukuran] KB" tidak menyebut pembulatan. | Ukuran sedikit di atas 500 KB bisa tampil "500,0 KB melebihi batas 500 KB". | KB = byte / 1024, dibulatkan ke atas satu desimal, format Indonesia (koma). |
| D-3 | Urutan validasi file bila beberapa syarat gagal. | Pesan mana yang tampil. | Ekstensi dulu (tanpa membaca file), lalu file dibaca sebagai teks, lalu kosong, lalu ukuran. |
| D-4 | "Isi revisi sama dengan isi saat ini" untuk tombol Kembalikan. | Pengembalian prompt ikut mengembalikan nama. | Prompt: sama bila nama dan isi sama. Versi: sama bila nama file dan isi file sama. Ini juga mencegah revisi tanpa perubahan (aturan bisnis 9). |
| D-5 | Perbandingan prompt hanya menyebut "isi". | Perubahan nama tidak terlihat di diff. | Diff baris dihitung dari isi (prompt) atau isi file (versi). Jika nama/nama file berbeda, ditampilkan keterangan nama di revisi dan nama saat ini di atas diff. |
| D-6 | Empty state "Belum ada perubahan sejak data dibuat." tidak menyebut letaknya. | - | Ditampilkan di atas daftar revisi bila objek hanya punya satu revisi; revisi #1 tetap tampil di daftar. |
| D-7 | Format toast simpan prompt untuk lebih dari tiga audit dan audit nonaktif. | - | "...: A (jadwal), B (jadwal), C (jadwal) dan N lainnya." Audit nonaktif: "Nama (jadwal) (nonaktif)". Urutan audit mengikuti nama, sama dengan panel. |
| D-8 | Tombol "Atur ulang data contoh" pada layar data rusak (INTERACTION-SPEC 2.3). | Data rusak tidak bisa dibaca, jadi tidak ada yang bisa diselamatkan. | Tombol langsung mengatur ulang tanpa MODAL-04, memakai gaya Primary (bukan Danger) agar AC-038 tetap terpenuhi. Toast "Data contoh sudah diatur ulang." tampil. |
| D-9 | Client terpilih harus disimpan di localStorage, sementara AGENTS 5.5 meminta semua data di satu kunci. | - | `selectedClientId` disimpan di objek yang sama (`autoaudit-ws12:v1`). Atur ulang mengembalikannya ke PT Sinar Retail. |
| D-10 | Membuka detail milik client lain lewat URL langsung. | Pemilih client bisa berbeda dari objek yang tampil. | Objek tetap ditampilkan (nama client ditulis di halaman). Tidak ada sinkronisasi otomatis karena tidak diminta. |
| D-11 | Font Inter. | Memuat font dari jaringan menambah dependensi luar. | Tidak memuat Inter dari jaringan; `font-family` tetap Inter dengan fallback system-ui sesuai DESIGN-SYSTEM 3.1. |
| D-12 | Batas 120/20.000 karakter vs atribut `maxLength`. | Dengan `maxLength`, pesan error batas tidak pernah tampil. | Tidak memakai `maxLength`; batas ditegakkan oleh validasi sehingga pesan INTERACTION-SPEC 5.3 bisa muncul. |
| D-13 | Varian tombol "Kembalikan revisi #n" di panel detail. | Satu Primary per halaman, Danger hanya untuk versi Published. | Secondary untuk prompt/Draft/Archived, Danger untuk versi Published. Tombol konfirmasi di MODAL-03 Primary. |
| D-14 | Diff untuk file 500 KB yang sangat berbeda bisa lambat (Myers O(ND)). | AC-039 meminta < 1 detik. | Memakai `diffArrays` dari paket `diff` dengan batas waktu; jika terlewati, semua baris lama ditandai dihapus dan semua baris baru ditandai ditambah (tetap benar, hanya kurang ringkas). |
| D-15 | Membaca file. | jsdom tidak menjamin `Blob.text()`. | Memakai FileReader (diizinkan AGENTS 5.1). |

## Dependensi tambahan

Tidak ada di luar daftar AGENTS Phase 2. `@types/diff` dipakai hanya untuk tipe paket `diff`.

## Usulan (tidak diimplementasikan)

- Sinkronisasi otomatis pemilih client saat membuka URL detail milik client lain.
- Tombol unduh isi revisi sebagai file.

## Keputusan tambahan selama implementasi

| No | Hal | Keputusan dan alasan |
|---|---|---|
| D-16 | "Dua kolom bila muat" untuk PAGE-04 dan PAGE-05 di tablet (UX-SPEC 7). | Dua kolom mulai 768px. Di 640 s.d. 767px kolom sempit kurang dari 200px sehingga panel audit dan daftar revisi tidak terbaca; di bawah 768px bertumpuk (panel audit di atas form). |
| D-17 | Pesan bila FileReader gagal membaca file tidak ada di INTERACTION-SPEC. | Toast error "File tidak bisa dibaca. Pilih ulang file dashboard." supaya kegagalan tidak disembunyikan (AGENTS 7). |
| D-18 | Fokus kembali ke tombol pemicu setelah modal Upload ditutup (DESIGN-SYSTEM 10.3). | Saat dialog file browser dipakai, elemen yang fokus tidak selalu tombol Upload. Modal menerima tujuan fokus eksplisit (`returnFocusTo`), dan alur Upload mengirim tombol Upload kartu itu. |
| D-19 | Fokus awal modal di layar kecil menggulung kotak peringatan MODAL-02 keluar layar. | Fokus awal memakai `preventScroll` sehingga judul dan peringatan tetap terlihat; input tetap menerima fokus. |
| D-20 | AC-039 dan AC-040 meminta pengujian dari GitHub Pages, sedangkan agent dilarang push. | Diuji dengan simulasi: hasil build disajikan dari subpath `/autoaudit-ws12-prd-skill/` di server statis lokal. Status di TEST-REPORT ditulis Blocked sampai peneliti men-deploy. |
