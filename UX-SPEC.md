# User Experience Specification (UX-SPEC)

Fitur: Pengaman Perubahan Prompt dan Dashboard AutoAudit
Versi: 1.0
Referensi: PRD.md v1.0
Status: Siap dipakai eksperimen

## 1. UX overview

### 1.1 UX objective

Implementor harus bisa menjawab tiga pertanyaan sebelum dan sesudah mengubah hasil kerja yang dipakai client: apa yang akan berubah, siapa yang terdampak, dan bagaimana kembali kalau keliru. Setiap layar dalam spesifikasi ini dirancang untuk salah satu pertanyaan itu.

### 1.2 UX design principles

1. Visibility: keadaan versi, status, dan pemakaian prompt selalu tertulis di layar, tidak perlu ditebak.
2. Proportional friction: aksi berisiko tinggi (mengganti versi Published) diberi langkah konfirmasi lebih berat daripada aksi biasa. Aksi aman tidak diberi konfirmasi tambahan.
3. Consistency: istilah mengikuti AutoAudit asli (CRM Pages, Saved Prompt, Continuous Audit, Upload, Published, Draft, Archived, Simpan Perubahan).
4. Feedback: setiap aksi yang mengubah data diakhiri pesan yang menyebut hasilnya.
5. Recoverability: setiap perubahan isi bisa dilihat kembali dan dikembalikan.
6. Accessibility: status tidak hanya dibedakan dengan warna, dan semua aksi bisa dilakukan dengan keyboard.

## 2. User context

### 2.1 Primary persona

Raka Pradipta, 24 tahun, System Implementor sekitar 1 tahun, memegang 7 client aktif (2 memakai CRM Pages). Ia lebih sering mengubah prompt daripada dashboard dan selalu mengunduh file lama sebelum Upload karena tidak yakin AutoAudit memberi tahu apa yang berubah. Detail persona ada di PRD bagian 3.

### 2.2 User goals

| Goal | Expected experience |
|---|---|
| Mengganti file dashboard tanpa salah versi | Ringkasan versi, status, file lama, dan file baru muncul sebelum isi berubah |
| Tidak menimpa versi yang sedang tayang tanpa sengaja | Versi Published meminta konfirmasi tegas dengan mengetik nomor versi |
| Yakin perubahan prompt dipakai audit | Halaman prompt menampilkan audit yang memakainya, dan pesan sesudah simpan menyebut audit tersebut |
| Tahu apa yang berubah | Riwayat menampilkan isi lama dan perbandingan per baris dengan isi sekarang |
| Pulih dari kesalahan dengan cepat | Tombol Kembalikan di riwayat, tanpa file dari luar aplikasi |

### 2.3 Main user scenario

Skenario mengikuti Worksheet 7. Client PT Sinar Retail meminta revisi aturan audit dan tampilan dashboard.

1. Raka membuka Saved Prompt, memilih prompt "Audit Respons Sales" (ID P-101), dan melihat bahwa prompt ini dipakai dua Continuous Audit.
2. Ia mengubah isi prompt, menekan Simpan Perubahan, dan mendapat pesan bahwa kedua audit akan memakai isi baru pada jadwal berikutnya. Ia tidak perlu membuka pengaturan audit.
3. Ia membuka CRM Pages, memilih "Dashboard Kinerja Sales", lalu menekan Upload pada kartu v4 yang berstatus Published.
4. Ringkasan menampilkan v4, status Published, file lama, dan file baru. Ia mengetik "v4" lalu menekan Ganti versi tayang.
5. Client melapor ada tabel yang hilang. Raka membuka Riwayat v4, membandingkan revisi sebelumnya dengan isi sekarang, lalu menekan Kembalikan. Dashboard kembali ke isi lama dalam beberapa menit.

## 3. Information architecture (IA)

### 3.1 Sitemap

```
AutoAudit (tiruan)
├── Pemilih client (PT Sinar Retail, CV Maju Motor)
├── CRM Pages                         #/crm-pages
│   └── Detail CRM Page               #/crm-pages/:pageId
│       └── Riwayat versi dashboard   #/riwayat/versi/:versionId
├── Saved Prompt                      #/prompts
│   └── Ubah Saved Prompt             #/prompts/:promptId
│       └── Riwayat prompt            #/riwayat/prompt/:promptId
└── Atur ulang data contoh (aksi di sidebar, dengan konfirmasi)
```

