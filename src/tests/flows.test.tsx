import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from '../App';
import { createSeedData } from '../store/seed';
import { STORAGE_KEY } from '../store/storage';
import type { AppData } from '../types';

function LocationProbe() {
  return <span data-testid="location">{useLocation().pathname}</span>;
}

function renderApp(path: string, initial?: AppData) {
  if (initial) localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  const user = userEvent.setup({ applyAccept: false });
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
      <LocationProbe />
    </MemoryRouter>,
  );
  return user;
}

function stored(): AppData {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)!) as AppData;
}

function revisionCount(targetId: string): number {
  return stored().revisions.filter((r) => r.targetId === targetId).length;
}

function card(label: string) {
  return screen.getByRole('article', { name: `Versi ${label}` });
}

function htmlFile(content: string, name = 'dashboard-baru.html') {
  return new File([content], name, { type: 'text/html' });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('data contoh dan navigasi', () => {
  it('AC-028: memuat dan menyimpan data contoh saat localStorage kosong', async () => {
    renderApp('/crm-pages');
    expect(await screen.findByRole('link', { name: 'Dashboard Kinerja Sales' })).toBeInTheDocument();
    const data = stored();
    expect(data.schemaVersion).toBe(1);
    expect(data.clients).toHaveLength(2);
    expect(data.prompts).toHaveLength(4);
    expect(data.audits).toHaveLength(4);
    expect(data.pages).toHaveLength(2);
  });

  it('AC-032: rute tidak dikenal diarahkan ke CRM Pages, ID tidak ada menampilkan empty state', async () => {
    const user = renderApp('/tidak-ada');
    expect(screen.getByTestId('location')).toHaveTextContent('/crm-pages');
    await user.click(screen.getByRole('link', { name: 'Saved Prompt' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/prompts');
    expect(screen.getByRole('heading', { level: 1, name: 'Saved Prompt' })).toBeInTheDocument();
  });

  it('AC-032: ID yang tidak ada menampilkan "Data tidak ditemukan" dan tombol kembali', async () => {
    const user = renderApp('/prompts/P-999');
    expect(screen.getByText('Data tidak ditemukan. Mungkin data contoh sudah diatur ulang.')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Kembali ke daftar' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/prompts');
  });

  it('AC-042: mengganti client di halaman detail membuka daftar CRM Pages client baru', async () => {
    const user = renderApp('/crm-pages/page-sales');
    await user.selectOptions(screen.getByLabelText('Client'), 'c2');
    expect(screen.getByTestId('location')).toHaveTextContent('/crm-pages');
    expect(screen.getByRole('link', { name: 'Dashboard Booking Servis' })).toBeInTheDocument();
    expect(stored().selectedClientId).toBe('c2');
  });

  it('data rusak menampilkan pesan dan tombol atur ulang', async () => {
    localStorage.setItem(STORAGE_KEY, '{rusak');
    const user = renderApp('/crm-pages');
    expect(screen.getByText('Data tersimpan tidak bisa dibaca. Muat ulang data contoh untuk melanjutkan.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Atur ulang data contoh' }));
    expect(await screen.findByRole('link', { name: 'Dashboard Kinerja Sales' })).toBeInTheDocument();
    expect(screen.getByText('Data contoh sudah diatur ulang.')).toBeInTheDocument();
  });

  it('AC-030: atur ulang data contoh, Batal tidak mengubah apa pun', async () => {
    const changed = createSeedData();
    changed.prompts[0].name = 'Sudah diubah';
    const user = renderApp('/prompts', changed);
    await user.click(screen.getByRole('button', { name: 'Atur ulang data contoh' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Atur ulang data contoh?' })).getByRole('button', { name: 'Batal' }));
    expect(stored().prompts[0].name).toBe('Sudah diubah');

    await user.click(screen.getByRole('button', { name: 'Atur ulang data contoh' }));
    const dialog = screen.getByRole('dialog', { name: 'Atur ulang data contoh?' });
    expect(within(dialog).getByRole('button', { name: 'Atur ulang' })).toHaveClass('btn-danger');
    await user.click(within(dialog).getByRole('button', { name: 'Atur ulang' }));
    expect(stored()).toEqual(createSeedData());
    expect(screen.getByTestId('location')).toHaveTextContent('/crm-pages');
    expect(screen.getByText('Data contoh sudah diatur ulang.')).toBeInTheDocument();
  });
});

describe('Upload versi dashboard', () => {
  it('AC-001: kartu v5, v4, v3 berurutan dengan badge ikon+teks dan tombol', () => {
    renderApp('/crm-pages/page-sales');
    const cards = screen.getAllByRole('article');
    expect(cards.map((c) => within(c).getByRole('heading').textContent)).toEqual(['v5', 'v4', 'v3']);
    expect(within(cards[0]).getByText('Draft').querySelector('svg')).toBeInTheDocument();
    expect(within(cards[1]).getByText('Published').querySelector('svg')).toBeInTheDocument();
    expect(within(cards[2]).getByText('Archived').querySelector('svg')).toBeInTheDocument();
    expect(within(cards[1]).getByText('dashboard-sales-v4.html')).toBeInTheDocument();
    expect(within(cards[1]).getByText(/oleh Dimas \(System Implementor\)/)).toBeInTheDocument();
    expect(within(cards[1]).getByRole('button', { name: 'Upload file v4' })).toBeInTheDocument();
    expect(within(cards[1]).getByRole('link', { name: 'Riwayat v4' })).toBeInTheDocument();
  });

  it('AC-002/003: ringkasan tampil sebelum isi berubah, Batal dan Esc tidak mengubah apa pun', async () => {
    const user = renderApp('/crm-pages/page-sales');
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile('<p>baru</p>'));
    const dialog = await screen.findByRole('dialog', { name: 'Ganti file v5?' });
    expect(within(dialog).getAllByText('Dashboard Kinerja Sales', { selector: 'td' })).toHaveLength(2);
    expect(within(dialog).getAllByText('v5 (Draft)')).toHaveLength(2);
    expect(within(dialog).getByText('dashboard-sales-v5.html')).toBeInTheDocument();
    expect(within(dialog).getByText('dashboard-baru.html')).toBeInTheDocument();
    expect(within(dialog).getByText('File sekarang tetap tersimpan di riwayat dan bisa dikembalikan.')).toBeInTheDocument();
    expect(within(card('v5')).getByText('dashboard-sales-v5.html')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(revisionCount('ver-sales-5')).toBe(1);

    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile('<p>baru</p>'));
    await screen.findByRole('dialog', { name: 'Ganti file v5?' });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(card('v5')).getByText('dashboard-sales-v5.html')).toBeInTheDocument();
    expect(revisionCount('ver-sales-5')).toBe(1);
  });

  it('AC-004: konfirmasi mengganti file, mencatat pengubah, menambah satu revisi, dan toast', async () => {
    const user = renderApp('/crm-pages/page-sales');
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile('<p>baru</p>'));
    const dialog = await screen.findByRole('dialog', { name: 'Ganti file v5?' });
    await user.click(within(dialog).getByRole('button', { name: 'Ganti file' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(card('v5')).getByText('dashboard-baru.html')).toBeInTheDocument();
    expect(within(card('v5')).getByText(/oleh Raka Pradipta \(System Implementor\)/)).toBeInTheDocument();
    expect(screen.getByText('File v5 diganti dengan dashboard-baru.html. File lama tersimpan di riwayat.')).toBeInTheDocument();
    const revisions = stored().revisions.filter((r) => r.targetId === 'ver-sales-5');
    expect(revisions).toHaveLength(2);
    expect(revisions[1].action).toBe('Diunggah');
  });

  it.each([
    ['AC-005', htmlFile('<p>x</p>', 'dashboard.txt'), 'File harus berformat .html atau .htm.'],
    ['AC-006 (0 byte)', htmlFile(''), 'File kosong. Pilih file dashboard yang berisi.'],
    ['AC-006 (spasi)', htmlFile('   \n  '), 'File kosong. Pilih file dashboard yang berisi.'],
    ['AC-007', htmlFile('a'.repeat(614_400)), 'Ukuran file 600,0 KB melebihi batas 500 KB.'],
  ])('%s: file tidak valid ditolak tanpa modal dan tanpa perubahan', async (_id, file, message) => {
    const user = renderApp('/crm-pages/page-sales');
    const before = localStorage.getItem(STORAGE_KEY);
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), file);
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toHaveTextContent(message);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it('AC-008: file dengan isi sama tidak membuka modal dan tidak menambah revisi', async () => {
    const user = renderApp('/crm-pages/page-sales');
    const v5 = stored().versions.find((v) => v.id === 'ver-sales-5')!;
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile(v5.fileContent, 'salinan.html'));
    expect(await screen.findByText('File ini sama dengan file yang sedang dipakai v5. Tidak ada perubahan.')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(revisionCount('ver-sales-5')).toBe(1);
  });

  it('AC-009/010/011: versi Published memakai MODAL-02 dan hanya lanjut setelah nomor versi diketik', async () => {
    const user = renderApp('/crm-pages/page-sales');
    await user.upload(screen.getByLabelText('Pilih file untuk v4'), htmlFile('<p>tayang baru</p>'));
    const dialog = await screen.findByRole('dialog', { name: 'Ganti versi yang sedang tayang?' });
    expect(within(dialog).getByText(/v4 sedang Published dan dibaca client PT Sinar Retail/)).toBeInTheDocument();
    const input = within(dialog).getByLabelText('Ketik v4 untuk melanjutkan');
    const confirm = within(dialog).getByRole('button', { name: 'Ganti versi tayang' });
    expect(confirm).toHaveClass('btn-danger');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();

    for (const wrong of ['v5', '4', 'v44']) {
      await user.clear(input);
      await user.type(input, wrong);
      expect(confirm).toBeDisabled();
      await user.keyboard('{Enter}');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }
    expect(revisionCount('ver-sales-4')).toBe(2);
    for (const right of ['v4', 'V4', ' v4 ']) {
      await user.clear(input);
      await user.type(input, right);
      expect(confirm).toBeEnabled();
    }
    await user.click(confirm);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const v4 = stored().versions.find((v) => v.id === 'ver-sales-4')!;
    expect(v4).toMatchObject({ status: 'Published', fileName: 'dashboard-baru.html' });
    expect(revisionCount('ver-sales-4')).toBe(3);
    expect(screen.getByText('File v4 diganti dengan dashboard-baru.html. File lama tersimpan di riwayat.')).toBeInTheDocument();
  });

  it('AC-035: fokus terkunci di modal dan kembali ke tombol pemicu setelah Esc', async () => {
    const user = renderApp('/crm-pages/page-sales');
    const uploadButton = screen.getByRole('button', { name: 'Upload file v5' });
    await user.click(uploadButton);
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile('<p>baru</p>'));
    const dialog = await screen.findByRole('dialog', { name: 'Ganti file v5?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const cancel = within(dialog).getByRole('button', { name: 'Batal' });
    const ok = within(dialog).getByRole('button', { name: 'Ganti file' });
    expect(cancel).toHaveFocus();
    await user.tab();
    expect(ok).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.tab({ shift: true });
    expect(ok).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(uploadButton).toHaveFocus();
  });

  it('AC-031: tulis localStorage gagal saat Upload, data dan layar tetap, modal tetap terbuka', async () => {
    const user = renderApp('/crm-pages/page-sales');
    const before = localStorage.getItem(STORAGE_KEY);
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile('<p>baru</p>'));
    const dialog = await screen.findByRole('dialog', { name: 'Ganti file v5?' });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('penuh', 'QuotaExceededError');
    });
    await user.click(within(dialog).getByRole('button', { name: 'Ganti file' }));
    expect(screen.getByText('Perubahan gagal disimpan karena penyimpanan browser penuh atau tidak tersedia. Data sebelumnya tidak berubah.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Ganti file v5?' })).toBeInTheDocument();
    expect(within(card('v5')).getByText('dashboard-sales-v5.html')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });
});

describe('Saved Prompt', () => {
  it('AC-013: daftar prompt dengan kolom Dipakai oleh', () => {
    renderApp('/prompts');
    const row = (id: string) => screen.getByText(id).closest('tr')!;
    expect(within(row('P-101')).getByText('2 audit')).toBeInTheDocument();
    expect(within(row('P-102')).getByText('Tidak dipakai audit')).toBeInTheDocument();
    expect(within(row('P-103')).getByText('1 audit')).toBeInTheDocument();
    expect(within(row('P-101')).getByText('Audit Respons Sales')).toBeInTheDocument();
  });

  it('AC-014: panel pemakaian audit P-101', () => {
    renderApp('/prompts/P-101');
    const panel = screen.getByRole('region', { name: 'Dipakai oleh Continuous Audit' });
    expect(within(panel).getByLabelText('2 audit')).toBeInTheDocument();
    const items = within(panel).getAllByRole('listitem');
    expect(items.map((i) => i.textContent)).toEqual(['Audit Harian Salessetiap hari 06.00Aktif', 'Audit Mingguan SPVSenin 07.00Aktif']);
    expect(within(panel).getByText('Audit memakai prompt berdasarkan ID. Perubahan isi otomatis dipakai pada jadwal berikutnya.')).toBeInTheDocument();
  });

  it('AC-015: prompt duplikat menampilkan empty state', () => {
    renderApp('/prompts/P-102');
    expect(
      screen.getByText('Prompt ini belum dipakai Continuous Audit mana pun. Audit hanya memakai prompt yang dipilih di pengaturannya.'),
    ).toBeInTheDocument();
  });

  it('AC-016: simpan prompt yang dipakai audit menyebut audit di toast dan menambah revisi', async () => {
    const user = renderApp('/prompts/P-101');
    await user.type(screen.getByLabelText('Isi prompt'), '\n6. Aturan baru.');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(
      screen.getByText(
        'Perubahan disimpan. Dipakai oleh 2 Continuous Audit pada jadwal berikutnya: Audit Harian Sales (setiap hari 06.00), Audit Mingguan SPV (Senin 07.00).',
      ),
    ).toBeInTheDocument();
    const revisions = stored().revisions.filter((r) => r.targetId === 'P-101');
    expect(revisions).toHaveLength(3);
    expect(revisions[2].action).toBe('Disimpan');
    expect(stored().prompts.find((p) => p.id === 'P-101')!.content).toContain('6. Aturan baru.');
    expect(screen.getByLabelText('Isi prompt')).toHaveValue(stored().prompts.find((p) => p.id === 'P-101')!.content);
    expect(screen.getByText(/oleh Raka Pradipta \(System Implementor\)/)).toBeInTheDocument();
  });

  it('AC-017: simpan prompt yang tidak dipakai audit', async () => {
    const user = renderApp('/prompts/P-102');
    await user.type(screen.getByLabelText('Isi prompt'), ' tambahan');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(screen.getByText('Perubahan disimpan. Prompt ini belum dipakai Continuous Audit mana pun.')).toBeInTheDocument();
  });

  it('AC-020: audit nonaktif disebut dengan "(nonaktif)"', async () => {
    const user = renderApp('/prompts/P-103');
    await user.type(screen.getByLabelText('Isi prompt'), ' tambahan');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(screen.getByTestId('toast-success')).toHaveTextContent('Audit Follow Up Mingguan (Jumat 08.00) (nonaktif)');
  });

  it('AC-018: nama atau isi kosong ditolak dengan pesan di field, input lain tetap, tanpa revisi', async () => {
    const user = renderApp('/prompts/P-101');
    const name = screen.getByLabelText('Nama prompt');
    const content = screen.getByLabelText('Isi prompt');
    await user.clear(name);
    await user.type(name, '   ');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(screen.getByText('Nama prompt wajib diisi.')).toBeInTheDocument();
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Nama prompt wajib diisi.');
    expect(content).toHaveValue(stored().prompts.find((p) => p.id === 'P-101')!.content);

    await user.type(name, 'Nama baru');
    expect(screen.queryByText('Nama prompt wajib diisi.')).not.toBeInTheDocument();
    await user.clear(content);
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(screen.getByText('Isi prompt wajib diisi.')).toBeInTheDocument();
    expect(content).toHaveFocus();
    expect(name).toHaveValue('   Nama baru');
    expect(revisionCount('P-101')).toBe(2);
  });

  it('AC-019: tanpa perubahan menampilkan toast info dan tidak menambah revisi', async () => {
    const user = renderApp('/prompts/P-101');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(screen.getByTestId('toast-info')).toHaveTextContent('Tidak ada perubahan untuk disimpan.');
    expect(revisionCount('P-101')).toBe(2);
  });

  it('AC-031: tulis localStorage gagal saat simpan prompt, ketikan tetap dan data lama tetap', async () => {
    const user = renderApp('/prompts/P-101');
    const before = localStorage.getItem(STORAGE_KEY);
    await user.type(screen.getByLabelText('Isi prompt'), ' tambahan');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('penuh', 'QuotaExceededError');
    });
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(screen.getByTestId('toast-error')).toHaveTextContent('Perubahan gagal disimpan');
    expect(screen.getByLabelText('Isi prompt')).toHaveValue(`${createSeedData().prompts[0].content} tambahan`);
    expect(screen.getByText(/oleh Dimas \(System Implementor\)/)).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it('Batal kembali ke daftar tanpa menyimpan', async () => {
    const user = renderApp('/prompts/P-101');
    await user.type(screen.getByLabelText('Isi prompt'), ' tambahan');
    await user.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/prompts');
    expect(revisionCount('P-101')).toBe(2);
  });
});

describe('Riwayat dan pengembalian', () => {
  it('AC-021/022: daftar revisi terbaru di atas dan isi revisi #1', async () => {
    const user = renderApp('/riwayat/prompt/P-101');
    expect(screen.getByRole('heading', { level: 1, name: 'Riwayat prompt P-101' })).toBeInTheDocument();
    const items = within(screen.getByRole('region', { name: 'Daftar revisi' })).getAllByRole('button');
    expect(items[0]).toHaveTextContent('Revisi #2');
    expect(items[0]).toHaveTextContent('Isi saat ini');
    expect(items[0]).toHaveTextContent('Dimas (System Implementor)');
    expect(items[0]).toHaveTextContent('Disimpan');
    expect(items[1]).toHaveTextContent('Revisi #1');
    expect(screen.getByRole('tab', { name: 'Isi revisi' })).toHaveAttribute('aria-selected', 'true');

    await user.click(items[1]);
    expect(screen.getByRole('heading', { name: 'Revisi #1' })).toBeInTheDocument();
    const content = screen.getByLabelText('Isi revisi #1');
    expect(content.tagName).toBe('PRE');
    expect(content).toHaveClass('code-block');
    expect(content.textContent).not.toContain('5. Sales wajib menutup');
  });

  it('AC-023/024/026: bandingkan lalu kembalikan prompt ke revisi #1 lewat MODAL-03', async () => {
    const user = renderApp('/riwayat/prompt/P-101');
    expect(screen.getByRole('button', { name: 'Kembalikan revisi #2' })).toBeDisabled();
    expect(screen.getByText('Ini isi saat ini')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Revisi #1/ }));
    await user.click(screen.getByRole('tab', { name: 'Bandingkan dengan isi saat ini' }));
    expect(screen.getByText('1 baris ditambah, 0 baris dihapus')).toBeInTheDocument();
    const added = document.querySelectorAll('.diff-line.added');
    expect(added).toHaveLength(1);
    expect(added[0].textContent).toBe('+5. Sales wajib menutup percakapan dengan ajakan kunjungan ke toko.');

    await user.click(screen.getByRole('button', { name: 'Kembalikan revisi #1' }));
    const dialog = screen.getByRole('dialog', { name: 'Kembalikan ke revisi #1?' });
    await user.click(within(dialog).getByRole('button', { name: 'Kembalikan revisi #1' }));
    expect(screen.getByText('Isi dikembalikan ke revisi #1 (dicatat sebagai revisi #3).')).toBeInTheDocument();
    const revisions = stored().revisions.filter((r) => r.targetId === 'P-101');
    expect(revisions.map((r) => [r.number, r.action])).toEqual([
      [1, 'Dibuat'],
      [2, 'Disimpan'],
      [3, 'Dikembalikan dari revisi #1'],
    ]);
    expect(screen.getByRole('heading', { name: 'Revisi #3' })).toBeInTheDocument();
  });

  it('AC-025: mengembalikan versi Draft lewat MODAL-03', async () => {
    const data = createSeedData();
    const user = renderApp('/crm-pages/page-sales', data);
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile('<p>baru</p>'));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Ganti file' }));
    await user.click(screen.getByRole('link', { name: 'Riwayat v5' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Riwayat v5: Dashboard Kinerja Sales' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Revisi #1/ }));
    await user.click(screen.getByRole('button', { name: 'Kembalikan revisi #1' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Kembalikan ke revisi #1?' })).getByRole('button', { name: 'Kembalikan revisi #1' }));
    expect(stored().versions.find((v) => v.id === 'ver-sales-5')!.fileName).toBe('dashboard-sales-v5.html');
    expect(revisionCount('ver-sales-5')).toBe(3);
    await user.click(screen.getByRole('link', { name: 'Dashboard Kinerja Sales' }));
    expect(within(card('v5')).getByText('dashboard-sales-v5.html')).toBeInTheDocument();
  });

  it('AC-012: pengembalian versi Published memakai MODAL-02 dengan file revisi', async () => {
    const user = renderApp('/riwayat/versi/ver-sales-4');
    await user.click(screen.getByRole('button', { name: /Revisi #1/ }));
    const restore = screen.getByRole('button', { name: 'Kembalikan revisi #1' });
    expect(restore).toHaveClass('btn-danger');
    await user.click(restore);
    expect(screen.queryByRole('dialog', { name: 'Kembalikan ke revisi #1?' })).not.toBeInTheDocument();
    const dialog = screen.getByRole('dialog', { name: 'Ganti versi yang sedang tayang?' });
    const confirm = within(dialog).getByRole('button', { name: 'Ganti versi tayang' });
    expect(confirm).toBeDisabled();
    await user.type(within(dialog).getByLabelText('Ketik v4 untuk melanjutkan'), 'v4');
    await user.click(confirm);
    expect(screen.getByText('Isi dikembalikan ke revisi #1 (dicatat sebagai revisi #3).')).toBeInTheDocument();
    const v4 = stored().versions.find((v) => v.id === 'ver-sales-4')!;
    const rev1 = createSeedData().revisions.find((r) => r.id === 'rev-v4-1')!;
    expect(rev1.targetType === 'version' && v4.fileContent === rev1.snapshot.fileContent).toBe(true);
    expect(v4.status).toBe('Published');
  });

  it('AC-027: isi file berisi script dan tag tampil sebagai teks', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = renderApp('/crm-pages/page-sales');
    const evil = '<html>\n<script>alert(1)</script>\n<b>tebal</b>\n</html>';
    await user.upload(screen.getByLabelText('Pilih file untuk v5'), htmlFile(evil));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Ganti file' }));
    await user.click(screen.getByRole('link', { name: 'Riwayat v5' }));
    expect(screen.getByLabelText('Isi revisi #2').textContent).toBe(evil);
    await user.click(screen.getByRole('button', { name: /Revisi #1/ }));
    await user.click(screen.getByRole('tab', { name: 'Bandingkan dengan isi saat ini' }));
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
    expect(document.querySelector('.diff-block script, .diff-block b, .code-block script')).toBeNull();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('AC-044: nomor revisi per objek tidak saling memengaruhi', async () => {
    const user = renderApp('/prompts/P-101');
    await user.type(screen.getByLabelText('Isi prompt'), ' x');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));
    expect(revisionCount('P-101')).toBe(3);
    expect(revisionCount('ver-sales-4')).toBe(2);
    expect(revisionCount('P-102')).toBe(1);
  });
});
