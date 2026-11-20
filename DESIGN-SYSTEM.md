# Design System

Project: Pengaman Perubahan Prompt dan Dashboard AutoAudit
Version: 1.0
Status: Siap dipakai eksperimen
Reference: PRD.md v1.0, UX-SPEC.md v1.0

## 1. Design direction

### 1.1 Design concept

Alat kerja admin yang tenang dan padat informasi. Tampilan netral supaya warna hanya dipakai untuk status dan peringatan, sehingga peringatan versi Published langsung menonjol.

### 1.2 Design principles

1. Clarity: setiap angka, status, dan nama file terbaca tanpa hover.
2. Consistency: komponen yang sama dipakai untuk hal yang sama di semua halaman.
3. Signal over decoration: warna kuat hanya untuk status dan aksi berbahaya.
4. Accessibility: kontras WCAG AA, status selalu disertai teks atau ikon.

## 2. Color system

### 2.1 Primary colors

| Token | Hex | Usage |
|---|---|---|
| primary | #4F46E5 | Tombol utama, tautan, menu aktif |
| primary-hover | #4338CA | Hover dan pressed tombol utama |
| primary-light | #EEF2FF | Latar menu aktif, latar baris terpilih |
| primary-dark | #3730A3 | Teks di atas primary-light |

### 2.2 Neutral colors

| Token | Hex | Usage |
|---|---|---|
| background | #F8FAFC | Latar halaman |
| surface | #FFFFFF | Kartu, modal, tabel, sidebar |
| surface-secondary | #F1F5F9 | Latar blok kode, header tabel |
| border | #E2E8F0 | Garis kartu, input, pemisah |
| text-primary | #0F172A | Judul dan teks utama |
| text-secondary | #475569 | Label, metadata |
| text-muted | #64748B | Placeholder, keterangan kecil |

### 2.3 Semantic colors

| Token | Hex | Usage |
|---|---|---|
| success | #15803D | Teks dan ikon berhasil |
| success-light | #DCFCE7 | Latar toast berhasil, baris ditambah |
| warning | #B45309 | Teks dan ikon peringatan ringan |
| warning-light | #FEF3C7 | Latar peringatan ringan |
| danger | #DC2626 | Tombol berbahaya, ikon peringatan versi Published |
| danger-hover | #B91C1C | Hover tombol berbahaya |
| danger-light | #FEE2E2 | Latar kotak peringatan, baris dihapus |
| info | #0369A1 | Keterangan informasi |
| info-light | #E0F2FE | Latar panel informasi |

### 2.4 Version status colors

| Status | Text | Background | Ikon |
|---|---|---|---|
| Published | #15803D | #DCFCE7 | radio |
| Draft | #475569 | #F1F5F9 | pencil |
| Archived | #B45309 | #FEF3C7 | archive |

Warna status tidak boleh menjadi satu-satunya penanda. Badge selalu memuat ikon dan teks status.

### 2.5 Diff colors

| Jenis baris | Text | Background | Prefix |
|---|---|---|---|
| Ditambah | #14532D | #DCFCE7 | `+` |
| Dihapus | #7F1D1D | #FEE2E2 | `-` |
| Sama | #475569 | transparan | spasi |

## 3. Typography system

### 3.1 Font family

- UI: Inter, fallback system-ui, -apple-system, "Segoe UI", sans-serif.
- Kode dan isi file: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace.

### 3.2 Typography scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| h1 | 24px | 700 | Judul halaman |
| h2 | 20px | 600 | Judul bagian, judul modal |
| h3 | 16px | 600 | Judul kartu, judul panel |
| body | 14px | 400 | Teks umum |
| body-strong | 14px | 600 | Nilai penting di ringkasan |
| small | 13px | 400 | Metadata, keterangan field |
| caption | 12px | 500 | Badge, label tabel |
| mono | 13px | 400 | Isi prompt, isi file, diff |

Line height: heading 1.3, body 1.5, mono 1.6.

## 4. Spacing system

Gunakan kelipatan 4px.

