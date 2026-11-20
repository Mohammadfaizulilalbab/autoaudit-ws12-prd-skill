import type { AppData, DashboardVersion, Revision, SavedPrompt } from '../types';
import { byteLength } from '../utils/format';

const SEED_AUTHOR = 'Data contoh';
const DIMAS = 'Dimas (System Implementor)';

const P101_V1 = [
  'Kamu adalah auditor percakapan WhatsApp tim sales PT Sinar Retail.',
  'Aturan audit:',
  '1. Sales wajib membalas chat pelanggan paling lambat 5 menit pada jam kerja.',
  '2. Sales wajib menyapa pelanggan dengan nama dan salam pembuka.',
  '3. Sales wajib menawarkan minimal satu produk yang relevan.',
  '4. Sales tidak boleh menjanjikan diskon di luar promo resmi.',
  'Tulis hasil audit per sales dalam format JSON.',
].join('\n');

const P101_V2 = [
  'Kamu adalah auditor percakapan WhatsApp tim sales PT Sinar Retail.',
  'Aturan audit:',
  '1. Sales wajib membalas chat pelanggan paling lambat 5 menit pada jam kerja.',
  '2. Sales wajib menyapa pelanggan dengan nama dan salam pembuka.',
  '3. Sales wajib menawarkan minimal satu produk yang relevan.',
  '4. Sales tidak boleh menjanjikan diskon di luar promo resmi.',
  '5. Sales wajib menutup percakapan dengan ajakan kunjungan ke toko.',
  'Tulis hasil audit per sales dalam format JSON.',
].join('\n');

const P102 = P101_V1;

const P103 = [
  'Kamu adalah auditor follow up leads PT Sinar Retail.',
  'Aturan audit:',
  '1. Leads baru wajib dihubungi paling lambat 1 hari kerja.',
  '2. Follow up kedua wajib dilakukan dalam 3 hari jika belum ada balasan.',
  '3. Sales wajib mencatat alasan leads tidak jadi membeli.',
  '4. Leads yang meminta berhenti dihubungi tidak boleh dihubungi lagi.',
  'Tulis daftar leads yang terlambat di-follow up.',
].join('\n');

const P201 = [
  'Kamu adalah auditor layanan bengkel CV Maju Motor.',
  'Aturan audit:',
  '1. Admin wajib mengonfirmasi jadwal booking servis dalam 15 menit.',
  '2. Admin wajib menyebut estimasi biaya sebelum servis dimulai.',
  '3. Admin wajib mengirim pengingat H-1 sebelum jadwal servis.',
  '4. Keluhan pelanggan wajib diteruskan ke kepala bengkel di hari yang sama.',
  '5. Admin tidak boleh menjanjikan waktu selesai tanpa cek mekanik.',
  'Tulis ringkasan pelanggaran per admin.',
].join('\n');

function dashboardHtml(title: string, version: string, sections: string[]): string {
  return [
    '<!doctype html>',
    '<html lang="id">',
    '<head>',
    '  <meta charset="utf-8">',
    `  <title>${title} ${version}</title>`,
    '  <style>body { font-family: sans-serif; } table { width: 100%; }</style>',
    '</head>',
    '<body>',
    `  <h1>${title}</h1>`,
    `  <p>Versi ${version}</p>`,
    ...sections,
    '  <script>window.renderDashboard && window.renderDashboard(window.__CRM_PAGE_DATA__);</script>',
    '</body>',
    '</html>',
  ].join('\n');
}

const SALES_V3 = dashboardHtml('Dashboard Kinerja Sales', 'v3', [
  '  <section id="ringkasan">',
  '    <h2>Ringkasan harian</h2>',
  '    <div class="kpi">Total chat</div>',
  '  </section>',
]);

const SALES_V4_R1 = dashboardHtml('Dashboard Kinerja Sales', 'v4', [
  '  <section id="ringkasan">',
  '    <h2>Ringkasan harian</h2>',
  '    <div class="kpi">Total chat</div>',
  '    <div class="kpi">Rata-rata waktu respons</div>',
  '  </section>',
  '  <section id="tabel-sales">',
  '    <h2>Tabel per sales</h2>',
  '    <table><thead><tr><th>Sales</th><th>Skor</th></tr></thead></table>',
  '  </section>',
]);

