import { describe, expect, it } from 'vitest';
import type { AppData, PromptRevision, VersionRevision } from '../types';
import { createSeedData } from '../store/seed';
import { CURRENT_USER, restoreRevision, savePrompt, uploadVersionFile } from '../store/actions';
import { auditsForPrompt, isSameAsCurrent, revisionsFor } from '../store/selectors';
import { loadData, saveData, STORAGE_KEY } from '../store/storage';
import { computeLineDiff } from '../utils/diff';
import { formatDateTime, formatKb } from '../utils/format';
import { promptSavedMessage } from '../utils/messages';
import { hasDashboardExtension, matchesVersionNumber, validateDashboardContent, validatePromptForm } from '../utils/validation';

const NOW = '2026-11-20T07:05:00.000Z';

function promptSnapshot(data: AppData, id: string) {
  return (data.revisions.find((r) => r.id === id) as PromptRevision).snapshot;
}

describe('validasi file dashboard', () => {
  it('menerima .html dan .htm tanpa membedakan huruf besar/kecil', () => {
    expect(hasDashboardExtension('a.html')).toBe(true);
    expect(hasDashboardExtension('a.HTM')).toBe(true);
    expect(hasDashboardExtension('a.txt')).toBe(false);
    expect(hasDashboardExtension('html')).toBe(false);
    expect(hasDashboardExtension('a.html.zip')).toBe(false);
  });

  it('menolak file kosong atau hanya spasi', () => {
    expect(validateDashboardContent(0, '')).toBe('File kosong. Pilih file dashboard yang berisi.');
    expect(validateDashboardContent(4, '  \n ')).toBe('File kosong. Pilih file dashboard yang berisi.');
  });

  it('menolak file lebih dari 512.000 byte dan menyebut ukurannya', () => {
    expect(validateDashboardContent(512_000, 'x')).toBeNull();
    expect(validateDashboardContent(512_001, 'x')).toBe('Ukuran file 500,1 KB melebihi batas 500 KB.');
    expect(validateDashboardContent(614_400, 'x')).toBe('Ukuran file 600,0 KB melebihi batas 500 KB.');
  });
});

describe('pencocokan nomor versi (MODAL-02)', () => {
  it.each(['', 'v5', '4', 'v44', 'v 4'])('menolak %j untuk v4', (input) => {
    expect(matchesVersionNumber(input, 4)).toBe(false);
  });
  it.each(['v4', 'V4', ' v4 '])('menerima %j untuk v4', (input) => {
    expect(matchesVersionNumber(input, 4)).toBe(true);
  });
});

describe('validasi form prompt', () => {
  it('memberi pesan untuk nama dan isi kosong atau hanya spasi', () => {
    expect(validatePromptForm('  ', ' \n')).toEqual({ name: 'Nama prompt wajib diisi.', content: 'Isi prompt wajib diisi.' });
  });
  it('memberi pesan untuk batas panjang', () => {
    expect(validatePromptForm('a'.repeat(121), 'a'.repeat(20_001))).toEqual({
      name: 'Nama prompt paling banyak 120 karakter.',
      content: 'Isi prompt paling banyak 20.000 karakter.',
    });
    expect(validatePromptForm('a'.repeat(120), 'a'.repeat(20_000))).toEqual({});
  });
});

describe('format', () => {
  it('memformat waktu "20 Nov 2026, 14.05"', () => {
    expect(formatDateTime(new Date(2026, 10, 20, 14, 5).toISOString())).toBe('20 Nov 2026, 14.05');
  });
  it('memformat KB dengan koma', () => {
    expect(formatKb(1024)).toBe('1,0');
    expect(formatKb(1536)).toBe('1,5');
  });
});