| Token | Value | Usage |
|---|---|---|
| space-1 | 4px | Jarak ikon dan teks |
| space-2 | 8px | Jarak dalam badge, antar tombol kecil |
| space-3 | 12px | Jarak antar field kecil |
| space-4 | 16px | Padding kartu kecil, jarak antar kartu di mobile |
| space-5 | 20px | Padding kartu |
| space-6 | 24px | Padding modal, jarak antar bagian |
| space-8 | 32px | Padding halaman desktop |
| space-12 | 48px | Jarak bagian besar |

## 5. Layout system

### 5.1 Main layout

- Sidebar kiri lebar 240px pada desktop, latar surface, garis kanan border.
- Area konten dengan padding 32px (desktop), 24px (tablet), 16px (mobile), lebar maksimum 1200px.
- Header halaman berisi breadcrumb (small, text-secondary), judul h1, dan nama pengguna di kanan.
- PAGE-04 dan PAGE-05: grid dua kolom 2fr dan 1fr (PAGE-04) atau 1fr dan 2fr (PAGE-05) pada desktop.

### 5.2 Responsive breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Satu kolom, sidebar jadi drawer |
| Tablet | 640 sampai 1023px | Sidebar drawer, grid dua kolom bila muat |
| Desktop | ≥ 1024px | Sidebar tetap, grid dua kolom |
| Wide desktop | ≥ 1440px | Sama dengan desktop, konten tetap maks 1200px |

## 6. Component design specifications

### 6.1 Buttons

| Variant | Tampilan | Dipakai untuk |
|---|---|---|
| Primary | Latar primary, teks putih | Simpan Perubahan, Ganti file |
| Secondary | Latar surface, border, teks text-primary | Batal, Riwayat, Upload |
| Danger | Latar danger, teks putih | Ganti versi tayang, Kembalikan pada versi Published, Atur ulang |
| Ghost | Tanpa latar, teks primary | Tautan aksi kecil |

Ukuran: tinggi 36px (sm) dan 40px (md), padding horizontal 16px, radius 8px, font 14px/600, transisi 150ms. Tombol nonaktif memakai opacity 0.5 dan cursor not-allowed. Fokus keyboard memakai outline 2px primary dengan offset 2px.

### 6.2 Input fields

- Tinggi 40px untuk input, textarea minimal 240px untuk isi prompt, border 1px border, radius 8px, padding 8px 12px.
- Fokus: border primary dan ring 3px primary-light.
- Error: border danger, pesan error 13px warna danger di bawah field, dengan ikon alert-circle.
- Textarea isi prompt memakai font mono.

### 6.3 Cards

- Latar surface, border 1px, radius 12px, padding 20px.
- Kartu versi: baris atas berisi nomor versi (h3) dan badge status; baris tengah nama file dan ukuran; baris bawah metadata (small) dan tombol Upload serta Riwayat.

### 6.4 Status badge

Radius 999px, padding 4px 10px, font caption, ikon 14px di kiri teks, warna sesuai bagian 2.4.

### 6.5 Navigation

- Item menu tinggi 40px, radius 8px, ikon 20px dan teks body.
- Item aktif: latar primary-light, teks primary-dark.
- Pemilih client berupa select native di bagian atas sidebar dengan label "Client".

### 6.6 Modal

- Lebar maksimum 520px, padding 24px, radius 12px, overlay hitam 50%.
- Struktur: judul h2, isi, baris tombol di kanan bawah (Batal di kiri tombol utama).
- Modal ringkasan memakai tabel dua kolom "File sekarang" dan "File baru".
- MODAL-02 menambah kotak peringatan latar danger-light, border danger, ikon alert-triangle, lalu input "Ketik v4 untuk melanjutkan".

### 6.7 Toast notification

- Posisi kanan atas pada desktop, atas tengah pada mobile.
- Varian success, error, info dengan ikon dan warna semantik.
- Tampil 5 detik untuk success dan info. Toast error tetap tampil sampai ditutup.

