# Product Requirements Document (PRD)

Fitur: Pengaman Perubahan Prompt dan Dashboard AutoAudit
Versi: 1.0
Status: Siap dipakai eksperimen
Jenis produk: Aplikasi web tiruan (prototype fungsional) untuk fitur AutoAudit
Penyusun: Mohammad Faiz Ulil Albab (202310370311424), Rekayasa Interaksi kelas C
Tanggal: 20 November 2026

## 1. Product overview

### 1.1 Latar belakang

AutoAudit adalah aplikasi audit percakapan WhatsApp milik PT ORDO Teknologi Karya. Tim System Implementor memakai dua bagian AutoAudit setiap minggu. Bagian Saved Prompt menyimpan aturan audit yang dibaca AI, dan Continuous Audit menjalankan aturan itu secara terjadwal. Bagian CRM Pages menyimpan dashboard HTML yang dibaca manajer atau SPV client. Satu CRM Page bisa punya beberapa versi, dan salah satunya berstatus Published (sedang tayang ke client).

Wawancara dengan tiga implementor (R1, R2, R3, 14 dan 15 Oktober 2026) menemukan bahwa AutoAudit tidak memperlihatkan keadaan perubahan pada hasil kerja yang sudah dipakai client:

1. Tombol Upload pada kartu versi CRM Pages langsung mengganti isi versi, termasuk versi Published, tanpa ringkasan atau konfirmasi. Di halaman yang sama, Archive dan Delete selalu meminta konfirmasi (R1-17, R2-14).
2. Implementor tidak bisa melihat Continuous Audit mana yang memakai sebuah Saved Prompt. Akibatnya mereka memilih ulang prompt setiap selesai mengubah (R1-10, R3-10), padahal sistem tidak memerlukannya.
3. Tidak ada riwayat isi dan jalan kembali. Pemulihan bergantung pada cadangan pribadi atau file milik rekan (R2-14, R3-14, R3-17). Pada kasus R2, dashboard client rusak sekitar dua jam.

Fitur ini menambahkan ringkasan dan konfirmasi sebelum file dashboard diganti, informasi pemakaian prompt oleh Continuous Audit, serta riwayat isi yang bisa dibandingkan dan dikembalikan.

### 1.2 Fakta sistem yang menjadi dasar

Continuous Audit memakai Saved Prompt berdasarkan ID-nya. Kalau isi prompt dengan ID yang sama diubah, Continuous Audit otomatis memakai isi terbaru pada jadwal berikutnya tanpa perlu dipilih ulang. Prompt hasil duplikasi (misalnya berakhiran "- v2") punya ID baru, jadi tidak dipakai audit mana pun sampai dipilih di pengaturan audit. Fakta ini berasal dari koreksi di Worksheet 8 bagian A.3 dan menggantikan klaim lama di Worksheet 6 dan 7.

### 1.3 Product vision

Implementor bisa memperbarui prompt dan dashboard yang sedang dipakai client dengan tahu persis apa yang akan berubah, siapa yang terdampak, dan bagaimana kembali kalau keliru, tanpa keluar dari AutoAudit.

### 1.4 Target pengguna

Tim System Implementor PT ORDO yang memakai akun super admin dan memegang beberapa client sekaligus. Pengguna sekunder (manajer atau SPV client) hanya membaca dashboard dan tidak memakai fitur ini secara langsung.

### 1.5 Bentuk produk pada fase ini

Fase ini menghasilkan aplikasi web tiruan yang berjalan mandiri dengan data contoh. Aplikasi meniru bagian CRM Pages, Saved Prompt, dan Continuous Audit secukupnya untuk menguji alur fitur. Aplikasi tidak terhubung ke AutoAudit asli.

## 2. User problem

Berdasarkan wawancara, empathy map, dan user journey map (Worksheet 5 sampai 7), masalah utamanya adalah:

1. Upload diperlakukan sebagai aksi biasa. Tidak ada ringkasan versi, status, dan file sebelum isi diganti (R1-19, R2-14).
2. Versi Published bisa ditimpa dengan satu klik, sama mudahnya dengan versi Draft. Ini adalah Moment of Truth di Worksheet 7, tahap 5.
3. Implementor tidak tahu audit mana yang memakai prompt yang sedang diubah, sehingga tidak yakin laporan pagi berikutnya memakai aturan baru (R2-19).
4. Prompt kembar dibuat sebagai cadangan, lalu salah satunya diubah padahal audit memakai yang lain (R2-10, R2-12).
5. Tidak ada riwayat isi prompt dan file dashboard, sehingga pemulihan lambat dan bergantung pada salinan di luar AutoAudit (R3-19, R2-17).

