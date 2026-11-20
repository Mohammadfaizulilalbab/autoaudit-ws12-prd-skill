# TEST-REPORT.md

Laporan uji terhadap ACCEPTANCE-CRITERIA.md v1.0. Keadaan awal setiap uji adalah data contoh INTERACTION-SPEC 11.3.

## Ringkasan

| Status | Jumlah |
|---|---|
| Pass | 42 |
| Fail | 0 |
| Blocked | 2 (AC-039, AC-040: butuh deploy GitHub Pages oleh peneliti) |
| Not Tested | 0 |

Hasil akhir perintah (2026-11-21):
- `npm test`: 2 file, 65 test lulus.
- `npm run build`: berhasil (`tsc --noEmit` tanpa error, `vite build` selesai).

## Sumber bukti

- **L** = `src/tests/logic.test.ts` (unit test logika: validasi, pencocokan versi, aksi data, diff, storage).
- **F** = `src/tests/flows.test.tsx` (test alur UI dengan Testing Library dan user-event di jsdom).
- **B** = pemeriksaan manual di browser (panel browser Claude Code) terhadap `npm run dev` / `npm run preview` di port 5182.
- **S** = sapuan otomatis di browser pada `npm run preview` untuk lebar 360, 768, dan 1280 px: 8 rute (CRM Pages, detail CRM Page, Saved Prompt, ubah P-101, ubah P-102, riwayat P-101, riwayat v4, ID tidak ada) + MODAL-01, MODAL-02, diff, MODAL-03, MODAL-04 = 13 pemeriksaan per lebar. Diukur: `scrollWidth` halaman tidak melebihi lebar layar, modal tidak meluap, tidak ada tombol di luar layar, sidebar berupa drawer (position fixed) tepat di bawah 1024px. Hasil: 39 pemeriksaan, 0 masalah.
- **C** = inspeksi kode dengan grep.

## Hasil per kriteria

