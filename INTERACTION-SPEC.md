# Interaction Specification

Project: Pengaman Perubahan Prompt dan Dashboard AutoAudit
Version: 1.0
Status: Siap dipakai eksperimen
References:
- PRD.md v1.0
- UX-SPEC.md v1.0
- DESIGN-SYSTEM.md v1.0

## 1. Interaction overview

### 1.1 Objective

Dokumen ini mengatur perilaku setiap interaksi: urutan langkah, validasi, teks pesan, keadaan komponen, dan cara data disimpan. Teks dalam tanda kutip dipakai persis seperti tertulis, dengan bagian dalam kurung siku diganti nilai sebenarnya.

### 1.2 Interaction principles

1. Preview before change: isi tidak pernah berubah sebelum pengguna melihat ringkasan dan mengonfirmasi.
2. Proportional friction: hanya perubahan pada versi Published yang memerlukan pengetikan nomor versi.
3. Immediate feedback: setiap aksi yang mengubah data diakhiri toast.
4. User control: setiap modal bisa dibatalkan, dan pembatalan tidak mengubah apa pun.
5. State consistency: setelah data berubah, semua halaman yang menampilkan data itu langsung memakai nilai baru.
6. Persistence: data tersimpan di localStorage dan tetap ada setelah dimuat ulang.

## 2. Global interaction behavior

### 2.1 Navigation

| Action | Expected behavior |
|---|---|
| Klik menu CRM Pages | Buka #/crm-pages untuk client terpilih |
| Klik menu Saved Prompt | Buka #/prompts untuk client terpilih |
| Ganti client di pemilih | Buka halaman daftar dari menu yang sedang aktif untuk client baru |
| Klik breadcrumb | Buka halaman pada tingkat tersebut |
| Muat ulang halaman | Halaman yang sama terbuka kembali dengan data terbaru |
| Buka rute tidak dikenal | Arahkan ke #/crm-pages |
| Buka rute dengan ID yang tidak ada | Tampilkan empty state "Data tidak ditemukan. Mungkin data contoh sudah diatur ulang." dengan tombol "Kembali ke daftar" |

Client terpilih disimpan di localStorage agar tetap sama setelah dimuat ulang.

### 2.2 Global loading

Data dibaca dari localStorage saat aplikasi dimulai. Jika belum ada data, aplikasi menulis data contoh (bagian 11) lalu menampilkan halaman. Tidak ada spinner berkepanjangan karena tidak ada jaringan.

### 2.3 Global error handling

- Jika data di localStorage rusak (gagal di-parse atau versi skema berbeda), aplikasi menampilkan pesan "Data tersimpan tidak bisa dibaca. Muat ulang data contoh untuk melanjutkan." dengan tombol "Atur ulang data contoh".
- Jika penulisan ke localStorage gagal, tampilkan toast error "Perubahan gagal disimpan karena penyimpanan browser penuh atau tidak tersedia. Data sebelumnya tidak berubah." dan jangan ubah state di layar.
- Modal tetap terbuka bila aksinya gagal, sehingga pengguna bisa mencoba lagi atau membatalkan.

## 3. Upload interaction

### 3.1 Trigger

Tombol Upload pada kartu versi di PAGE-02.

### 3.2 Interaction flow

1. Pengguna menekan Upload. Pemilih file browser terbuka dengan filter accept=".html,.htm".
2. Jika pengguna menutup pemilih tanpa memilih file, tidak terjadi apa-apa.
3. Sistem membaca file sebagai teks dan memvalidasinya (bagian 3.3).
4. Jika tidak valid, tampilkan toast error dengan alasan, dan proses berhenti.
5. Jika valid dan isi file sama persis dengan isi versi sekarang, tampilkan toast info "File ini sama dengan file yang sedang dipakai [nomor versi]. Tidak ada perubahan." dan proses berhenti.
6. Jika status versi Draft atau Archived, buka MODAL-01. Jika Published, buka MODAL-02.
7. Pengguna menekan Batal atau Esc: modal tertutup, tidak ada perubahan.
8. Pengguna menekan tombol konfirmasi: sistem menyimpan nama file, ukuran, isi, waktu, dan pengubah ke versi itu, lalu menambah revisi berjenis "Diunggah".
9. Modal tertutup, kartu versi diperbarui, toast success tampil.

### 3.3 Validation rules