### Problem statement

Tim System Implementor yang memperbarui prompt dan dashboard yang sudah dipakai client membutuhkan cara untuk melihat apa yang akan berubah, audit mana yang terdampak, dan cara kembali ke isi sebelumnya, karena antarmuka sekarang langsung menimpa isi tanpa ringkasan dan tanpa riwayat. Akibatnya dashboard client bisa rusak tanpa disadari dan implementor menyimpan cadangan pribadi di luar sistem.

## 3. Target persona dan user needs

### 3.1 Persona

Nama: Raka Pradipta (nama samaran, gabungan R1 sampai R3)
Usia: 24 tahun (kelompok responden 22 sampai 26 tahun)
Peran: System Implementor, sekitar 1 tahun di tim
Beban kerja: 7 client aktif, 2 di antaranya memakai dashboard CRM Pages

Karakteristik:
- Mahir secara teknis, tetapi selalu menekan Download dulu sebelum Upload karena tidak yakin AutoAudit akan memberi tahu apa yang berubah.
- Lebih sering mengubah prompt daripada dashboard, sekitar sepuluh banding satu dalam seminggu (R2-2, R3-2).
- Satu client bisa dipegang dua orang, dan prompt bisa diubah dari akun client (R1-20, R3-11).

Goals:
- Laporan pagi tiap client masuk tepat waktu dan client tidak komplain (R2-3).
- Revisi tayang tanpa merusak dashboard yang sedang dipakai (R1-3).
- Aturan laporan tiap client tetap sesuai kesepakatan (R3-3).

Pain points:
- Upload langsung mengganti isi versi, termasuk versi Published, tanpa ringkasan atau konfirmasi.
- Tidak tahu prompt mana yang dipakai audit mana.
- Tidak ada riwayat isi, jadi pemulihan bergantung pada salinan pribadi atau milik rekan.

Kutipan: "Saya cuma butuh satu layar yang bilang, 'Kamu mau ganti v5 yang lagi tayang pakai file ini, yakin?'" (R1-19)

### 3.2 User needs

| Kode | Pernyataan kebutuhan | Dasar |
|---|---|---|
| UN-01 | System Implementor butuh cara untuk melihat versi, status, dan file yang akan berubah sebelum Upload berjalan agar bisa memperbarui dashboard tanpa menimpa versi yang salah. | R1-19, R2-14, UXR-01 |
| UN-02 | System Implementor butuh cara untuk mendapat peringatan yang jelas setiap kali perubahan mengenai versi yang sedang tayang agar bisa mencegah dashboard client rusak karena salah klik. | R2-14, R1-17, UXR-02 |
| UN-03 | System Implementor butuh cara untuk melihat Continuous Audit mana saja yang memakai prompt yang sedang diubah agar bisa yakin laporan berikutnya memakai aturan terbaru tanpa memilih ulang prompt. | R2-19, WS8 A.3, UXR-06 |
| UN-04 | System Implementor butuh cara untuk melihat riwayat isi prompt dan file dashboard lalu mengembalikannya dari dalam AutoAudit agar bisa pulih dari kesalahan tanpa cadangan pribadi. | R3-19, R2-17, UXR-08 |

Keempat kebutuhan ini adalah kebutuhan UX berprioritas Must di Worksheet 8.

## 4. Goals dan success metrics

### 4.1 Product goals

1. Implementor melihat ringkasan perubahan sebelum file dashboard diganti.
2. Perubahan pada versi Published selalu melewati konfirmasi yang lebih tegas daripada versi lain.
3. Implementor melihat daftar Continuous Audit yang memakai sebuah prompt langsung dari halaman prompt.
4. Setiap penyimpanan prompt dan unggahan file dashboard tercatat sebagai revisi yang bisa dilihat, dibandingkan, dan dikembalikan.

### 4.2 Success metrics