| Criteria ID | Prioritas | Test Status | Test Evidence | Bug Reference | Notes |
|---|---|---|---|---|---|
| AC-001 | Must | Pass | F "AC-001: kartu v5, v4, v3 berurutan..."; B screenshot detail Dashboard Kinerja Sales 1024px | - | Badge memuat ikon (radio/pencil/archive) dan teks. |
| AC-002 | Must | Pass | F "AC-002/003: ringkasan tampil sebelum isi berubah..." (judul "Ganti file v5?", tabel, keterangan riwayat, kartu masih file lama) | - | |
| AC-003 | Must | Pass | F "AC-002/003" (Batal dan Esc, jumlah revisi tetap 1); B Esc pada MODAL-02 v4, revisi tetap; S (Esc pada semua modal, jumlah revisi tetap 11) | - | |
| AC-004 | Must | Pass | F "AC-004: konfirmasi mengganti file..."; B upload v5 lalu reload | - | Toast persis "File v5 diganti dengan ... File lama tersimpan di riwayat." |
| AC-005 | Must | Pass | F "AC-005: file tidak valid ditolak..."; L "menerima .html dan .htm..." | - | |
| AC-006 | Must | Pass | F "AC-006 (0 byte)" dan "AC-006 (spasi)"; L "menolak file kosong atau hanya spasi" | - | |
| AC-007 | Must | Pass | F "AC-007" (600 KB -> "Ukuran file 600,0 KB melebihi batas 500 KB."); L batas 512.000 / 512.001 byte | - | Pembulatan KB dicatat di DECISIONS D-2. |
| AC-008 | Should | Pass | F "AC-008: file dengan isi sama..." | - | |
| AC-009 | Must | Pass | F "AC-009/010/011"; B screenshot MODAL-02 v4 (peringatan menyebut v4 dan PT Sinar Retail, tombol Danger nonaktif) | - | |
| AC-010 | Must | Pass | L "pencocokan nomor versi" (8 kasus); F "AC-009/010/011" ("", "v5", "4", "v44" nonaktif dan Enter tidak menjalankan; "v4", "V4", " v4 " aktif) | - | |
| AC-011 | Must | Pass | F "AC-009/010/011" (status tetap Published, revisi 2 -> 3, toast); B ketik " V4 " + Enter di 1024px | - | |
| AC-012 | Must | Pass | F "AC-012: pengembalian versi Published memakai MODAL-02..."; B riwayat v4 -> revisi #1 -> MODAL-02 dengan file revisi #1 di kolom kanan -> ketik v4 -> revisi #4 "Dikembalikan dari revisi #1" | - | |
| AC-013 | Must | Pass | F "AC-013: daftar prompt dengan kolom Dipakai oleh"; B screenshot 360px (kartu) | - | |
| AC-014 | Must | Pass | F "AC-014: panel pemakaian audit P-101"; B screenshot 1280px dan 360px | - | Panel di samping form (desktop), di atas form (ponsel). |
| AC-015 | Must | Pass | F "AC-015: prompt duplikat menampilkan empty state" | - | |
| AC-016 | Must | Pass | F "AC-016: simpan prompt yang dipakai audit..."; B simpan P-101 hanya dengan keyboard (Tab + Space) di 1280px, toast dan revisi #3 | - | |
| AC-017 | Must | Pass | F "AC-017: simpan prompt yang tidak dipakai audit" | - | |
| AC-018 | Must | Pass | F "AC-018: nama atau isi kosong ditolak..."; L "validasi form prompt" | - | Fokus pindah ke field pertama yang salah, pesan terhubung lewat aria-describedby. |
| AC-019 | Should | Pass | F "AC-019: tanpa perubahan menampilkan toast info..." | - | |
| AC-020 | Should | Pass | F "AC-020: audit nonaktif disebut dengan (nonaktif)"; L "menandai audit nonaktif" | - | |
| AC-021 | Must | Pass | F "AC-021/022: daftar revisi terbaru di atas..." | - | |
| AC-022 | Must | Pass | F "AC-021/022" (isi revisi #1 di `<pre class="code-block">` font mono) | - | |
| AC-023 | Must | Pass | F "AC-023/024/026" ("1 baris ditambah, 0 baris dihapus", baris +); L "menandai baris ditambah dan dihapus"; B screenshot diff v4 (+/- dan warna) | - | |
| AC-024 | Must | Pass | F "AC-023/024/026" (revisi #3 "Dikembalikan dari revisi #1", #1 dan #2 tetap, toast persis) | - | |
| AC-025 | Must | Pass | F "AC-025: mengembalikan versi Draft lewat MODAL-03" | - | |
| AC-026 | Should | Pass | F "AC-023/024/026" (tombol "Kembalikan revisi #2" nonaktif dan teks "Ini isi saat ini") | - | |
| AC-027 | Must | Pass | F "AC-027: isi file berisi script dan tag tampil sebagai teks" (tidak ada elemen script/b, alert tidak dipanggil); B screenshot diff v4 menampilkan `<script>alert(1)</script>` sebagai teks; C grep `dangerouslySetInnerHTML\|innerHTML\|<iframe` di src: 0 hasil | - | |
| AC-028 | Must | Pass | F "AC-028: memuat dan menyimpan data contoh..."; L "data contoh" | - | |
| AC-029 | Must | Pass | B: ganti file v5, simpan P-101, pilih CV Maju Motor, reload -> hash `#/crm-pages`, client c2, daftar Dashboard Booking Servis, v5 = dashboard-sales-v5-reload.html, revisi v5 = 2, revisi P-101 = 3. Reload di `#/riwayat/versi/ver-sales-5` membuka halaman yang sama. | - | |
| AC-030 | Must | Pass | F "AC-030: atur ulang data contoh, Batal tidak mengubah apa pun"; B atur ulang dari drawer 360px | - | |
| AC-031 | Should | Pass | F "AC-031: tulis localStorage gagal saat Upload..." dan "AC-031: ... saat simpan prompt..." | - | |
| AC-032 | Must | Pass | F "AC-032" (dua test: rute tidak dikenal, ID tidak ada + "Kembali ke daftar"); F "AC-042" (pemilih client); F "AC-025" (breadcrumb ke detail CRM Page) | - | |
| AC-033 | Must | Pass | F: toast Upload (AC-004/011), simpan prompt (AC-016/017/019), kembalikan (AC-024/012), atur ulang (AC-030), gagal simpan (AC-031), file ditolak (AC-005..007) | - | |
| AC-034 | Must | Pass | S: 39 pemeriksaan di 360/768/1280px tanpa masalah; B screenshot drawer, MODAL-02, MODAL-04 di 360px | - | Dua kolom PAGE-04/05 mulai 768px (DECISIONS D-16). |
| AC-035 | Must | Pass | F "AC-035: fokus terkunci di modal dan kembali ke tombol pemicu setelah Esc"; B Enter pada "Kembalikan revisi #1", ketik v4, Enter; B Tab + Space pada Simpan Perubahan; B Esc mengembalikan fokus ke "Kembalikan revisi #1" | - | Dialog pemilih file adalah dialog native browser dan tidak diuji dengan automasi. |
| AC-036 | Should | Pass | C: grep hex/rgba di `src` di luar `src/styles/tokens.css`: 0 hasil | - | Token tambahan diff dan overlay dicatat di DECISIONS K-3. |
| AC-037 | Must | Pass | F "AC-001" (ikon di setiap badge); F "AC-023/024/026" (prefix +); B screenshot diff | - | |
| AC-038 | Should | Pass | C: `variant="danger"` hanya di ResetDataModal ("Atur ulang"), PublishedConfirmModal ("Ganti versi tayang"), dan tombol kembalikan bila versi Published (RevisionDetail); F memeriksa kelas `btn-danger` pada ketiganya | - | Tombol layar data rusak memakai Primary (DECISIONS D-8). |
| AC-039 | Should | Blocked | L "file 500 KB selesai kurang dari 1 detik..." (lulus); B build disajikan dari server statis lokal: DOMContentLoaded 38 ms | - | Waktu muat dari GitHub Pages belum bisa diukur karena deploy dilakukan peneliti. |
| AC-040 | Must | Blocked | Simulasi B: `dist` disajikan di `http://localhost:5182/autoaudit-ws12-prd-skill/`, buka `#/prompts/P-101`, reload -> "Ubah Saved Prompt" tampil, aset JS dan CSS 200 dari subpath | - | Perlu diverifikasi ulang di URL GitHub Pages sesudah peneliti push dan mengaktifkan Pages. `base: './'` + HashRouter sudah dipasang. |
| AC-041 | Must | Pass | C: grep `api[_-]?key\|token\|password\|secret` di src (selain test): tidak ada kredensial | - | |
| AC-042 | Should | Pass | F "AC-042: mengganti client di halaman detail..." | - | |
| AC-043 | Should | Pass | L "pengembalian bertingkat membuat revisi baru tanpa menghapus revisi lama" (#3 dari #1, lalu #4 dari #2) | - | |
| AC-044 | Should | Pass | L "nomor revisi dihitung per objek"; F "AC-044: nomor revisi per objek tidak saling memengaruhi" | - | |

## Bug yang ditemukan dan sudah diperbaiki selama pengujian

| No | Temuan | Perbaikan |
|---|---|---|
| BUG-1 | Tombol menu dan tutup drawer tampil di desktop (aturan `.btn` menimpa `display:none`). | Selector lebih spesifik (iterasi 3). |
| BUG-2 | Fokus kembali ke input file tersembunyi setelah modal Upload ditutup (ditemukan test AC-035). | Tujuan fokus eksplisit `returnFocusTo` (iterasi 4). |
| BUG-3 | Di 360px, fokus awal MODAL-02 menggulung kotak peringatan keluar layar dan "(Published)" terpotong per huruf. | `focus({ preventScroll: true })` dan kolom label tabel ringkasan lebih sempit di ponsel (iterasi 5). |