| Kondisi | Pesan toast error |
|---|---|
| Ekstensi bukan .html atau .htm | "File harus berformat .html atau .htm." |
| Ukuran 0 byte atau isi hanya spasi | "File kosong. Pilih file dashboard yang berisi." |
| Ukuran lebih dari 500 KB (512.000 byte) | "Ukuran file [ukuran] KB melebihi batas 500 KB." |

### 3.4 MODAL-01 Ringkasan Upload

- Judul: "Ganti file [nomor versi]?"
- Isi: tabel dua kolom.

| Baris | File sekarang | File baru |
|---|---|---|
| CRM Page | [nama CRM Page] | sama |
| Versi | [nomor versi] ([status]) | sama |
| Nama file | [nama file lama] | [nama file baru] |
| Ukuran | [ukuran lama] KB | [ukuran baru] KB |

- Keterangan di bawah tabel: "File sekarang tetap tersimpan di riwayat dan bisa dikembalikan."
- Tombol: "Batal" (Secondary) dan "Ganti file" (Primary).

### 3.5 Toast sesudah Upload

"File [nomor versi] diganti dengan [nama file baru]. File lama tersimpan di riwayat."

### 3.6 Duplicate submission prevention

Tombol konfirmasi nonaktif sejak ditekan sampai proses selesai. Satu kali konfirmasi hanya membuat satu revisi.

## 4. Published version confirmation

### 4.1 Trigger

Upload pada versi Published, atau Kembalikan revisi pada versi Published.

### 4.2 MODAL-02 Ganti versi tayang

- Judul: "Ganti versi yang sedang tayang?"
- Kotak peringatan (danger-light, ikon alert-triangle): "[nomor versi] sedang Published dan dibaca client [nama client]. Isi baru langsung tampil ke client setelah Anda menekan Ganti versi tayang."
- Tabel ringkasan yang sama dengan MODAL-01 (untuk pengembalian, kolom kanan berisi file dari revisi yang dipilih).
- Input dengan label "Ketik [nomor versi] untuk melanjutkan".
- Tombol: "Batal" (Secondary) dan "Ganti versi tayang" (Danger).

### 4.3 Behavior

- Tombol "Ganti versi tayang" nonaktif sampai isi input sama dengan nomor versi, misalnya "v4". Spasi di awal dan akhir diabaikan, dan huruf besar atau kecil tidak dibedakan ("V4" diterima). Nilai lain seperti "v5" atau "4" tidak diterima.
- Menekan Enter di input hanya menjalankan konfirmasi jika tombol sudah aktif.
- Input dikosongkan setiap kali modal dibuka.

## 5. Saved Prompt editing interaction

### 5.1 Trigger

Klik baris prompt di PAGE-03.

### 5.2 Field interaction

| Field | Interaction |
|---|---|
| ID prompt | Baca saja, tampil sebagai teks mono |
| Nama prompt | Input teks, maks 120 karakter, penghitung karakter tampil saat lebih dari 100 |
| Isi prompt | Textarea mono, maks 20.000 karakter, penghitung karakter selalu tampil di kanan bawah |

### 5.3 Validation rules

Validasi berjalan saat Simpan Perubahan ditekan, lalu diperbarui setiap kali field berubah.

| Kondisi | Pesan di bawah field |
|---|---|
| Nama kosong atau hanya spasi | "Nama prompt wajib diisi." |
| Nama lebih dari 120 karakter | "Nama prompt paling banyak 120 karakter." |
| Isi kosong atau hanya spasi | "Isi prompt wajib diisi." |
| Isi lebih dari 20.000 karakter | "Isi prompt paling banyak 20.000 karakter." |

Nama disimpan setelah spasi di awal dan akhir dihapus. Isi disimpan apa adanya.

### 5.4 Form states

| State | Expected behavior |
|---|---|
| Default | Field berisi data tersimpan |
| Invalid | Border danger dan pesan error di field terkait, fokus pindah ke field pertama yang salah |
| Saving | Tombol Simpan Perubahan nonaktif |
| Success | Toast success, waktu dan pengubah terakhir diperbarui, form tetap terbuka dengan isi baru |
| No change | Toast info "Tidak ada perubahan untuk disimpan.", tidak ada revisi baru |
| Error | Toast error penyimpanan (bagian 2.3), isi yang diketik tetap ada |

### 5.5 Toast sesudah simpan

