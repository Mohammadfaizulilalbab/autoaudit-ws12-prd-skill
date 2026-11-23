# Acuan tampilan AutoAudit (revisi 1)

Versi: 1.0
Tanggal: 23 November 2026
Dipakai untuk: prompt revisi 1, identik untuk Eksperimen A dan B

Pemilik produk menilai tampilan aplikasi belum mirip AutoAudit. Dokumen ini merangkum tampilan AutoAudit asli (halaman CRM Pages, kartu versi di Manage HTML, daftar Saved Prompt, dan Edit Saved Prompt) yang diukur langsung dari aplikasinya pada 23 November 2026. Nilai warna dan ukuran di bawah adalah hasil pengukuran gaya komputasi browser, kecuali yang ditandai "perkiraan".

Yang ditiru hanya gaya dan tata letak. Fitur, alur, validasi, dan teks pesan aplikasi tetap. Perbaikan UX (ringkasan sebelum Upload, konfirmasi versi Published, panel pemakaian audit, riwayat dan pengembalian) justru harus tetap ada, digambar dengan gaya AutoAudit.

## 1. Batasan

- Nama aplikasi ditulis "AutoAudit" dengan keterangan kecil "Tiruan untuk Worksheet 12". Jangan memakai logo, gambar, atau aset resmi PT ORDO. Logo cukup berupa teks atau ikon Lucide biasa.
- Jangan menyalin nama client, nama orang, atau isi prompt dari AutoAudit asli. Data contoh tetap fiktif.
- Jangan menambah tombol yang tidak berfungsi. Tombol AutoAudit asli yang fiturnya di luar ruang lingkup (Preview, Download, Publish, Unpublish, Delete, Hapus, Dev Mode, notifikasi, token) tidak ditampilkan.

## 2. Token

### 2.1 Font

Instrument Sans (Google Fonts, bobot 400, 500, 600, 700) untuk semua teks antarmuka. Isi prompt, isi file, dan diff tetap memakai font monospace.

### 2.2 Warna

| Token | Nilai | Dipakai untuk |
|---|---|---|
| bg-page | #F9FAFB | Latar halaman dan sidebar |
| surface | #FFFFFF | Kartu, tabel, modal, top bar, input |
| border-card | #E5E7EB | Garis kartu, wadah tabel, garis bawah top bar |
| border-input | #D1D5DB | Input, select, tombol outline besar |
| border-soft | #E2E8F0 | Pill status, tombol kecil di kartu versi |
| text-strong | #111827 | Judul halaman, judul kartu, header tabel |
| text-body | #374151 | Teks tombol outline, teks umum |
| text-muted | #4B5563 | Menu tidak aktif, label grup sidebar |
| text-meta | #475569 | Metadata kecil, pill netral |
| primary | #3A7BF0 | Tombol utama, teks menu aktif, tautan, nama CRM Page |
| primary-strong | #2C5BBF | Tombol utama di dalam kartu besar (seperti "Add New Version"), dengan bayangan rgba(38,96,190,0.6) 0 8px 15px -5px |
| nav-active-bg | #F8FBFF | Latar menu aktif, dengan bayangan rgba(58,123,240,0.08) 0 4px 10px |
| dark | #111827 | Tombol Edit dan Simpan Perubahan (latar gelap, teks putih) |
| danger | #DC2626 (perkiraan) | Tombol Batal di form prompt dan aksi berbahaya |
| panel | #F3F4F6 | Panel aksi di sisi kanan kartu versi, header tabel |

### 2.3 Pill status

| Status | Latar | Garis | Teks | Titik |
|---|---|---|---|---|
| Published | #ECFDF5 | #A7F3D0 | #047857 | #10B981 |
| Draft | #F8FAFC | #E2E8F0 | #475569 | #94A3B8 |
| Archived | #F8FAFC | #E2E8F0 | #475569 | #94A3B8 |
| Active (prompt) | #ECFDF5 | #A7F3D0 | #047857 | #10B981 |

Pill: radius 9999px, padding 2px 10px, font 12px bobot 600, titik bulat 6px di kiri teks. Draft dan Archived dibedakan dengan teksnya. Boleh menambah ikon Lucide kecil bila perlu.