| Indikator | Target awal |
|---|---|
| Implementor menyebut versi, status, dan file yang berubah dengan benar sebelum konfirmasi, dalam uji skenario Worksheet 7 | 3 dari 3 peserta uji |
| Perubahan versi Published yang terjadi tanpa konfirmasi tegas | 0 |
| Implementor menyebut semua audit yang terdampak langsung dari halaman prompt | 100% tugas uji |
| Waktu memulihkan isi sebelumnya tanpa file dari luar aplikasi | kurang dari 5 menit (kasus R2: sekitar 2 jam) |
| Prompt kembar yang dibuat hanya sebagai cadangan | turun dibanding kebiasaan sekarang |

Target ini adalah hipotesis awal dan perlu divalidasi lewat uji pengguna (Worksheet 13).

## 5. Functional requirements

### FR-01: Daftar versi dashboard

Sistem menampilkan daftar CRM Page per client dan, untuk setiap CRM Page, daftar kartu versi.

Setiap kartu versi menampilkan:
- Nomor versi (v1, v2, dan seterusnya).
- Status: Draft, Published, atau Archived. Satu CRM Page punya paling banyak satu versi Published.
- Nama file dashboard yang sedang dipakai versi itu.
- Waktu dan nama pengubah terakhir.
- Tombol Upload dan tombol Riwayat.

### FR-02: Ringkasan sebelum Upload

Saat pengguna menekan Upload pada kartu versi dan memilih file, sistem:
- Memvalidasi file: berekstensi .html atau .htm, tidak kosong, dan berukuran paling besar 500 KB. File yang tidak valid ditolak dengan pesan yang menyebut alasannya.
- Menampilkan ringkasan sebelum apa pun berubah: nama CRM Page, nomor versi, status versi, nama dan ukuran file lama, nama dan ukuran file baru, serta keterangan bahwa file lama tetap tersimpan di riwayat.
- Mengganti isi versi hanya setelah pengguna menekan tombol konfirmasi di ringkasan.
- Tidak mengubah apa pun jika pengguna membatalkan.
- Menampilkan pesan berhasil dan memperbarui kartu versi setelah penggantian.

### FR-03: Konfirmasi tegas untuk versi Published

Jika versi tujuan berstatus Published, ringkasan FR-02 ditambah peringatan bahwa versi ini sedang tayang dan dibaca client. Tombol konfirmasi baru aktif setelah pengguna mengetik nomor versi tersebut (misalnya "v4"). Tombol konfirmasi memakai gaya aksi berbahaya. Aturan yang sama berlaku saat mengembalikan revisi pada versi Published (FR-05).

### FR-04: Mengubah Saved Prompt dan melihat pemakaiannya

Sistem menampilkan daftar Saved Prompt per client. Setiap baris menampilkan ID prompt, nama, jumlah Continuous Audit yang memakainya, dan waktu ubah terakhir. Prompt yang tidak dipakai audit mana pun diberi keterangan "Tidak dipakai audit".

Di halaman ubah prompt, sistem:
- Menampilkan ID prompt, nama, dan isi prompt yang bisa diubah. Nama dan isi wajib diisi dan tidak boleh hanya spasi.
- Menampilkan panel "Dipakai oleh Continuous Audit" yang berisi nama audit, jadwal, dan status setiap audit yang menunjuk ID prompt ini.
- Setelah tombol Simpan Perubahan ditekan, menyimpan isi baru dan menampilkan pesan yang menyebut jumlah dan nama audit yang akan memakai isi baru pada jadwal berikutnya. Jika tidak ada audit yang memakai prompt ini, pesannya menyebut bahwa prompt belum dipakai Continuous Audit mana pun.

### FR-05: Riwayat isi dan pengembalian

Sistem mencatat revisi setiap kali isi prompt disimpan atau file versi dashboard diganti.

Setiap revisi menyimpan nomor urut, waktu, nama pengubah, jenis aksi (dibuat, disimpan, diunggah, dikembalikan), dan isi lengkap pada saat itu (isi prompt, atau nama file dan isi file dashboard).

Halaman riwayat:
- Menampilkan daftar revisi, terbaru di atas.
- Menampilkan isi revisi yang dipilih.
- Membandingkan isi revisi yang dipilih dengan isi saat ini per baris, dengan tanda baris yang ditambah dan dihapus.
- Menyediakan tombol Kembalikan. Setelah konfirmasi, isi saat ini diganti dengan isi revisi tersebut dan sistem membuat revisi baru berjenis "dikembalikan dari revisi #n". Revisi lama tidak dihapus.