- Jika dipakai audit: "Perubahan disimpan. Dipakai oleh [N] Continuous Audit pada jadwal berikutnya: [nama audit 1] ([jadwal]), [nama audit 2] ([jadwal])." Jika lebih dari tiga audit, tulis tiga nama pertama lalu "dan [sisa] lainnya".
- Jika tidak dipakai audit: "Perubahan disimpan. Prompt ini belum dipakai Continuous Audit mana pun."

Audit berstatus Nonaktif tetap disebut dan diberi keterangan "(nonaktif)" setelah jadwalnya.

### 5.6 Batal

Tombol Batal kembali ke PAGE-03. Fase ini tidak memeriksa perubahan yang belum disimpan.

## 6. Prompt usage interaction

### 6.1 Daftar prompt

Kolom "Dipakai oleh" berisi "[N] audit" bila N lebih dari 0, atau "Tidak dipakai audit" (teks text-muted) bila 0. Nilainya dihitung dari Continuous Audit yang promptId-nya sama dengan ID prompt.

### 6.2 Panel di PAGE-04

- Judul "Dipakai oleh Continuous Audit" dengan jumlah di kanan.
- Daftar audit urut nama: nama, jadwal, badge Aktif atau Nonaktif.
- Keterangan: "Audit memakai prompt berdasarkan ID. Perubahan isi otomatis dipakai pada jadwal berikutnya."
- Jika kosong: empty state UX-SPEC bagian 8.

## 7. History interaction

### 7.1 Membuka riwayat

Dari tombol Riwayat di kartu versi atau tautan Lihat Riwayat di PAGE-04. Revisi terbaru terpilih otomatis dan tab "Isi revisi" aktif.

### 7.2 Memilih revisi

Klik item revisi memperbarui panel detail tanpa memuat ulang halaman. Item bisa dipilih dengan keyboard (Tab lalu Enter atau Space).

### 7.3 Perbandingan

- Tab "Bandingkan dengan isi saat ini" membandingkan isi revisi terpilih (kiri, lama) dengan isi saat ini (kanan, baru) per baris.
- Baris yang hanya ada di isi saat ini ditandai ditambah (+). Baris yang hanya ada di revisi ditandai dihapus (-).
- Ringkasan di atas: "[N] baris ditambah, [M] baris dihapus". Jika tidak ada perbedaan: "Isi revisi ini sama dengan isi saat ini."
- Boleh memakai paket `diff` (jsdiff) untuk menghitung perbedaan. Perbandingan file 500 KB harus selesai kurang dari 1 detik di laptop biasa.
- Isi ditampilkan sebagai teks. Tidak ada HTML dari file yang dirender atau disisipkan dengan innerHTML.

### 7.4 Kembalikan

1. Tombol "Kembalikan revisi #[n]" tampil di panel detail. Tombol nonaktif dengan keterangan "Ini isi saat ini" jika isi revisi sama dengan isi saat ini.
2. Untuk prompt atau versi Draft/Archived, buka MODAL-03:
   - Judul: "Kembalikan ke revisi #[n]?"
   - Isi: "Isi saat ini akan diganti dengan isi revisi #[n]. Riwayat tidak dihapus, dan pengembalian ini dicatat sebagai revisi baru."
   - Tombol: "Batal" dan "Kembalikan revisi #[n]" (Primary).
3. Untuk versi Published, buka MODAL-02 dengan kolom kanan berisi file revisi #[n].
4. Setelah konfirmasi: isi saat ini diganti, revisi baru berjenis "Dikembalikan dari revisi #[n]" ditambahkan, revisi baru terpilih, dan toast "Isi dikembalikan ke revisi #[n] (dicatat sebagai revisi #[nomor baru])." tampil.
5. Untuk prompt, nama prompt ikut dikembalikan ke nama pada revisi tersebut.

### 7.5 Jenis aksi revisi

| Jenis | Kapan dibuat |
|---|---|
| Dibuat | Revisi awal dari data contoh |
| Disimpan | Simpan Perubahan pada prompt |
| Diunggah | Konfirmasi Upload pada versi dashboard |
| Dikembalikan dari revisi #n | Konfirmasi Kembalikan |

## 8. Data reset interaction

- Aksi "Atur ulang data contoh" di bagian bawah sidebar membuka MODAL-04.
- Judul: "Atur ulang data contoh?" Isi: "Semua perubahan dan riwayat akan dihapus dan diganti data awal." Tombol: "Batal" dan "Atur ulang" (Danger).
- Setelah konfirmasi: data diganti data contoh, pengguna dibawa ke #/crm-pages, toast "Data contoh sudah diatur ulang."

