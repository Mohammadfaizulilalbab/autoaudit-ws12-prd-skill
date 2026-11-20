import { diffArrays } from 'diff';

export type DiffLineType = 'added' | 'removed' | 'same';

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

export interface LineDiff {
  lines: DiffLine[];
  added: number;
  removed: number;
}

// Batas jumlah edit agar file 500 KB yang sangat berbeda tidak membuat halaman macet (D-14).
const MAX_EDIT_LENGTH = 2000;

function toLines(text: string): string[] {
  return text === '' ? [] : text.split(/\r?\n/);
}

/** Bandingkan isi lama (revisi) dengan isi baru (saat ini) per baris. */
export function computeLineDiff(oldText: string, newText: string): LineDiff {
  const oldLines = toLines(oldText);
  const newLines = toLines(newText);
  const changes = diffArrays(oldLines, newLines, { maxEditLength: MAX_EDIT_LENGTH });

  const lines: DiffLine[] = [];
  if (changes) {
    for (const change of changes) {
      const type: DiffLineType = change.added ? 'added' : change.removed ? 'removed' : 'same';
      for (const text of change.value) lines.push({ type, text });
    }
  } else {
    // Terlalu banyak perbedaan: tandai semua baris lama dihapus dan semua baris baru ditambah.
    for (const text of oldLines) lines.push({ type: 'removed', text });
    for (const text of newLines) lines.push({ type: 'added', text });
  }

  return {
    lines,
    added: lines.filter((l) => l.type === 'added').length,
    removed: lines.filter((l) => l.type === 'removed').length,
  };
}
