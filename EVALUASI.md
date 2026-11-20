# Evaluasi situs A dan B

Evaluasi independen kedua aplikasi hasil eksperimen Worksheet 12 dengan satu checklist yang sama. Dokumen ini identik di repo Eksperimen A dan B.

## 1. Siapa/kapan
- Penulis: agent evaluator QA (Claude Code) yang terpisah dari agent pembangun A dan B.
- Waktu uji: 21 November 2026, sekitar 02.38 sampai 02.50 WIB (cap waktu di aplikasi: 02.40 sampai 02.48).
- Evaluator tidak mengubah kode atau repo.

## 2. Sumber dan metode
Sumber yang dibaca:
- Checklist: lampiran di akhir dokumen ini (P1-P11, F1-F6, U1-U8, D1-D6).
- PRD: `PRD.md` (identik di kedua repo). Dokumen UX tambahan milik B sengaja tidak dipakai sebagai acuan.
- Situs A (PRD only): https://mohammadfaizulilalbab.github.io/autoaudit-ws12-prd-only/
- Situs B (PRD + Skill): https://mohammadfaizulilalbab.github.io/autoaudit-ws12-prd-skill/
- File uji: dashboard-uji-baru.html, dashboard-uji-kedua.html, kosong.html, spasi.html, besar-600kb.html (672 KB), catatan.txt, script-uji.html.

Metode:
- Browser: BrowserOS neo, profil Default, dua tab milik agent (satu per app), lewat `run` (SDK `browser`). Bukti diambil dari snapshot aksesibilitas, `read`, screenshot, dan `evaluateInPage` untuk membaca localStorage, status tombol, warna, dan ukuran.
- Urutan: A diuji penuh dulu, lalu B. Setiap app dimulai dengan tombol "Atur ulang data contoh" miliknya. Kunci localStorage kedua app berbeda (A: `autoaudit-ws12-prd-only:data:v1`, B: `autoaudit-ws12:v1`), jadi data tidak saling menimpa walau satu origin.
- Upload: klik tombol Upload pada kartu, picker dicegat BrowserOS (`{ fileChooserOpen: true }`), lalu `page.upload(null, [path])`. Tidak perlu `DOM.setFileInputFiles`.
- Lebar layar: `Emulation.setDeviceMetricsOverride` lewat `page.cdp` untuk 360, 768, 1280 px; overflow dicek dengan `document.documentElement.scrollWidth > clientWidth` di 7 rute per app dan di modal Published pada 360 px. Emulasi dihapus (`Emulation.clearDeviceMetricsOverride`) di akhir; viewport kembali 1456x868.
- Keyboard: `page.press('Tab')` beberapa kali di dalam modal dan `page.press('Escape')`.
- Kontras: skrip menghitung rasio WCAG untuk semua elemen teks yang terlihat di 5 halaman per app dan di modal Published.
- Standar penilaian sama untuk A dan B: butir checklist dibaca harfiah. Perbedaan kata saja tidak dihitung gagal. Partial/Sebagian = 0,5.
- Di akhir uji, data kedua app diatur ulang lagi ke data contoh, dan kedua tab ditutup.

Catatan transparansi: di A, uji validasi (nama dan isi diisi spasi) dilakukan lalu halaman yang sama dibuka ulang lewat hash yang sama tanpa reload, sehingga formulir masih berisi spasi dan simpan berikutnya menyimpan isi spasi + baris uji. Ini kesalahan prosedur evaluator, bukan bug A; diff A menampilkannya dengan benar dan revisi bisa dikembalikan. Di B, halaman di-reload sebelum simpan.

## 3. Tabel hasil