const SALES_V4_R2 = dashboardHtml('Dashboard Kinerja Sales', 'v4', [
  '  <section id="ringkasan">',
  '    <h2>Ringkasan harian</h2>',
  '    <div class="kpi">Total chat</div>',
  '    <div class="kpi">Rata-rata waktu respons</div>',
  '    <div class="kpi">Persentase sapaan sesuai aturan</div>',
  '  </section>',
  '  <section id="tabel-sales">',
  '    <h2>Tabel per sales</h2>',
  '    <table><thead><tr><th>Sales</th><th>Skor</th><th>Pelanggaran</th></tr></thead></table>',
  '  </section>',
]);

const SALES_V5 = dashboardHtml('Dashboard Kinerja Sales', 'v5', [
  '  <section id="ringkasan">',
  '    <h2>Ringkasan harian</h2>',
  '    <div class="kpi">Total chat</div>',
  '    <div class="kpi">Rata-rata waktu respons</div>',
  '    <div class="kpi">Persentase sapaan sesuai aturan</div>',
  '  </section>',
  '  <section id="tren">',
  '    <h2>Tren mingguan</h2>',
  '    <canvas id="grafik-tren"></canvas>',
  '  </section>',
  '  <section id="tabel-sales">',
  '    <h2>Tabel per sales</h2>',
  '    <table><thead><tr><th>Sales</th><th>Skor</th><th>Pelanggaran</th></tr></thead></table>',
  '  </section>',
]);

const BOOKING_V1 = dashboardHtml('Dashboard Booking Servis', 'v1', [
  '  <section id="booking">',
  '    <h2>Booking hari ini</h2>',
  '    <div class="kpi">Jumlah booking</div>',
  '    <div class="kpi">Booking terkonfirmasi</div>',
  '  </section>',
]);

const BOOKING_V2 = dashboardHtml('Dashboard Booking Servis', 'v2', [
  '  <section id="booking">',
  '    <h2>Booking hari ini</h2>',
  '    <div class="kpi">Jumlah booking</div>',
  '    <div class="kpi">Booking terkonfirmasi</div>',
  '    <div class="kpi">Pengingat H-1 terkirim</div>',
  '  </section>',
  '  <section id="keluhan">',
  '    <h2>Keluhan pelanggan</h2>',
  '    <ul id="daftar-keluhan"></ul>',
  '  </section>',
]);

function prompt(id: string, clientId: string, name: string, content: string, updatedAt: string, updatedBy: string): SavedPrompt {
  return { id, clientId, name, content, updatedAt, updatedBy };
}

function version(
  id: string,
  pageId: string,
  number: number,
  status: DashboardVersion['status'],
  fileName: string,
  fileContent: string,
  updatedAt: string,
  updatedBy: string,
): DashboardVersion {
  return { id, pageId, number, status, fileName, fileSize: byteLength(fileContent), fileContent, updatedAt, updatedBy };
}

function promptRevision(id: string, targetId: string, number: number, action: string, createdAt: string, createdBy: string, name: string, content: string): Revision {
  return { id, targetType: 'prompt', targetId, number, action, createdAt, createdBy, snapshot: { name, content } };
}

function versionRevision(id: string, v: DashboardVersion, number: number, action: string, createdAt: string, createdBy: string, fileName: string, fileContent: string): Revision {
  return {
    id,
    targetType: 'version',
    targetId: v.id,
    number,
    action,
    createdAt,
    createdBy,
    snapshot: { fileName, fileSize: byteLength(fileContent), fileContent },
  };
}

