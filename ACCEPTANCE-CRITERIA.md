# Acceptance Criteria

Project: Pengaman Perubahan Prompt dan Dashboard AutoAudit
Version: 1.0
Status: Siap dipakai eksperimen
References:
- PRD.md v1.0
- UX-SPEC.md v1.0
- DESIGN-SYSTEM.md v1.0
- INTERACTION-SPEC.md v1.0

## 1. Purpose

Dokumen ini menetapkan kapan aplikasi dianggap selesai. Kriteria di sini memastikan aplikasi:

1. Memenuhi kebutuhan pengguna UN-01 sampai UN-04 di PRD.
2. Mengikuti halaman dan alur di UX-SPEC.
3. Memakai token dan komponen di DESIGN-SYSTEM.
4. Berperilaku sesuai INTERACTION-SPEC, termasuk teks pesannya.
5. Bisa diuji ulang oleh orang lain dengan hasil yang sama.

Semua kriteria memakai data contoh di INTERACTION-SPEC bagian 11.3 sebagai keadaan awal.

## 2. Acceptance criteria convention

Setiap kriteria memiliki ID, judul, prioritas, cara verifikasi, lalu kondisi dalam format Given, When, Then.

### Priority

| Priority | Description |
|---|---|
| Must Have | Wajib terpenuhi agar fitur dapat diterima |
| Should Have | Penting, tetapi tidak menghalangi fungsi utama |
| Could Have | Peningkatan kualitas jika waktu memungkinkan |

### Verification method

- Manual Test: dicoba langsung di browser.
- Automated Test: diuji dengan Vitest dan React Testing Library.
- Visual Inspection: diperiksa tampilannya, termasuk dengan screenshot.
- Accessibility Test: diperiksa dengan keyboard dan pemeriksaan atribut ARIA.
- Code Inspection: diperiksa langsung di kode sumber.

## 3. Dashboard version dan Upload

### AC-001: Daftar versi dashboard
Priority: Must Have
Verification: Manual Test
Given client PT Sinar Retail terpilih,
When pengguna membuka CRM Page "Dashboard Kinerja Sales",
Then sistem menampilkan kartu v5, v4, v3 dengan urutan itu, dan setiap kartu memuat nomor versi, badge status berisi ikon dan teks, nama file, ukuran, waktu ubah terakhir, nama pengubah, tombol Upload, dan tombol Riwayat.

### AC-002: Ringkasan sebelum Upload
Priority: Must Have
Verification: Manual Test, Automated Test
Given pengguna berada di detail "Dashboard Kinerja Sales",
When pengguna menekan Upload pada v5 (Draft) dan memilih file .html valid,
Then MODAL-01 tampil dengan judul "Ganti file v5?", tabel CRM Page, versi beserta status, nama dan ukuran file lama serta file baru, dan keterangan bahwa file sekarang tetap tersimpan di riwayat. Selama modal terbuka, kartu v5 masih menampilkan file lama.

### AC-003: Membatalkan Upload
Priority: Must Have
Verification: Manual Test, Automated Test
Given MODAL-01 atau MODAL-02 terbuka,
When pengguna menekan Batal atau Esc,
Then modal tertutup, kartu versi tidak berubah, dan jumlah revisi versi itu tetap.

### AC-004: Konfirmasi Upload
Priority: Must Have
Verification: Manual Test, Automated Test
Given MODAL-01 terbuka untuk v5,
When pengguna menekan "Ganti file",
Then kartu v5 menampilkan nama dan ukuran file baru serta pengubah "Raka Pradipta (System Implementor)", riwayat v5 bertambah satu revisi berjenis "Diunggah", dan toast "File v5 diganti dengan [nama file]. File lama tersimpan di riwayat." tampil.

### AC-005: Validasi format file
Priority: Must Have
Verification: Automated Test
Given pengguna menekan Upload,
When pengguna memilih file berekstensi selain .html atau .htm,
Then tidak ada modal yang terbuka, tidak ada data yang berubah, dan toast error "File harus berformat .html atau .htm." tampil.

### AC-006: Validasi file kosong
Priority: Must Have
Verification: Automated Test
Given pengguna menekan Upload,
When pengguna memilih file .html berukuran 0 byte atau hanya berisi spasi,
Then tidak ada data yang berubah dan toast error "File kosong. Pilih file dashboard yang berisi." tampil.

### AC-007: Validasi ukuran file
Priority: Must Have
Verification: Automated Test
Given pengguna menekan Upload,
When pengguna memilih file .html lebih besar dari 500 KB,
Then tidak ada data yang berubah dan toast error yang menyebut ukuran file dan batas 500 KB tampil.