| Item | A | Bukti A | B | Bukti B |
|---|---|---|---|---|
| P1 Ringkasan sebelum isi berubah | Pass | Upload ke v3 Draft, v2 Published, v1 Archived: modal "Ganti file vN?" muncul dulu, kartu belum berubah sampai tombol konfirmasi ditekan. | Pass | Upload ke v5 Draft, v4 Published, v3 Archived: modal ringkasan muncul dulu, kartu baru berubah setelah "Ganti file"/"Ganti versi tayang". |
| P2 Batal tidak mengubah apa pun | Pass | Batal dan Esc pada ringkasan v3: isi localStorage identik sebelum/sesudah, kartu tetap `dashboard-penjualan-v3-draft.html`. | Pass | Batal dan Esc pada ringkasan v5: localStorage identik, kartu tetap `dashboard-sales-v5.html`, fokus kembali ke tombol Upload v5. |
| P3 Published hanya setelah ketik nomor versi | Pass | Tombol merah "Ganti file v2 yang sedang tayang" disabled untuk "v3", "2"; aktif untuk "v2" (juga "V2", " v2"). Enter dengan "v1" tidak mengonfirmasi. Sama untuk Kembalikan pada v2. | Pass | Tombol "Ganti versi tayang" disabled untuk "v3", "4"; aktif untuk "v4" (juga "V4", " v4"). Enter dengan "v5" tidak mengonfirmasi. Sama untuk Kembalikan pada v4. |
| P4 Tolak non-.html, kosong, >500 KB | Pass | catatan.txt: "hanya file berekstensi .html atau .htm"; kosong.html dan spasi.html: "file kosong"; besar-600kb.html: "672.026 byte, melebihi batas 500 KB". Tidak ada modal, data tidak berubah. | Pass | catatan.txt: "File harus berformat .html atau .htm."; kosong.html dan spasi.html: "File kosong..."; besar-600kb.html: "Ukuran file 656,3 KB melebihi batas 500 KB." Tidak ada modal, localStorage identik. |
| P5 Halaman prompt tampilkan semua audit; duplikat ditandai | Pass | PRM-1001: panel "Dipakai oleh Continuous Audit (2)" berisi 2 audit + jadwal + status (cocok dengan halaman Continuous Audit). PRM-1002 di daftar: "Tidak dipakai audit"; di halaman ubah: "(0) Tidak dipakai audit". | Pass | P-101: panel berisi 2 audit + jadwal + status. P-102 di daftar: "Tidak dipakai audit"; di halaman ubah: angka 0 + "Prompt ini belum dipakai Continuous Audit mana pun." |
| P6 Pesan simpan sebut audit | Pass | "Perubahan disimpan sebagai revisi #3. 2 Continuous Audit akan memakai isi baru...: Laporan Pagi Sales Cabang (...); Rekap Mingguan untuk SPV (...)". PRM-1002: "belum dipakai Continuous Audit mana pun". | Pass | "Perubahan disimpan. Dipakai oleh 2 Continuous Audit pada jadwal berikutnya: Audit Harian Sales (...), Audit Mingguan SPV (...)". P-102: "belum dipakai Continuous Audit mana pun." |
| P7 Simpan/ganti file jadi revisi baru | Pass | Riwayat v3: revisi #2 "diunggah"; PRM-1001: revisi #3 "disimpan". Simpan/upload isi identik tidak membuat revisi ("Tidak ada perubahan..."). | Pass | Riwayat v5: revisi #2 "Diunggah"; P-101: revisi #3 "Disimpan". Isi identik: "File ini sama dengan file yang sedang dipakai v5. Tidak ada perubahan." / "Tidak ada perubahan untuk disimpan." |
| P8 Diff tandai baris tambah/hapus | Pass | Riwayat v3 rev #1 vs saat ini: "+ 7 baris ditambah", "− 27 baris dihapus", baris berlatar merah dengan "−" dan hijau dengan "+". | Pass | Riwayat v5 rev #1, tab "Bandingkan dengan isi saat ini": "9 baris ditambah, 22 baris dihapus", baris merah "−" dan hijau "+". Prompt P-101: "+6. Periksa..." ditandai. |
| P9 Kembalikan ganti isi + revisi baru, lama tetap | Pass | v3: revisi #3 "dikembalikan dari revisi #1", #1 dan #2 tetap ada. v2 (Published): #4 "dikembalikan dari revisi #2". PRM-1001: #4 "dikembalikan dari revisi #2". | Pass | v5: revisi #3 "Dikembalikan dari revisi #1", #1 dan #2 tetap. v4 (Published): #4. P-101: #4 "Dikembalikan dari revisi #2". |
| P10 Data tetap setelah reload | Pass | Reload di riwayat PRM-1001, #/crm/crm-1, #/prompt/PRM-1002: revisi #1-#4, nama file kartu, dan isi prompt tetap. | Pass | Reload di riwayat P-101, #/crm-pages/page-sales, #/prompts/P-102: revisi #1-#4, file kartu, dan isi prompt tetap. |
| P11 Desktop + 360 px + GitHub Pages + reload halaman dalam | Pass | Hash routing; reload di 3 halaman dalam status 200 dan isi tampil. 360/768/1280: tidak ada scroll horizontal di 7 rute. | Pass | Hash routing; reload di 3 halaman dalam status 200. 360/768/1280: tidak ada scroll horizontal di 7 rute; di 360 menu jadi tombol "Buka menu". |
| F1 Daftar versi dashboard | Lengkap | Daftar CRM Page per client ("3 versi · Sedang tayang: v2"); kartu v3/v2/v1 berisi nomor, status, nama file, waktu + pengubah, tombol Upload dan Riwayat. | Lengkap | Tabel CRM Page per client (jumlah versi, versi Published, diubah terakhir); kartu v5/v4/v3 berisi nomor, status, file + ukuran, waktu + pengubah, Upload dan Riwayat. |
| F2 Ringkasan sebelum Upload | Lengkap | Validasi, ringkasan (CRM Page, versi, status, file lama + ukuran, file baru + ukuran, "File lama tetap tersimpan di riwayat (revisi #n)") di Draft, Published, Archived; batal aman; pesan berhasil + kartu diperbarui. | Sebagian | Semua unsur ada untuk Draft/Archived, tetapi ringkasan versi Published (v4) tidak memuat keterangan "file lama tetap tersimpan di riwayat" yang diwajibkan FR-02 (FR-03 = ringkasan FR-02 + peringatan). |
| F3 Konfirmasi tegas Published | Lengkap | Peringatan "Versi ini sedang tayang... sedang dibaca client", ketik "v2", tombol gaya bahaya (merah rgb 180,35,24); berlaku juga untuk Kembalikan di v2. | Lengkap | Peringatan merah dengan ikon "v4 sedang Published dan dibaca client PT Sinar Retail", ketik "v4", tombol merah (rgb 220,38,38); berlaku juga untuk Kembalikan di v4. |
| F4 Ubah Saved Prompt + pemakaian audit | Lengkap | Daftar: ID, nama, "Dipakai 2 Continuous Audit"/"Tidak dipakai audit", waktu ubah. Halaman ubah: ID, nama, isi, validasi spasi, panel audit, pesan simpan menyebut audit. | Lengkap | Daftar: ID, nama, "2 audit"/"Tidak dipakai audit", diubah terakhir. Halaman ubah: ID, nama, isi, validasi, panel audit, pesan simpan menyebut audit. |
| F5 Riwayat + bandingkan + kembalikan | Lengkap | Daftar revisi terbaru di atas, nomor/waktu/pengubah/jenis aksi, isi lengkap sebagai teks, diff per baris, Kembalikan dengan konfirmasi, untuk prompt dan versi. | Lengkap | Sama: daftar terbaru di atas, tab "Isi revisi" dan "Bandingkan dengan isi saat ini", Kembalikan dengan konfirmasi, untuk prompt dan versi. |
| F6 Data contoh, persistensi, atur ulang | Lengkap | 2 client (PT Niaga Motor Sentosa, Klinik Gigi Senyum Sehat), 3 prompt client 1 termasuk duplikat PRM-1002, 5 audit, 1 CRM Page dengan Draft/Published/Archived; pengguna "Raka Pradipta (System Implementor)"; reset dengan konfirmasi. | Lengkap | 2 client (PT Sinar Retail, CV Maju Motor), prompt duplikat P-102, audit, CRM Page dengan Draft/Published/Archived; pengubah tercatat "Raka Pradipta (System Implementor)"; reset dengan konfirmasi. |
| U1 File lama dan baru berdampingan + nama + ukuran | Partial | Nama dan ukuran keduanya ada, tetapi disusun bertumpuk (baris "File lama" di atas baris "File baru"), bukan berdampingan. | Pass | Tabel dua kolom "File sekarang" dan "File baru" berdampingan: nama file dan ukuran (0,9 KB vs 0,4 KB). |
| U2 Peringatan Published beda dan sebut client | Pass | Kotak kuning berbatas di atas ringkasan: "Versi ini sedang tayang. v2 berstatus Published dan sedang dibaca client. Begitu dikonfirmasi, client langsung melihat isi file baru." | Pass | Judul berbeda "Ganti versi yang sedang tayang?" + kotak merah dengan ikon: "v4 sedang Published dan dibaca client PT Sinar Retail. Isi baru langsung tampil ke client..." |
| U3 Setiap aksi ubah data diakhiri pesan | Pass | Toast setelah upload, upload Published, kembalikan, simpan prompt, simpan tanpa perubahan, atur ulang data. | Pass | Toast setelah upload, upload Published, kembalikan, simpan prompt, simpan tanpa perubahan, atur ulang data. |
| U4 Empty state informatif | Pass | PRM-1002: "Tidak dipakai audit. Prompt ini punya ID sendiri... tidak memengaruhi laporan mana pun sampai prompt ini dipilih..."; client 2: "Client ini belum punya CRM Page."; rute salah: "Halaman tidak ditemukan" + tautan kembali. | Pass | P-102: "Prompt ini belum dipakai Continuous Audit mana pun. Audit hanya memakai prompt yang dipilih di pengaturannya."; ID salah: "Data tidak ditemukan... Kembali ke daftar". |
| U5 Navigasi jelas | Pass | Menu CRM Pages / Saved Prompt / Continuous Audit dengan `aria-current="page"` (pil aktif) di semua halaman, tautan kembali "← Semua CRM Page", "← Kembali ke ...", skip link berfungsi dengan keyboard. | Pass | Sidebar dengan item aktif (`aria-current`), breadcrumb di halaman dalam (CRM Pages / Dashboard Kinerja Sales / Riwayat v5), menu hamburger di 360 px. |
| U6 Esc menutup modal, Tab tertahan | Pass | Modal `<dialog>` native (`:modal`): Esc menutup reset, ringkasan Draft, ringkasan Published. Tab berputar Batal → konfirmasi → input; satu langkah keluar ke UI browser (`document.hasFocus()=false`), tidak pernah ke elemen halaman belakang (inert). | Pass | Modal `role="dialog"` `aria-modal`: Esc menutup reset dan ringkasan. Tab berputar penuh di dalam modal (Batal ↔ konfirmasi ↔ input), fokus kembali ke tombol pemicu setelah tutup. |
| U7 Error validasi sebut alasan, isi tidak hilang | Pass | Nama/isi hanya spasi: "Nama wajib diisi dan tidak boleh hanya spasi." / "Isi prompt wajib diisi...", `aria-invalid`, fokus ke Nama; isi yang diketik tetap ada. Error file menyebut alasan. | Pass | "Nama prompt wajib diisi." / "Isi prompt wajib diisi.", `aria-invalid`, fokus ke Nama; isi yang diketik tetap ada. Error file menyebut alasan. |
| U8 Tidak ada tombol/tautan mati | Pass | Dicoba: menu, pemilih client, Upload, Riwayat, Ubah, Lihat riwayat, tautan kembali, Tutup toast, skip link, tombol revisi, Kembalikan, rute tak dikenal. Konsol tanpa error. | Pass | Dicoba: sidebar, pemilih client, breadcrumb, baris tabel (klik baris membuka P-101), Upload, Riwayat, Lihat Riwayat, Batal prompt (kembali ke daftar), Tutup pesan, Buka menu, tab Isi/Bandingkan, Kembalikan. Konsol tanpa error. |
| D1 Status pakai teks + ikon/bentuk, bukan warna saja | Partial | Badge teks "Draft", "Published (tayang)", "Archived" (jadi tidak hanya warna, memenuhi NFR-02), tetapi tanpa ikon dan bentuk badge sama untuk semua status. | Pass | Badge teks + ikon berbeda per status: pensil (Draft), sinyal siaran (Published), kotak arsip (Archived). |
| D2 Warna, tipografi, jarak konsisten | Pass | Header gelap, pil navigasi, kartu putih, tombol biru/putih, modal sama gaya di semua halaman yang diperiksa. | Pass | Sidebar, kartu, tombol berikon, toast, modal sama gaya di semua halaman yang diperiksa. |
| D3 Merah hanya untuk aksi berisiko | Pass | Merah hanya pada konfirmasi Published (upload/kembalikan) dan "Atur ulang semua data". Kembalikan non-Published dan Upload biasa berwarna biru. | Pass | Merah hanya pada "Ganti versi tayang" (upload/kembalikan Published) dan "Atur ulang". Kembalikan non-Published biru, Upload putih. |
| D4 360 px tanpa scroll horizontal | Pass | 7 rute: scrollWidth = clientWidth = 360. Modal Published: lebar 322 px dalam layar, tidak ada anak yang meluber. | Pass | 7 rute: 360/360. Modal Published: 16..344 px, isi bisa digulir vertikal, tidak ada anak meluber. |
| D5 768 dan 1280 px rapi | Pass | 7 rute di 768 dan 1280: tidak ada overflow; screenshot 768 (halaman prompt) rapi, header membungkus tombol reset ke baris kedua. | Pass | 7 rute di 768 dan 1280: tidak ada overflow; di 768 sidebar jadi hamburger; baris kode panjang di diff digulir di dalam kotak (`overflow-x: auto`). |
| D6 Teks terbaca | Pass | Semua teks yang diukur kontras ≥ 4,5:1, huruf terkecil 13 px; modal Published minimum 7,56:1. | Pass | Semua teks dalam keadaan normal ≥ 4,5:1, huruf terkecil 12 px (label kolom tabel). Catatan: "Tidak dipakai audit" (abu #64748b) turun ke 4,26:1 hanya saat baris tabel di-hover. |

## 4. Ringkasan skor
(Partial/Sebagian dihitung 0,5)

| Kelompok | A (PRD only) | B (PRD + Skill) |
|---|---|---|
| P lulus /11 | 11 | 11 |
| F lengkap /6 | 6 | 5,5 |
| U lulus /8 | 7,5 | 8 |
| D lulus /6 | 5,5 | 6 |
| Total /31 | 30 | 30,5 |

Butir tidak penuh:
- A: U1 Partial (file lama/baru bertumpuk, bukan berdampingan); D1 Partial (status hanya teks, tanpa ikon/bentuk pembeda).
- B: F2 Sebagian (ringkasan Published tidak menyebut file lama tetap tersimpan di riwayat).
- Tidak ada butir Fail di kedua app.

## 5. Bug yang ditemukan per app

### A (PRD only)
Tidak ada bug fungsional. Catatan kecil:
1. Konfirmasi ketik nomor versi tidak peka huruf besar dan mengabaikan spasi: "V2" dan " v2" diterima. Langkah: Upload file ke v2 → ketik "V2" → tombol aktif. (Perilaku yang sama ada di B; tidak dihitung gagal karena nomor versinya tetap benar.)
2. Pada modal `<dialog>` native, Tab satu kali keluar ke UI browser sebelum kembali ke modal. Halaman belakang tetap tidak bisa difokus, jadi tidak dihitung gagal.

### B (PRD + Skill)
1. Ringkasan Upload versi Published tidak memuat keterangan "file lama tetap tersimpan di riwayat". Langkah: CRM Pages → Dashboard Kinerja Sales → Upload pada v4 (Published) → pilih dashboard-uji-kedua.html → modal "Ganti versi yang sedang tayang?" hanya berisi peringatan, tabel, dan kolom ketik v4. Ringkasan Draft (v5) memuat kalimat itu.
2. Dialog Kembalikan pada versi Published memakai ulang modal upload ("Ganti versi yang sedang tayang?") dan tidak menyebut nomor revisi yang dikembalikan, juga tidak menyebut bahwa revisi baru akan dibuat. Dialog Kembalikan non-Published menyebut keduanya. Langkah: Riwayat v4 → pilih Revisi #2 → Kembalikan revisi #2. (Catatan UX, tidak memengaruhi skor karena PRD hanya mewajibkan konfirmasi ketik.)
3. Konfirmasi ketik menerima "V4" dan " v4" (sama dengan A).
4. Kontras teks abu "Tidak dipakai audit" di daftar Saved Prompt turun ke 4,26:1 saat baris di-hover (latar #eef2ff). Dalam keadaan normal 4,5:1 ke atas.
5. Tombol Batal di halaman ubah prompt langsung kembali ke daftar dan membuang perubahan yang belum disimpan tanpa konfirmasi. Langkah: P-101 → ubah isi → Batal. (PRD tidak mewajibkan; tanda keadaan formulir termasuk Should di luar cakupan.)
6. Data contoh mencatat pengubah "Data contoh" pada beberapa versi/revisi (misalnya "Diubah 19 Nov 2026, 13.10 oleh Data contoh"), bukan nama orang. Kosmetik.

## 6. Belum dicek
- NFR-01 kinerja: waktu muat 2 detik tidak diukur; diff isi hampir 500 KB tidak diuji karena tidak ada file uji valid berukuran 400-500 KB (besar-600kb.html ditolak di kedua app).
- NFR-04 kegagalan penyimpanan (kuota localStorage penuh) tidak disimulasikan.
- Persistensi setelah browser ditutup lalu dibuka lagi; yang diuji hanya reload halaman.
- Perangkat ponsel nyata dan browser selain BrowserOS (Chromium); lebar 360/768/1280 hanya lewat emulasi CDP.
- Alur penuh hanya dengan keyboard (selain Tab/Esc di modal dan skip link A) dan pembaca layar.
- Kontras untuk elemen non-teks (cincin fokus, batas input) dan semua keadaan hover/focus selain baris tabel B.
- Screenshot visual di 1280 px tepat tidak diambil; 1280 dicek lewat angka overflow, tampilan desktop dilihat di viewport bawaan 1456 px.
- Butir B yang bergantung pada dokumen UX tambahan B sengaja tidak dinilai.

## Lampiran: checklist

Status: Pass, Fail, Partial, atau Not Tested (untuk F: Lengkap, Sebagian, Tidak ada). Partial dan Sebagian dihitung 0,5.

### P. Product Acceptance Criteria (PRD bagian 12), dasar "keberhasilan pengujian"
P1. Upload file valid ke versi mana pun selalu menampilkan ringkasan sebelum isi berubah.
P2. Membatalkan ringkasan tidak mengubah apa pun.
P3. Mengganti versi Published hanya bisa setelah nomor versi diketik dengan benar.
P4. File bukan .html/.htm, kosong, atau lebih dari 500 KB ditolak dengan pesan alasan.
P5. Halaman ubah prompt menampilkan semua Continuous Audit yang memakai ID prompt itu, dan prompt duplikat ditandai tidak dipakai audit.
P6. Pesan setelah menyimpan prompt menyebut audit yang akan memakai isi baru.
P7. Setiap simpan prompt dan ganti file muncul sebagai revisi baru di riwayat.
P8. Perbandingan revisi menandai baris yang ditambah dan dihapus.
P9. Kembalikan revisi mengganti isi saat ini dan menambah revisi baru tanpa menghapus revisi lama.
P10. Data tetap ada setelah halaman dimuat ulang.
P11. Bisa dipakai di desktop dan ponsel (360 px) dan bisa dibuka lewat GitHub Pages, termasuk memuat ulang di halaman dalam.

### F. Kelengkapan fitur (PRD bagian 5)
F1 Daftar versi dashboard. F2 Ringkasan sebelum Upload. F3 Konfirmasi tegas Published. F4 Ubah Saved Prompt + pemakaian audit. F5 Riwayat + bandingkan + kembalikan. F6 Data contoh, persistensi, atur ulang data contoh.
Status per FR: Lengkap / Sebagian / Tidak ada.

### U. Kesesuaian UX
U1 Ringkasan Upload menampilkan file lama dan file baru berdampingan dengan nama dan ukuran.
U2 Peringatan versi Published jelas berbeda dari ringkasan biasa dan menyebut bahwa client melihat versi itu.
U3 Setiap aksi yang mengubah data diakhiri pesan (toast atau notice).
U4 Empty state informatif (misalnya prompt duplikat tanpa audit).
U5 Navigasi jelas: menu, penunjuk lokasi atau breadcrumb, cara kembali.
U6 Modal bisa ditutup dengan Esc, dan Tab tidak keluar ke halaman di belakang modal.
U7 Pesan error validasi menyebut alasan, dan isi yang sudah diketik tidak hilang.
U8 Tidak ada tombol atau tautan yang tidak berfungsi.

### D. Konsistensi desain
D1 Status versi memakai teks dan ikon atau bentuk, tidak hanya warna.
D2 Warna, tipografi, dan jarak konsisten antar halaman.
D3 Gaya tombol berbahaya (merah) hanya untuk aksi berisiko.
D4 Lebar 360 px: tidak ada scroll horizontal di halaman utama dan modal.
D5 Lebar 768 px dan 1280 px: tata letak rapi, tidak ada elemen terpotong atau bertumpuk.
D6 Teks terbaca (kontras cukup, ukuran wajar).