Rute memakai hash (#/...) agar halaman tetap terbuka saat dimuat ulang di GitHub Pages. Rute yang tidak dikenal diarahkan ke #/crm-pages.

### 3.2 Primary navigation

- Sidebar kiri berisi logo teks "AutoAudit", pemilih client, menu CRM Pages, menu Saved Prompt, dan aksi Atur ulang data contoh di bagian bawah.
- Header halaman berisi judul halaman, breadcrumb (misalnya CRM Pages / Dashboard Kinerja Sales / Riwayat v4), dan nama pengguna aktif "Raka Pradipta".
- Mengganti client di pemilih membawa pengguna ke halaman daftar dari menu yang sedang aktif.
- Pada layar kecil, sidebar menjadi menu yang dibuka dengan tombol menu di header.

## 4. Page specification

### PAGE-01: Daftar CRM Pages

Purpose: memilih dashboard client yang akan diperbarui.

Information components:
- Daftar CRM Page milik client terpilih: nama, jumlah versi, nomor versi yang sedang Published, waktu ubah terakhir.

User actions:
- Membuka detail CRM Page.

Expected outcome: pengguna tahu dashboard mana yang tayang dan versinya sebelum masuk ke detail.

### PAGE-02: Detail CRM Page

Purpose: melihat semua versi satu dashboard dan mengganti file pada versi tertentu.

Information components:
- Nama CRM Page dan nama client.
- Kartu versi, urut dari nomor terbesar. Setiap kartu memuat nomor versi, badge status (Draft, Published, Archived), nama file, ukuran file, waktu ubah terakhir, dan nama pengubah.

User actions:
- Upload pada kartu versi: membuka pemilih file, lalu ringkasan (MODAL-01 atau MODAL-02).
- Riwayat pada kartu versi: membuka PAGE-05 untuk versi tersebut.

Expected outcome: file versi hanya berubah setelah ringkasan dikonfirmasi, dan kartu langsung menampilkan file baru.

### PAGE-03: Daftar Saved Prompt

Purpose: memilih prompt dan melihat sekilas apakah prompt dipakai audit.

Information components:
- Tabel prompt milik client terpilih: ID prompt, nama, kolom "Dipakai oleh" (misalnya "2 audit" atau "Tidak dipakai audit"), waktu ubah terakhir.

User actions:
- Membuka halaman ubah prompt.

Expected outcome: pengguna bisa membedakan prompt yang dipakai audit dari prompt duplikat sebelum mengubahnya.

### PAGE-04: Ubah Saved Prompt

Purpose: mengubah isi prompt dengan tahu audit mana yang akan memakai isi baru.

Form fields:

| Field | Type | Required |
|---|---|---|
| ID prompt | Teks baca saja | Tidak dapat diubah |
| Nama prompt | Text, maks 120 karakter | Ya |
| Isi prompt | Textarea, maks 20.000 karakter | Ya |

Information components:
- Panel "Dipakai oleh Continuous Audit": daftar audit yang menunjuk ID prompt ini dengan nama audit, jadwal, dan status (Aktif atau Nonaktif). Jika kosong, panel menampilkan empty state.
- Keterangan singkat di panel: "Audit memakai prompt berdasarkan ID. Perubahan isi otomatis dipakai pada jadwal berikutnya."
- Waktu dan pengubah terakhir.

User actions:
- Simpan Perubahan.
- Batal (kembali ke PAGE-03 tanpa menyimpan).
- Lihat Riwayat (PAGE-05 untuk prompt ini).

Expected outcome: setelah simpan, pesan menyebut audit yang akan memakai isi baru, dan riwayat bertambah satu revisi.

### PAGE-05: Riwayat

Purpose: melihat, membandingkan, dan mengembalikan isi prompt atau file versi dashboard.

Information components:
- Judul yang menyebut objeknya, misalnya "Riwayat prompt P-101" atau "Riwayat v4: Dashboard Kinerja Sales".
- Daftar revisi (terbaru di atas): nomor revisi, waktu, pengubah, jenis aksi, dan label "Isi saat ini" pada revisi terbaru.
- Panel detail revisi terpilih dengan dua tab: "Isi revisi" dan "Bandingkan dengan isi saat ini".
- Untuk versi dashboard, nama file revisi ditampilkan di atas isi.

User actions:
- Memilih revisi.
- Berpindah tab.
- Kembalikan (tidak tersedia pada revisi yang sama dengan isi saat ini).

Expected outcome: pengguna tahu persis perbedaan isi dan bisa kembali ke isi lama dengan satu alur konfirmasi.

### Modal

- MODAL-01 Ringkasan Upload: untuk versi Draft atau Archived.
- MODAL-02 Ganti versi tayang: untuk versi Published, dengan kolom ketik nomor versi.
- MODAL-03 Kembalikan revisi: konfirmasi pengembalian. Jika objeknya versi Published, modal ini memakai pola MODAL-02.
- MODAL-04 Atur ulang data contoh.

## 5. User flow

### 5.1 Flow: Upload file ke versi dashboard

```
PAGE-02 Detail CRM Page
   |
   v
Klik Upload pada kartu versi
   |
   v
Pilih file --(batal memilih)--> tidak ada perubahan
   |
   v
Validasi file --(tidak valid)--> pesan error, tidak ada perubahan
   |
   v
Status versi?
   +---- Draft/Archived --> MODAL-01 Ringkasan Upload
   |                           +-- Batal --> tidak ada perubahan
   |                           +-- Ganti file --> simpan + revisi baru --> toast berhasil
   |
   +---- Published -------> MODAL-02 Ganti versi tayang
                               +-- Batal --> tidak ada perubahan
                               +-- ketik nomor versi benar --> tombol aktif
                                       +-- Ganti versi tayang --> simpan + revisi baru --> toast berhasil
```

### 5.2 Flow: Mengubah Saved Prompt

```
PAGE-03 Daftar Saved Prompt
   |
   v
Pilih prompt --> PAGE-04 (panel "Dipakai oleh Continuous Audit" tampil)
   |
   v
Ubah nama/isi --> Simpan Perubahan
   |
   +---- isi tidak valid --> pesan error di field, data input tetap
   +---- tidak ada perubahan --> toast "Tidak ada perubahan untuk disimpan."
   +---- valid --> simpan + revisi baru
                     |
                     v
          Toast menyebut audit yang memakai isi baru
          (atau "belum dipakai Continuous Audit mana pun")
```

### 5.3 Flow: Mengembalikan revisi

```
PAGE-02 atau PAGE-04 --> Riwayat (PAGE-05)
   |
   v
Pilih revisi --> tab "Bandingkan dengan isi saat ini"
   |
   v
Klik Kembalikan --> MODAL-03 (atau pola MODAL-02 bila versi Published)
   +-- Batal --> tidak ada perubahan
   +-- Konfirmasi --> isi saat ini diganti + revisi baru "Dikembalikan dari revisi #n"
                        --> toast berhasil, daftar revisi diperbarui
```

## 6. User interaction requirements

### 6.1 Upload dan ringkasan
- Ringkasan menampilkan file lama dan file baru berdampingan, lengkap dengan nama dan ukuran.
- Ringkasan selalu menyebut status versi dengan teks.
- Isi versi tidak berubah sebelum tombol konfirmasi ditekan.

### 6.2 Versi Published
- Peringatan berwarna bahaya dan menyebut bahwa versi ini sedang dibaca client.
- Tombol konfirmasi nonaktif sampai nomor versi diketik persis.

### 6.3 Saved Prompt
- Panel pemakaian audit terlihat tanpa scroll pada desktop (di samping form) dan berada di atas form pada ponsel.
- Pesan sesudah simpan menyebut nama audit, paling banyak tiga nama lalu "dan N lainnya".

### 6.4 Riwayat
- Perbandingan memakai tanda + dan - di awal baris selain warna.
- Isi file dashboard ditampilkan sebagai teks monospace, tidak dirender.

## 7. Responsive experience

- Desktop (1024 px ke atas): sidebar tetap di kiri, PAGE-04 dua kolom (form dan panel audit), PAGE-05 dua kolom (daftar revisi dan detail).
- Tablet (640 sampai 1023 px): sidebar menjadi menu tersembunyi, PAGE-04 dan PAGE-05 tetap dua kolom bila muat, kalau tidak bertumpuk.
- Mobile (di bawah 640 px): semua satu kolom. Di PAGE-05 daftar revisi tampil di atas, detail di bawah. Modal memenuhi lebar layar dengan margin 16 px.

## 8. Empty states

| Kondisi | Pesan | Aksi |
|---|---|---|
| Client belum punya CRM Page | "Client ini belum punya CRM Page." | Tidak ada |
| Prompt tidak dipakai audit | "Prompt ini belum dipakai Continuous Audit mana pun. Audit hanya memakai prompt yang dipilih di pengaturannya." | Tidak ada |
| Client belum punya Saved Prompt | "Client ini belum punya Saved Prompt." | Tidak ada |
| Riwayat hanya berisi revisi awal | "Belum ada perubahan sejak data dibuat." | Tidak ada |
| ID di rute tidak ditemukan | "Data tidak ditemukan. Mungkin data contoh sudah diatur ulang." | Kembali ke daftar |

## 9. UX error prevention

1. Upload selalu melewati ringkasan.
2. Versi Published memerlukan pengetikan nomor versi.
3. File divalidasi sebelum ringkasan muncul, sehingga ringkasan tidak pernah menampilkan file yang akan ditolak.
4. Kesalahan input ditampilkan di dekat field terkait, dan isi yang sudah diketik tidak hilang.
5. Tombol konfirmasi nonaktif selama proses simpan agar tidak terjadi simpan ganda.
6. Pengembalian revisi tidak menghapus riwayat, sehingga pengembalian yang salah pun bisa dibatalkan dengan mengembalikan revisi lain.

## 10. UX deliverables

1. Sitemap (bagian 3.1).
2. User flow (bagian 5).
3. Page specification (bagian 4).
4. Aplikasi interaktif yang bisa dicoba lewat GitHub Pages.
5. Tampilan responsif sesuai bagian 7.

## 11. UX design constraints

- Tidak boleh ada navigasi atau tombol yang tidak berfungsi.
- Tidak boleh ada fitur di luar ruang lingkup PRD tanpa persetujuan.
- Istilah AutoAudit asli tidak diganti dengan istilah lain.
- Status tidak boleh dibedakan hanya dengan warna.

End of UX-SPEC v1.0