### 2.4 Ukuran dan bentuk

- Radius: tombol dan input 8px, kartu dan wadah tabel 12px, modal 16px (perkiraan), pill 9999px.
- Tombol besar: tinggi 36 sampai 38px, padding 8px 16px, font 14px bobot 600 (tombol utama 500).
- Tombol kecil di kartu versi: tinggi 30px, padding 6px 8px, font 12px bobot 600, latar putih, garis border-soft, ikon 14px di kiri teks.
- Input dan select: tinggi 38px, garis border-input, radius 8px, font 14px. Input pencarian memakai ikon kaca pembesar di kiri.
- Konten halaman: padding 24px 32px.

## 3. Kerangka halaman

### 3.1 Sidebar (lebar sekitar 247px)

- Latar bg-page, garis kanan border-card.
- Bagian atas: logo teks "AutoAudit" (tebal, warna primary atau text-strong), di bawahnya teks kecil 12px "Tiruan untuk Worksheet 12".
- Menu dikelompokkan dengan label grup 14px bobot 600 warna text-muted, padding atas sekitar 11px:
  - Grup "Company": CRM Pages (ikon layout atau panel).
  - Grup "Active Agent": Saved Prompt (ikon bookmark). Jika aplikasi punya halaman Continuous Audit, taruh di grup ini juga.
- Item menu: font 16px, tinggi sekitar 35px, padding 7px 16px 7px 10px, ikon 20px garis tipis, warna text-muted. Item aktif: latar nav-active-bg, teks primary bobot 600, radius 8px, bayangan halus, dan garis vertikal 2px warna primary di tepi kanan sidebar sejajar item aktif.
- Bagian bawah sidebar, dipisah garis tipis: aksi "Atur ulang data contoh" dengan ikon, gaya seperti item menu.
- Di bawah 1024px sidebar menjadi drawer yang dibuka dari tombol menu di top bar.

### 3.2 Top bar

- Latar surface, tinggi sekitar 70px, garis bawah border-card, padding horizontal 32px.
- Kiri: judul halaman 18px bobot 700 warna text-strong. Halaman detail diberi tombol panah kembali di kiri judul.
- Di sebelah judul (halaman yang bergantung pada client): select "Companies" dengan label kecil 11px di atasnya. Ini tempat pemilih client.
- Kanan: pill profil berisi lingkaran inisial "RP" (latar kuning muda), nama "Raka", dan peran kecil "System Implementor".

## 4. Halaman

### 4.1 Daftar CRM Pages

- Baris aksi di kanan atas konten bila ada aksi. Di bawahnya wadah putih radius 12px, garis border-card, padding 4px.
- Di dalam wadah: baris alat dengan input pencarian (opsional, boleh dilewati kalau tidak ada fungsinya), lalu tabel.
- Header tabel: latar panel, teks 12px bobot 700 huruf kapital warna text-strong, padding 12px 16px.
- Sel tabel padding 16px. Kolom PAGE berisi ikon dokumen kecil warna primary, nama CRM Page tebal warna primary, dan di bawahnya nama company kecil plus chip "ID 230" (font monospace 11px, garis border-soft, radius 4px).
- Kolom lain sesuai data aplikasi: VERSIONS (versi yang Published dan jumlah versi), UPDATED, AKSI (tombol outline kecil yang membuka detail versi).

### 4.2 Detail versi CRM Page

AutoAudit menampilkan versi di modal "Manage HTML". Aplikasi ini boleh tetap memakai halaman detail, dengan isi bergaya modal tersebut:

- Kepala: nama CRM Page 20px bobot 700 diikuti "#ID", di bawahnya nama company kecil.
- Kartu versi: latar surface, garis border-soft, radius 12px, tata letak dua bagian.
  - Bagian kiri (padding 16px): kotak thumbnail 160 x 100px (latar #F8FAFC, garis border-soft, radius 8px, ikon file-code di tengah), lalu nomor versi 14px bobot 600 warna #1E293B, pill status di sebelahnya, nama file, dan baris metadata 12px warna text-meta dengan label tipis dan nilai tebal, misalnya "Ukuran : 3,2 KB   Diubah : 21 Nov 2026, 18.28   Oleh : Dimas".
  - Bagian kanan: panel aksi latar panel, padding 16px, lebar sekitar 224px, berisi tombol kecil (Upload, Riwayat) tersusun dalam grid dua kolom.
  - Kotak catatan bergaya NOTES AutoAudit boleh dipakai untuk keterangan penting: latar #FFFDF7, garis #FDE68A, radius 8px, padding 8px 12px, label 10px bobot 700 huruf kapital warna #B45309.
- Versi Published boleh diberi penanda tambahan (misalnya garis kiri hijau) selama tetap memakai warna pill Published.

### 4.3 Daftar Saved Prompt

Setiap prompt tampil sebagai kartu, tidak sebagai tabel:

- Kartu putih, garis border-card, radius 12px, padding 20px sampai 24px, jarak antar kartu 16px.
- Kiri: kotak ikon 48 x 48px radius 8px berwarna (merah, biru, kuning, hijau, ungu, atau gelap) dengan ikon putih, lalu pill "Active" di bawahnya.
- Tengah: nama company 12px dengan ikon kecil, judul prompt 18px bobot 700 warna text-strong, lalu ID abu tebal kecil (misalnya "P-101" atau "#101"). Di bawahnya cuplikan isi prompt dua baris, 14px warna text-muted. Baris metadata 12px dengan ikon: "Diubah: 21 Nov 2026, 14.05", "Oleh: ...", dan informasi pemakaian audit, misalnya "Dipakai 2 Continuous Audit" atau "Tidak dipakai audit".
- Kanan: tombol bertumpuk lebar sekitar 115px: "Edit" (latar dark, ikon pensil) dan "Riwayat" (outline, ikon history).
- Di atas daftar: input pencarian lebar penuh boleh ada bila berfungsi.

### 4.4 Edit Saved Prompt

- Top bar: panah kembali dan judul "Edit Saved Prompt".
- Konten dua kolom dipisah garis vertikal border-card. Kolom kiri sekitar 300px, kolom kanan sisanya.
- Kolom kiri: label 15px bobot 700 dengan bintang merah untuk field wajib. Isi: info prompt (ID, Company, Status Active), lalu panel "Dipakai oleh Continuous Audit" bergaya kartu kecil (judul tebal, jumlah audit, daftar audit dengan jadwal dan pill status, dan keterangan berlatar biru sangat muda).
- Kolom kanan, baris atas: input nama prompt besar (20px bobot 700, tanpa garis sampai fokus) dengan penghitung karakter kecil "26/120" di kanannya, lalu tombol "Batal" (latar danger, teks putih), "Riwayat" (outline), dan "Simpan Perubahan" (latar dark, ikon save).
- Di bawahnya label "Isi Prompt *" dan textarea besar putih, garis border-card, radius 8px, padding 16px, tinggi minimal 480px, font monospace 14px.

### 4.5 Riwayat

- Ikuti kerangka yang sama: kartu putih radius 12px. Daftar revisi di kiri sebagai kartu kecil, revisi terpilih memakai latar nav-active-bg dan garis kiri primary. Panel detail di kanan dengan tab bergaya pill.
- Diff: blok monospace dengan garis border-card, baris ditambah latar #ECFDF5 teks #047857 dengan prefix +, baris dihapus latar #FEF2F2 teks #B91C1C dengan prefix -.

### 4.6 Modal dan toast

- Modal: latar surface, radius 16px, lebar sesuai isi (ringkasan sekitar 560px), kepala berisi judul 20px bobot 700 dan tombol tutup X di kanan dengan garis bawah border-card, isi padding 24px, tombol di kanan bawah. Overlay hitam 40 sampai 50 persen.
- Kotak peringatan versi Published di modal: latar #FEF2F2, garis #FECACA, teks #991B1B, ikon segitiga peringatan.
- Toast: kartu putih radius 12px, garis border-card, bayangan halus, ikon berwarna sesuai jenis, di kanan atas layar.

## 5. Cara memeriksa

Bandingkan setiap halaman dengan bagian 3 dan 4. Periksa font Instrument Sans termuat, warna sesuai bagian 2, sidebar dan top bar sesuai bagian 3, dan tidak ada scroll horizontal pada 360, 768, dan 1280 px.

End of ACUAN-TAMPILAN v1.0