## 9. Empty state interaction

Teks empty state mengikuti UX-SPEC bagian 8. Empty state tidak menampilkan tombol yang tidak berfungsi.

## 10. Responsive interaction

- Mobile: tombol menu di header membuka sidebar sebagai drawer dengan overlay. Klik overlay, tekan Esc, atau pilih menu menutup drawer.
- Mobile: tabel prompt tampil sebagai kartu, dan seluruh kartu bisa diketuk.
- Modal pada mobile memenuhi lebar layar dikurangi margin 16px, dan tombol bertumpuk dengan tombol utama di atas.
- Diff view boleh scroll horizontal di dalam bloknya, halaman tidak.

## 11. Data consistency dan data contoh

### 11.1 Penyimpanan

- Semua data disimpan di satu kunci localStorage `autoaudit-ws12:v1` sebagai JSON dengan field `schemaVersion: 1`.
- Penulisan dilakukan sekali per aksi, setelah seluruh perubahan aksi itu siap, supaya tidak ada perubahan setengah jadi.
- Waktu disimpan sebagai string ISO 8601 dan ditampilkan dalam format "20 Nov 2026, 14.05" zona waktu browser.
- Pengguna aktif selalu "Raka Pradipta (System Implementor)".

### 11.2 Model data

- Client: id, name.
- SavedPrompt: id (misalnya "P-101"), clientId, name, content, updatedAt, updatedBy.
- ContinuousAudit: id, clientId, name, schedule (teks), status ("Aktif" atau "Nonaktif"), promptId.
- CrmPage: id, clientId, name.
- DashboardVersion: id, pageId, number (angka), status ("Draft", "Published", "Archived"), fileName, fileSize (byte), fileContent, updatedAt, updatedBy.
- Revision: id, targetType ("prompt" atau "version"), targetId, number (urut per target, mulai 1), action, createdAt, createdBy, snapshot (prompt: name dan content; version: fileName, fileSize, fileContent).

### 11.3 Data contoh

Client "PT Sinar Retail" (id c1):
- P-101 "Audit Respons Sales": dipakai CA "Audit Harian Sales" (setiap hari 06.00, Aktif) dan CA "Audit Mingguan SPV" (Senin 07.00, Aktif). Punya dua revisi: #1 Dibuat oleh "Data contoh" dan #2 Disimpan oleh "Dimas (System Implementor)" yang menambah satu aturan.
- P-102 "Audit Respons Sales - v2": duplikat P-101, tidak dipakai audit. Satu revisi.
- P-103 "Audit Follow Up Leads": dipakai CA "Audit Follow Up Mingguan" (Jumat 08.00, Nonaktif). Satu revisi.
- CRM Page "Dashboard Kinerja Sales": v3 Archived (dashboard-sales-v3.html), v4 Published (dashboard-sales-v4.html, dua revisi: #1 Dibuat dan #2 Diunggah oleh "Dimas (System Implementor)"), v5 Draft (dashboard-sales-v5.html).

Client "CV Maju Motor" (id c2):
- P-201 "Audit Layanan Bengkel": dipakai CA "Audit Harian Bengkel" (setiap hari 06.30, Aktif). Satu revisi.
- CRM Page "Dashboard Booking Servis": v1 Published (dashboard-booking-v1.html), v2 Draft (dashboard-booking-v2.html).

Isi prompt contoh berupa 5 sampai 10 baris aturan audit dalam bahasa Indonesia. Isi file dashboard contoh berupa HTML pendek (10 sampai 30 baris) yang berbeda tiap versi. Semua nama client dan isi bersifat fiktif.

## 12. Interaction completion rules

1. Tidak ada aksi yang mengubah isi versi atau prompt tanpa konfirmasi atau tombol simpan.
2. Setiap aksi yang mengubah data diakhiri toast.
3. Setiap modal bisa ditutup dengan Batal dan Esc tanpa efek samping.
4. Setiap penyimpanan yang berhasil menambah tepat satu revisi.
5. Semua halaman memakai data terbaru setelah perubahan.
6. Pesan error selalu menyebut penyebab dan tidak menghapus input pengguna.

End of INTERACTION-SPEC v1.0