### FR-06: Data contoh dan pengguna aktif

- Saat pertama dibuka, aplikasi memuat data contoh: dua client, beberapa Saved Prompt (termasuk satu prompt duplikat yang tidak dipakai audit), beberapa Continuous Audit, dan satu CRM Page dengan versi Draft, Published, dan Archived.
- Semua perubahan tersimpan di browser dan tetap ada setelah halaman dimuat ulang.
- Pengguna aktif adalah "Raka Pradipta (System Implementor)" dan namanya dicatat sebagai pengubah.
- Tersedia aksi "Atur ulang data contoh" dengan konfirmasi, yang mengembalikan semua data ke keadaan awal.

## 6. Non-functional requirements

### NFR-01: Performance
- Halaman utama tampil dalam 2 detik pada koneksi rumah biasa.
- Membuka riwayat dan membandingkan isi sampai 500 KB tidak membuat halaman macet.

### NFR-02: Usability
- Ringkasan dan peringatan memakai bahasa Indonesia yang langsung menyebut akibatnya.
- Status versi bisa dibedakan dengan teks, tidak hanya dengan warna.

### NFR-03: Responsive
- Bisa dipakai di desktop, tablet, dan ponsel (lebar layar mulai 360 px) tanpa scroll horizontal pada halaman.

### NFR-04: Reliability
- Data tetap ada setelah halaman dimuat ulang atau browser dibuka kembali.
- Jika penyimpanan gagal (misalnya kuota browser penuh), sistem menampilkan pesan gagal dan data lama tidak berubah sebagian.

### NFR-05: Security
- Isi file dashboard ditampilkan sebagai teks di riwayat dan perbandingan, tidak dijalankan sebagai HTML.
- Tidak ada kredensial atau secret di kode sumber.

### NFR-06: Accessibility
- Semua aksi bisa dilakukan dengan keyboard. Modal menahan fokus di dalamnya dan bisa ditutup dengan Esc.
- Kontras teks memenuhi WCAG AA.

### NFR-07: Teknologi dan hosting
- Dibangun dengan React, Vite, dan TypeScript.
- Data disimpan di localStorage browser. Tidak ada backend.
- Dihosting sebagai situs statis di GitHub Pages pada subpath nama repo, jadi navigasi harus tetap jalan saat halaman dimuat ulang di subpath tersebut.

## 7. Business rules

1. Isi file versi dashboard hanya berubah setelah pengguna menekan tombol konfirmasi pada ringkasan.
2. Perubahan isi versi Published, termasuk lewat pengembalian revisi, wajib melewati konfirmasi tegas dengan mengetik nomor versi.
3. Setiap penyimpanan prompt dan setiap penggantian file dashboard membuat tepat satu revisi baru.
4. Revisi tidak bisa diubah atau dihapus dari aplikasi.
5. Mengembalikan revisi membuat revisi baru. Riwayat sebelumnya tetap utuh.
6. Continuous Audit menunjuk Saved Prompt berdasarkan ID. Mengubah isi prompt tidak mengubah ID, sehingga audit memakai isi terbaru pada jadwal berikutnya.
7. Prompt duplikat punya ID sendiri dan tidak dipakai audit sampai dipilih di pengaturan audit.
8. File dashboard yang diterima hanya .html atau .htm, tidak kosong, dan paling besar 500 KB.
9. Jika isi baru sama persis dengan isi saat ini, sistem tidak membuat revisi dan memberi tahu bahwa tidak ada perubahan.

## 8. User stories

US-01: Sebagai System Implementor, saya ingin melihat ringkasan versi, status, dan nama file sebelum Upload berjalan, agar saya tidak menimpa dashboard yang sedang dipakai client. (UN-01, UN-02)

US-02: Sebagai System Implementor, saya ingin diminta mengetik nomor versi sebelum mengganti versi Published, agar versi tayang tidak berubah karena salah klik. (UN-02)

US-03: Sebagai System Implementor, saya ingin melihat Continuous Audit mana saja yang memakai prompt yang sedang saya ubah, agar saya yakin laporan besok pagi memakai aturan baru tanpa memilih ulang prompt. (UN-03)