### 6.8 Table

- Header berlatar surface-secondary dengan teks caption berbobot 600, tanpa huruf kapital semua.
- Baris tinggi minimal 48px, garis bawah border, seluruh baris bisa diklik untuk membuka detail.
- Pada mobile, tabel berubah menjadi daftar kartu.

### 6.9 Diff view

- Blok mono dengan latar surface, border, radius 8px, scroll horizontal di dalam blok bila baris panjang (halaman tetap tanpa scroll horizontal).
- Setiap baris diberi prefix dan warna sesuai bagian 2.5. Ringkasan di atas blok: "N baris ditambah, M baris dihapus".

### 6.10 Usage panel

- Kartu dengan judul "Dipakai oleh Continuous Audit" dan jumlah audit di kanan judul.
- Setiap audit tampil sebagai baris: nama (body-strong), jadwal (small), badge status Aktif (success) atau Nonaktif (Draft style).
- Keterangan info di bawah daftar memakai latar info-light.

## 7. Revision list component

- Daftar vertikal, setiap item berisi "Revisi #n", waktu (format 20 Nov 2026, 14.05), pengubah, dan jenis aksi.
- Item terpilih memakai latar primary-light dan border kiri 3px primary.
- Revisi terbaru diberi badge kecil "Isi saat ini".

## 8. Iconography

Gunakan Lucide Icons (paket lucide-react). Ukuran 20px standar, 16px di dalam tombol kecil, 14px di badge.

| Aksi atau objek | Ikon |
|---|---|
| CRM Pages | layout-dashboard |
| Saved Prompt | message-square-text |
| Upload | upload |
| Riwayat | history |
| Kembalikan | rotate-ccw |
| Peringatan versi Published | alert-triangle |
| File dashboard | file-code |
| Berhasil | check-circle-2 |
| Error | alert-circle |
| Tutup | x |
| Menu mobile | menu |
| Atur ulang data | refresh-ccw |

## 9. Design tokens

```json
{
  "color": {
    "primary": "#4F46E5",
    "primaryHover": "#4338CA",
    "primaryLight": "#EEF2FF",
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "border": "#E2E8F0",
    "textPrimary": "#0F172A",
    "textSecondary": "#475569",
    "success": "#15803D",
    "warning": "#B45309",
    "danger": "#DC2626",
    "info": "#0369A1"
  },
  "radius": { "sm": "6px", "md": "8px", "lg": "12px", "full": "999px" },
  "spacing": { "xs": "4px", "sm": "8px", "md": "16px", "lg": "24px", "xl": "32px" }
}
```

Token ditulis sebagai CSS custom properties di satu file (misalnya `src/styles/tokens.css`) dan dipakai di seluruh komponen.

## 10. Accessibility guidelines

1. Kontras teks minimal 4.5:1 untuk teks normal.
2. Semua elemen interaktif bisa dijangkau dengan Tab dan punya fokus yang terlihat.
3. Modal memakai role="dialog", aria-modal="true", judul terhubung lewat aria-labelledby, fokus terkunci di dalam modal, Esc menutup modal, dan fokus kembali ke tombol pemicu.
4. Toast diumumkan lewat aria-live (polite untuk success, assertive untuk error).
5. Badge dan diff tidak hanya mengandalkan warna.
6. Input punya label yang terlihat, dan pesan error terhubung lewat aria-describedby.
7. Target sentuh minimal 40 x 40px.

## 11. Design consistency rules

1. Pakai token, jangan nilai warna atau jarak acak.
2. Jangan menambah warna baru tanpa persetujuan.
3. Gaya Danger hanya untuk aksi yang mengubah versi Published atau menghapus data contoh.
4. Satu halaman punya paling banyak satu tombol Primary pada satu waktu.
5. Teks tombol memakai kata kerja yang menyebut akibatnya ("Ganti file", "Ganti versi tayang", "Kembalikan revisi #3").
6. Semua layout mengikuti breakpoint bagian 5.2.

End of DESIGN-SYSTEM v1.0