describe('pesan simpan prompt', () => {
  const data = createSeedData();
  it('menyebut jumlah, nama, dan jadwal audit', () => {
    expect(promptSavedMessage(auditsForPrompt(data, 'P-101'))).toBe(
      'Perubahan disimpan. Dipakai oleh 2 Continuous Audit pada jadwal berikutnya: Audit Harian Sales (setiap hari 06.00), Audit Mingguan SPV (Senin 07.00).',
    );
  });
  it('menandai audit nonaktif', () => {
    expect(promptSavedMessage(auditsForPrompt(data, 'P-103'))).toContain('Audit Follow Up Mingguan (Jumat 08.00) (nonaktif)');
  });
  it('menyebut belum dipakai bila tidak ada audit', () => {
    expect(promptSavedMessage([])).toBe('Perubahan disimpan. Prompt ini belum dipakai Continuous Audit mana pun.');
  });
  it('menulis tiga nama lalu "dan N lainnya"', () => {
    const audits = ['A', 'B', 'C', 'D', 'E'].map((name, i) => ({
      id: `x${i}`, clientId: 'c1', name, schedule: 'Senin 07.00', status: 'Aktif' as const, promptId: 'P-1',
    }));
    expect(promptSavedMessage(audits)).toBe(
      'Perubahan disimpan. Dipakai oleh 5 Continuous Audit pada jadwal berikutnya: A (Senin 07.00), B (Senin 07.00), C (Senin 07.00) dan 2 lainnya.',
    );
  });
});

describe('data contoh', () => {
  const data = createSeedData();
  it('berisi dua client, empat prompt, empat audit, dua CRM Page', () => {
    expect(data.clients).toHaveLength(2);
    expect(data.prompts).toHaveLength(4);
    expect(data.audits).toHaveLength(4);
    expect(data.pages).toHaveLength(2);
  });
  it('revisi terakhir setiap objek sama dengan isi saat ini', () => {
    for (const p of data.prompts) expect(isSameAsCurrent(data, revisionsFor(data, 'prompt', p.id)[0])).toBe(true);
    for (const v of data.versions) expect(isSameAsCurrent(data, revisionsFor(data, 'version', v.id)[0])).toBe(true);
  });
  it('P-102 tidak dipakai audit dan P-101 dipakai dua audit', () => {
    expect(auditsForPrompt(data, 'P-102')).toHaveLength(0);
    expect(auditsForPrompt(data, 'P-101').map((a) => a.name)).toEqual(['Audit Harian Sales', 'Audit Mingguan SPV']);
  });
});