US-04: Sebagai System Implementor, saya ingin mendapat pesan setelah menyimpan prompt yang menyebut audit mana yang akan memakai isi baru, agar saya tidak perlu memeriksa pengaturan audit satu per satu. (UN-03)

US-05: Sebagai System Implementor, saya ingin melihat dan membandingkan isi lama prompt atau file dashboard, agar saya tahu apa yang berubah. (UN-04)

US-06: Sebagai System Implementor, saya ingin mengembalikan prompt atau dashboard ke isi sebelumnya dari dalam aplikasi, agar saya tidak bergantung pada cadangan pribadi atau file milik rekan. (UN-04)

## 9. Scope

### In scope
- Daftar CRM Page dan kartu versi dashboard per client.
- Upload file dashboard dengan validasi, ringkasan, dan konfirmasi.
- Konfirmasi tegas untuk versi Published.
- Daftar dan ubah Saved Prompt dengan informasi pemakaian oleh Continuous Audit.
- Riwayat isi, perbandingan per baris, dan pengembalian untuk prompt dan versi dashboard.
- Data contoh, penyimpanan di browser, dan aksi atur ulang data contoh.
- Tampilan responsif.

### Out of scope
- Integrasi dengan AutoAudit asli atau API apa pun.
- Login, akun, dan hak akses banyak pengguna.
- Membuat, menghapus, Publish, atau Archive versi dashboard.
- Membuat, menduplikasi, atau menghapus Saved Prompt dan Continuous Audit, termasuk mengganti prompt pada pengaturan audit.
- Menjalankan audit atau menampilkan pratinjau dashboard.
- Kebutuhan UX berprioritas Should dan Could di Worksheet 8 (UXR-03, 04, 05, 07, 09, 10, 11, 12), misalnya tanda keadaan formulir, pembeda visual kartu tayang, dan tampilan sebagai SPV.

## 10. Assumptions dan dependencies

### Assumptions
- Pengguna sudah masuk sebagai implementor. Fase ini tidak membuat login.
- Satu pengguna memakai satu browser. Tidak ada penyuntingan bersamaan.
- File dashboard berukuran kecil sehingga muat di localStorage.
- Data contoh fiktif dan tidak berasal dari client nyata.

### Dependencies
- Node.js dan npm untuk build.
- Browser modern dengan localStorage.
- GitHub Pages untuk hosting.

## 11. Expected deliverables

1. Halaman daftar CRM Page dan detail versi dashboard.
2. Alur Upload dengan validasi, ringkasan, dan konfirmasi tegas untuk versi Published.
3. Halaman daftar Saved Prompt dan halaman ubah prompt dengan panel pemakaian audit.
4. Halaman riwayat dengan tampilan isi, perbandingan, dan pengembalian.
5. Penyimpanan data di browser beserta data contoh dan aksi atur ulang.
6. Kode sumber di repository GitHub dengan histori commit, dan situs yang bisa dibuka lewat GitHub Pages.

## 12. Product acceptance criteria

Fitur dianggap memenuhi kebutuhan produk apabila:

1. Upload file valid ke versi mana pun selalu menampilkan ringkasan sebelum isi berubah.
2. Membatalkan ringkasan tidak mengubah apa pun.
3. Mengganti versi Published hanya bisa dilakukan setelah nomor versi diketik dengan benar.
4. File yang bukan .html atau .htm, kosong, atau lebih dari 500 KB ditolak dengan pesan alasan.
5. Halaman ubah prompt menampilkan semua Continuous Audit yang memakai ID prompt tersebut, dan prompt duplikat ditandai tidak dipakai audit.
6. Pesan setelah menyimpan prompt menyebut audit yang akan memakai isi baru.
7. Setiap penyimpanan prompt dan penggantian file muncul sebagai revisi baru di riwayat.
8. Perbandingan revisi menandai baris yang ditambah dan dihapus.
9. Mengembalikan revisi mengganti isi saat ini dan menambah revisi baru tanpa menghapus revisi lama.
10. Data tetap ada setelah halaman dimuat ulang.
11. Aplikasi bisa dipakai di desktop dan ponsel, dan bisa dibuka lewat GitHub Pages.

End of PRD v1.0