### AC-008: File sama dengan file sekarang
Priority: Should Have
Verification: Automated Test
Given versi v5 memakai file tertentu,
When pengguna mengunggah file dengan isi yang sama persis,
Then tidak ada modal, tidak ada revisi baru, dan toast info "File ini sama dengan file yang sedang dipakai v5. Tidak ada perubahan." tampil.

## 4. Published version confirmation

### AC-009: Modal versi tayang
Priority: Must Have
Verification: Manual Test
Given pengguna berada di detail "Dashboard Kinerja Sales",
When pengguna menekan Upload pada v4 (Published) dan memilih file valid,
Then MODAL-02 tampil dengan judul "Ganti versi yang sedang tayang?", kotak peringatan yang menyebut v4 dan client PT Sinar Retail, tabel ringkasan, input "Ketik v4 untuk melanjutkan", dan tombol "Ganti versi tayang" bergaya Danger dalam keadaan nonaktif.

### AC-010: Input nomor versi
Priority: Must Have
Verification: Automated Test
Given MODAL-02 terbuka untuk v4,
When pengguna mengetik "", "v5", "4", atau "v44",
Then tombol "Ganti versi tayang" tetap nonaktif. When pengguna mengetik "v4", "V4", atau " v4 ", Then tombol aktif.

### AC-011: Konfirmasi versi tayang
Priority: Must Have
Verification: Manual Test, Automated Test
Given tombol "Ganti versi tayang" aktif,
When pengguna menekannya,
Then file v4 diganti, status v4 tetap Published, riwayat v4 bertambah satu revisi "Diunggah", dan toast berhasil tampil.

### AC-012: Pengembalian revisi pada versi Published
Priority: Must Have
Verification: Manual Test
Given pengguna membuka riwayat v4 dan memilih revisi #1,
When pengguna menekan "Kembalikan revisi #1",
Then yang terbuka adalah MODAL-02 (bukan MODAL-03), dengan kolom kanan berisi file dari revisi #1, dan pengembalian baru berjalan setelah "v4" diketik dan tombol ditekan.

## 5. Saved Prompt dan pemakaian audit

### AC-013: Daftar prompt dan kolom pemakaian
Priority: Must Have
Verification: Manual Test, Automated Test
Given client PT Sinar Retail terpilih,
When pengguna membuka Saved Prompt,
Then tabel menampilkan P-101 dengan "2 audit", P-102 dengan "Tidak dipakai audit", dan P-103 dengan "1 audit", beserta nama dan waktu ubah terakhir.

### AC-014: Panel pemakaian audit
Priority: Must Have
Verification: Manual Test
Given pengguna membuka P-101,
When halaman ubah prompt tampil,
Then panel "Dipakai oleh Continuous Audit" berjumlah 2 dan menampilkan "Audit Harian Sales" (setiap hari 06.00, Aktif) dan "Audit Mingguan SPV" (Senin 07.00, Aktif), beserta keterangan bahwa audit memakai prompt berdasarkan ID.

### AC-015: Prompt duplikat tidak dipakai audit
Priority: Must Have
Verification: Manual Test
Given pengguna membuka P-102,
When halaman ubah prompt tampil,
Then panel menampilkan empty state "Prompt ini belum dipakai Continuous Audit mana pun. Audit hanya memakai prompt yang dipilih di pengaturannya."

### AC-016: Simpan prompt yang dipakai audit
Priority: Must Have
Verification: Manual Test, Automated Test
Given pengguna membuka P-101,
When pengguna mengubah isi dan menekan Simpan Perubahan,
Then isi tersimpan, riwayat P-101 bertambah revisi "Disimpan", dan toast menyebut "Dipakai oleh 2 Continuous Audit pada jadwal berikutnya" beserta nama dan jadwal kedua audit.

### AC-017: Simpan prompt yang tidak dipakai audit
Priority: Must Have
Verification: Automated Test
Given pengguna membuka P-102,
When pengguna mengubah isi dan menekan Simpan Perubahan,
Then toast "Perubahan disimpan. Prompt ini belum dipakai Continuous Audit mana pun." tampil.

### AC-018: Validasi field prompt
Priority: Must Have
Verification: Automated Test
Given pengguna membuka halaman ubah prompt,
When nama atau isi dikosongkan atau hanya berisi spasi lalu Simpan Perubahan ditekan,
Then penyimpanan ditolak, pesan error muncul di bawah field terkait sesuai INTERACTION-SPEC 5.3, isi field lain tidak hilang, dan tidak ada revisi baru.

### AC-019: Tidak ada perubahan
Priority: Should Have
Verification: Automated Test
Given pengguna membuka P-101 tanpa mengubah apa pun,
When pengguna menekan Simpan Perubahan,
Then toast info "Tidak ada perubahan untuk disimpan." tampil dan tidak ada revisi baru.

### AC-020: Audit nonaktif tetap disebut
Priority: Should Have
Verification: Manual Test
Given pengguna membuka P-103,
When pengguna menyimpan perubahan,
Then toast menyebut "Audit Follow Up Mingguan" dengan keterangan "(nonaktif)".