describe('aksi data', () => {
  const file = { fileName: 'baru.html', fileSize: 12, fileContent: '<p>baru</p>' };

  it('upload mengganti file dan menambah tepat satu revisi Diunggah', () => {
    const data = createSeedData();
    const next = uploadVersionFile(data, 'ver-sales-5', file, NOW);
    const v5 = next.versions.find((v) => v.id === 'ver-sales-5')!;
    expect(v5).toMatchObject({ ...file, updatedBy: CURRENT_USER, updatedAt: NOW, status: 'Draft' });
    const revs = revisionsFor(next, 'version', 'ver-sales-5');
    expect(revs).toHaveLength(2);
    expect(revs[0]).toMatchObject({ number: 2, action: 'Diunggah', snapshot: file });
    // data lama tidak dimutasi
    expect(revisionsFor(data, 'version', 'ver-sales-5')).toHaveLength(1);
  });

  it('nomor revisi dihitung per objek', () => {
    const data = createSeedData();
    const next = uploadVersionFile(data, 'ver-sales-4', file, NOW);
    expect(revisionsFor(next, 'version', 'ver-sales-4')[0].number).toBe(3);
    expect(revisionsFor(next, 'prompt', 'P-101')[0].number).toBe(2);
    const next2 = savePrompt(next, 'P-101', { name: 'Audit Respons Sales', content: 'baru' }, NOW)!;
    expect(revisionsFor(next2, 'prompt', 'P-101')[0].number).toBe(3);
    expect(revisionsFor(next2, 'version', 'ver-sales-4')[0].number).toBe(3);
  });

  it('simpan prompt men-trim nama dan menolak bila tidak ada perubahan', () => {
    const data = createSeedData();
    const p = data.prompts.find((x) => x.id === 'P-101')!;
    expect(savePrompt(data, 'P-101', { name: `  ${p.name} `, content: p.content }, NOW)).toBeNull();
    const next = savePrompt(data, 'P-101', { name: '  Nama Baru ', content: p.content }, NOW)!;
    expect(next.prompts.find((x) => x.id === 'P-101')!.name).toBe('Nama Baru');
    expect(revisionsFor(next, 'prompt', 'P-101')[0]).toMatchObject({ number: 3, action: 'Disimpan' });
  });

  it('pengembalian bertingkat membuat revisi baru tanpa menghapus revisi lama', () => {
    const data = createSeedData();
    const r1 = restoreRevision(data, 'rev-p101-1', NOW);
    expect(r1.newNumber).toBe(3);
    const p1 = r1.data.prompts.find((p) => p.id === 'P-101')!;
    expect(p1.content).toBe(promptSnapshot(data, 'rev-p101-1').content);

    const r2 = restoreRevision(r1.data, 'rev-p101-2', NOW);
    expect(r2.newNumber).toBe(4);
    const revs = revisionsFor(r2.data, 'prompt', 'P-101');
    expect(revs.map((r) => r.number)).toEqual([4, 3, 2, 1]);
    expect(revs[0].action).toBe('Dikembalikan dari revisi #2');
    expect(revs[1].action).toBe('Dikembalikan dari revisi #1');
    expect(r2.data.prompts.find((p) => p.id === 'P-101')!.content).toBe(promptSnapshot(data, 'rev-p101-2').content);
  });

  it('pengembalian versi mengganti file dari revisi', () => {
    const data = createSeedData();
    const { data: next, newNumber } = restoreRevision(data, 'rev-v4-1', NOW);
    expect(newNumber).toBe(3);
    const rev = data.revisions.find((r) => r.id === 'rev-v4-1') as VersionRevision;
    expect(next.versions.find((v) => v.id === 'ver-sales-4')!.fileContent).toBe(rev.snapshot.fileContent);
    expect(next.versions.find((v) => v.id === 'ver-sales-4')!.status).toBe('Published');
  });
});

describe('perbandingan baris', () => {
  it('menandai baris ditambah dan dihapus', () => {
    const result = computeLineDiff('a\nb\nc', 'a\nc\nd');
    expect(result.lines).toEqual([
      { type: 'same', text: 'a' },
      { type: 'removed', text: 'b' },
      { type: 'same', text: 'c' },
      { type: 'added', text: 'd' },
    ]);
    expect(result.added).toBe(1);
    expect(result.removed).toBe(1);
  });

  it('isi sama menghasilkan nol perbedaan', () => {
    expect(computeLineDiff('a\nb', 'a\nb')).toMatchObject({ added: 0, removed: 0 });
  });

  it('file 500 KB selesai kurang dari 1 detik, termasuk yang sangat berbeda', () => {
    const big = Array.from({ length: 15_000 }, (_, i) => `<div class="row-${i}">baris ${i}</div>`).join('\n').slice(0, 512_000);
    const edited = big.replace('baris 7000<', 'baris tujuh ribu<');
    const different = Array.from({ length: 15_000 }, (_, i) => `<span>${i * 7}</span>`).join('\n');
    const start = performance.now();
    expect(computeLineDiff(big, edited)).toMatchObject({ added: 1, removed: 1 });
    const allDifferent = computeLineDiff(big, different);
    expect(allDifferent.added + allDifferent.removed).toBeGreaterThan(20_000);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});

describe('penyimpanan localStorage', () => {
  it('kosong -> empty, rusak -> corrupt, skema lain -> corrupt', () => {
    expect(loadData()).toEqual({ status: 'empty' });
    localStorage.setItem(STORAGE_KEY, '{tidak valid');
    expect(loadData()).toEqual({ status: 'corrupt' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...createSeedData(), schemaVersion: 2 }));
    expect(loadData()).toEqual({ status: 'corrupt' });
  });

  it('menyimpan dan membaca kembali data', () => {
    const data = createSeedData();
    expect(saveData(data)).toBe(true);
    expect(loadData()).toEqual({ status: 'ok', data });
  });
});
