import type { ContinuousAudit } from '../types';

export const STORAGE_ERROR_MESSAGE =
  'Perubahan gagal disimpan karena penyimpanan browser penuh atau tidak tersedia. Data sebelumnya tidak berubah.';
export const CORRUPT_DATA_MESSAGE = 'Data tersimpan tidak bisa dibaca. Muat ulang data contoh untuk melanjutkan.';
export const NO_CHANGE_MESSAGE = 'Tidak ada perubahan untuk disimpan.';
export const RESET_DONE_MESSAGE = 'Data contoh sudah diatur ulang.';
export const NOT_FOUND_MESSAGE = 'Data tidak ditemukan. Mungkin data contoh sudah diatur ulang.';

function describeAudit(audit: ContinuousAudit): string {
  return `${audit.name} (${audit.schedule})${audit.status === 'Nonaktif' ? ' (nonaktif)' : ''}`;
}

/** Toast sesudah simpan prompt (INTERACTION-SPEC 5.5). `audits` sudah urut nama. */
export function promptSavedMessage(audits: ContinuousAudit[]): string {
  if (audits.length === 0) return 'Perubahan disimpan. Prompt ini belum dipakai Continuous Audit mana pun.';
  const shown = audits.slice(0, 3).map(describeAudit).join(', ');
  const rest = audits.length > 3 ? ` dan ${audits.length - 3} lainnya` : '';
  return `Perubahan disimpan. Dipakai oleh ${audits.length} Continuous Audit pada jadwal berikutnya: ${shown}${rest}.`;
}

export function uploadDoneMessage(versionText: string, fileName: string): string {
  return `File ${versionText} diganti dengan ${fileName}. File lama tersimpan di riwayat.`;
}

export function sameFileMessage(versionText: string): string {
  return `File ini sama dengan file yang sedang dipakai ${versionText}. Tidak ada perubahan.`;
}

export function restoreDoneMessage(fromNumber: number, newNumber: number): string {
  return `Isi dikembalikan ke revisi #${fromNumber} (dicatat sebagai revisi #${newNumber}).`;
}