## 6. Riwayat dan pengembalian

### AC-021: Daftar revisi
Priority: Must Have
Verification: Manual Test
Given data contoh,
When pengguna membuka riwayat P-101,
Then daftar menampilkan revisi #2 di atas #1, setiap item memuat waktu, pengubah, dan jenis aksi, dan revisi #2 diberi label "Isi saat ini".

### AC-022: Melihat isi revisi
Priority: Must Have
Verification: Manual Test
Given riwayat P-101 terbuka,
When pengguna memilih revisi #1,
Then tab "Isi revisi" menampilkan nama dan isi prompt pada revisi #1 dalam font mono.

### AC-023: Membandingkan revisi
Priority: Must Have
Verification: Manual Test, Automated Test
Given revisi #1 P-101 terpilih,
When pengguna membuka tab "Bandingkan dengan isi saat ini",
Then baris yang hanya ada di isi saat ini diberi prefix + dan warna ditambah, baris yang hanya ada di revisi diberi prefix - dan warna dihapus, dan ringkasan "[N] baris ditambah, [M] baris dihapus" tampil dengan angka yang benar.

### AC-024: Mengembalikan prompt
Priority: Must Have
Verification: Manual Test, Automated Test
Given revisi #1 P-101 terpilih,
When pengguna menekan "Kembalikan revisi #1" lalu mengonfirmasi di MODAL-03,
Then nama dan isi P-101 sama dengan revisi #1, revisi #3 berjenis "Dikembalikan dari revisi #1" ditambahkan, revisi #1 dan #2 tetap ada, dan toast "Isi dikembalikan ke revisi #1 (dicatat sebagai revisi #3)." tampil.

### AC-025: Mengembalikan versi Draft
Priority: Must Have
Verification: Manual Test
Given v5 sudah pernah diganti sehingga punya dua revisi,
When pengguna mengembalikan revisi #1 lewat MODAL-03,
Then kartu v5 kembali memakai file revisi #1 dan riwayat v5 bertambah satu revisi.

### AC-026: Tombol kembalikan pada isi saat ini
Priority: Should Have
Verification: Manual Test
Given revisi terpilih memiliki isi yang sama dengan isi saat ini,
When panel detail tampil,
Then tombol Kembalikan nonaktif dengan keterangan "Ini isi saat ini".

### AC-027: Isi file tidak dijalankan
Priority: Must Have
Verification: Manual Test, Code Inspection
Given pengguna mengunggah file .html berisi `<script>alert(1)</script>` dan `<b>tebal</b>`,
When pengguna melihat file itu di riwayat dan perbandingan,
Then teks tersebut tampil apa adanya sebagai teks, tidak ada alert, tidak ada teks tebal, dan kode tidak memakai dangerouslySetInnerHTML atau innerHTML untuk isi file.

## 7. Data dan atur ulang

### AC-028: Data contoh awal
Priority: Must Have
Verification: Manual Test, Automated Test
Given localStorage kosong,
When aplikasi dibuka pertama kali,
Then data contoh sesuai INTERACTION-SPEC 11.3 dimuat, termasuk dua client, empat prompt, empat Continuous Audit, dan dua CRM Page.

### AC-029: Data tetap ada setelah dimuat ulang
Priority: Must Have
Verification: Manual Test
Given pengguna sudah mengganti file v5, menyimpan P-101, dan memilih client CV Maju Motor,
When halaman dimuat ulang,
Then semua perubahan, riwayat, client terpilih, dan halaman yang terbuka tetap sama.

### AC-030: Atur ulang data contoh
Priority: Must Have
Verification: Manual Test
Given ada perubahan data,
When pengguna menekan "Atur ulang data contoh" lalu "Atur ulang",
Then data kembali seperti data contoh, pengguna dibawa ke CRM Pages, dan toast "Data contoh sudah diatur ulang." tampil. Menekan Batal tidak mengubah apa pun.

### AC-031: Penyimpanan gagal
Priority: Should Have
Verification: Automated Test
Given penulisan ke localStorage melempar error,
When pengguna menyimpan prompt atau mengonfirmasi Upload,
Then toast error penyimpanan tampil, data di layar tetap data lama, dan modal tetap terbuka.

## 8. User experience acceptance criteria

### AC-032: Navigasi
Priority: Must Have
Verification: Manual Test
Given aplikasi terbuka,
When pengguna memakai menu, breadcrumb, dan pemilih client,
Then setiap tujuan terbuka sesuai INTERACTION-SPEC 2.1, rute tidak dikenal diarahkan ke #/crm-pages, dan ID yang tidak ada menampilkan empty state dengan tombol "Kembali ke daftar".