export function createSeedData(): AppData {
  const prompts = [
    prompt('P-101', 'c1', 'Audit Respons Sales', P101_V2, '2026-11-18T09:20:00.000Z', DIMAS),
    prompt('P-102', 'c1', 'Audit Respons Sales - v2', P102, '2026-11-10T03:00:00.000Z', SEED_AUTHOR),
    prompt('P-103', 'c1', 'Audit Follow Up Leads', P103, '2026-11-11T02:30:00.000Z', SEED_AUTHOR),
    prompt('P-201', 'c2', 'Audit Layanan Bengkel', P201, '2026-11-12T01:15:00.000Z', SEED_AUTHOR),
  ];

  const versions = [
    version('ver-sales-3', 'page-sales', 3, 'Archived', 'dashboard-sales-v3.html', SALES_V3, '2026-10-20T04:00:00.000Z', SEED_AUTHOR),
    version('ver-sales-4', 'page-sales', 4, 'Published', 'dashboard-sales-v4.html', SALES_V4_R2, '2026-11-17T07:45:00.000Z', DIMAS),
    version('ver-sales-5', 'page-sales', 5, 'Draft', 'dashboard-sales-v5.html', SALES_V5, '2026-11-19T06:10:00.000Z', SEED_AUTHOR),
    version('ver-booking-1', 'page-booking', 1, 'Published', 'dashboard-booking-v1.html', BOOKING_V1, '2026-11-05T02:00:00.000Z', SEED_AUTHOR),
    version('ver-booking-2', 'page-booking', 2, 'Draft', 'dashboard-booking-v2.html', BOOKING_V2, '2026-11-14T08:30:00.000Z', SEED_AUTHOR),
  ];
  const [v3, v4, v5, b1, b2] = versions;

  const revisions: Revision[] = [
    promptRevision('rev-p101-1', 'P-101', 1, 'Dibuat', '2026-11-10T03:00:00.000Z', SEED_AUTHOR, 'Audit Respons Sales', P101_V1),
    promptRevision('rev-p101-2', 'P-101', 2, 'Disimpan', '2026-11-18T09:20:00.000Z', DIMAS, 'Audit Respons Sales', P101_V2),
    promptRevision('rev-p102-1', 'P-102', 1, 'Dibuat', '2026-11-10T03:00:00.000Z', SEED_AUTHOR, 'Audit Respons Sales - v2', P102),
    promptRevision('rev-p103-1', 'P-103', 1, 'Dibuat', '2026-11-11T02:30:00.000Z', SEED_AUTHOR, 'Audit Follow Up Leads', P103),
    promptRevision('rev-p201-1', 'P-201', 1, 'Dibuat', '2026-11-12T01:15:00.000Z', SEED_AUTHOR, 'Audit Layanan Bengkel', P201),
    versionRevision('rev-v3-1', v3, 1, 'Dibuat', '2026-10-20T04:00:00.000Z', SEED_AUTHOR, v3.fileName, SALES_V3),
    versionRevision('rev-v4-1', v4, 1, 'Dibuat', '2026-11-03T05:00:00.000Z', SEED_AUTHOR, v4.fileName, SALES_V4_R1),
    versionRevision('rev-v4-2', v4, 2, 'Diunggah', '2026-11-17T07:45:00.000Z', DIMAS, v4.fileName, SALES_V4_R2),
    versionRevision('rev-v5-1', v5, 1, 'Dibuat', '2026-11-19T06:10:00.000Z', SEED_AUTHOR, v5.fileName, SALES_V5),
    versionRevision('rev-b1-1', b1, 1, 'Dibuat', '2026-11-05T02:00:00.000Z', SEED_AUTHOR, b1.fileName, BOOKING_V1),
    versionRevision('rev-b2-1', b2, 1, 'Dibuat', '2026-11-14T08:30:00.000Z', SEED_AUTHOR, b2.fileName, BOOKING_V2),
  ];

  return {
    schemaVersion: 1,
    selectedClientId: 'c1',
    clients: [
      { id: 'c1', name: 'PT Sinar Retail' },
      { id: 'c2', name: 'CV Maju Motor' },
    ],
    prompts,
    audits: [
      { id: 'ca-1', clientId: 'c1', name: 'Audit Harian Sales', schedule: 'setiap hari 06.00', status: 'Aktif', promptId: 'P-101' },
      { id: 'ca-2', clientId: 'c1', name: 'Audit Mingguan SPV', schedule: 'Senin 07.00', status: 'Aktif', promptId: 'P-101' },
      { id: 'ca-3', clientId: 'c1', name: 'Audit Follow Up Mingguan', schedule: 'Jumat 08.00', status: 'Nonaktif', promptId: 'P-103' },
      { id: 'ca-4', clientId: 'c2', name: 'Audit Harian Bengkel', schedule: 'setiap hari 06.30', status: 'Aktif', promptId: 'P-201' },
    ],
    pages: [
      { id: 'page-sales', clientId: 'c1', name: 'Dashboard Kinerja Sales' },
      { id: 'page-booking', clientId: 'c2', name: 'Dashboard Booking Servis' },
    ],
    versions,
    revisions,
  };
}