### AC-033: Feedback
Priority: Must Have
Verification: Manual Test
Given pengguna menjalankan Upload, simpan prompt, kembalikan revisi, atau atur ulang data,
When aksi selesai atau gagal,
Then toast yang sesuai tampil.

### AC-034: Responsive layout
Priority: Must Have
Verification: Visual Inspection
Given lebar layar 360px, 768px, dan 1280px,
When pengguna membuka semua halaman dan modal,
Then tidak ada scroll horizontal pada halaman, sidebar menjadi drawer di bawah 1024px, dan semua tombol bisa dijangkau.

### AC-035: Keyboard dan modal
Priority: Must Have
Verification: Accessibility Test
Given pengguna hanya memakai keyboard,
When pengguna menjalankan alur Upload, simpan prompt, dan kembalikan revisi,
Then semua aksi bisa dicapai dengan Tab, Enter, dan Space, fokus terkunci di modal, Esc menutup modal, dan fokus kembali ke tombol pemicu.

## 9. Design system acceptance criteria

### AC-036: Token desain
Priority: Should Have
Verification: Code Inspection, Visual Inspection
Warna, jarak, radius, dan tipografi memakai token di DESIGN-SYSTEM bagian 9 yang ditulis sebagai CSS custom properties. Tidak ada warna hex di luar file token kecuali untuk kasus yang dicatat di DECISIONS.md.

### AC-037: Status tidak hanya warna
Priority: Must Have
Verification: Visual Inspection
Badge status versi selalu memuat ikon dan teks, dan diff selalu memuat prefix + atau -.

### AC-038: Gaya Danger
Priority: Should Have
Verification: Visual Inspection
Gaya Danger hanya dipakai pada "Ganti versi tayang", pengembalian versi Published, dan "Atur ulang".

## 10. Non-functional acceptance criteria

### AC-039: Kinerja
Priority: Should Have
Verification: Manual Test
Halaman pertama tampil dalam 2 detik dari GitHub Pages pada koneksi rumah biasa, dan perbandingan file 500 KB selesai kurang dari 1 detik.

### AC-040: Hosting GitHub Pages
Priority: Must Have
Verification: Manual Test
Given situs dibuka lewat URL GitHub Pages di subpath nama repo,
When pengguna membuka #/prompts/P-101 lalu memuat ulang halaman,
Then halaman yang sama tampil tanpa error 404 dan semua aset termuat.

### AC-041: Tanpa secret
Priority: Must Have
Verification: Code Inspection
Kode sumber tidak memuat token, kata sandi, atau kunci API.

## 11. Edge case acceptance criteria

### AC-042: Ganti client di halaman detail
Priority: Should Have
Verification: Manual Test
Given pengguna berada di detail CRM Page milik PT Sinar Retail,
When pengguna memilih client CV Maju Motor,
Then pengguna dibawa ke daftar CRM Pages milik CV Maju Motor.

### AC-043: Pengembalian bertingkat
Priority: Should Have
Verification: Automated Test
Given P-101 sudah dikembalikan ke revisi #1 (menghasilkan revisi #3),
When pengguna mengembalikan revisi #2,
Then isi sama dengan revisi #2, revisi #4 "Dikembalikan dari revisi #2" ditambahkan, dan revisi #1 sampai #3 tetap ada.

### AC-044: Nomor revisi per objek
Priority: Should Have
Verification: Automated Test
Given P-101 dan v4 masing-masing punya riwayat,
When salah satunya mendapat revisi baru,
Then nomor revisi objek lain tidak ikut bertambah.

## 12. Release acceptance

Aplikasi memenuhi versi 1.0 apabila:

1. Seluruh kriteria Must Have lulus pengujian dengan bukti.
2. Tidak ada bug kritis pada alur Upload, konfirmasi versi Published, simpan prompt, dan pengembalian revisi.
3. Data tetap ada setelah dimuat ulang.
4. Isi file tidak pernah dirender sebagai HTML.
5. Situs bisa dibuka dan dimuat ulang di GitHub Pages.
6. Automated test (npm test) dan build (npm run build) berjalan tanpa error.

Kriteria Should Have dan Could Have yang belum terpenuhi dicatat sebagai pekerjaan lanjutan dan tidak boleh diklaim selesai.

## 13. Test execution report

Setiap kriteria harus punya hasil pengujian yang ditulis di `TEST-REPORT.md`.

| Field | Description |
|---|---|
| Criteria ID | ID kriteria, misalnya AC-001 |
| Test Status | Pass, Fail, Blocked, atau Not Tested |
| Test Evidence | Nama test otomatis, screenshot, atau langkah manual beserta hasilnya |
| Bug Reference | Nomor bug jika ditemukan |
| Notes | Catatan penguji |

Status Pass hanya boleh ditulis jika ada bukti.

End of ACCEPTANCE-CRITERIA v1.0
