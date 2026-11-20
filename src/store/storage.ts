import type { AppData } from '../types';

export const STORAGE_KEY = 'autoaudit-ws12:v1';

export type LoadResult = { status: 'ok'; data: AppData } | { status: 'empty' } | { status: 'corrupt' };

function looksLikeAppData(value: unknown): value is AppData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.schemaVersion === 1 &&
    typeof v.selectedClientId === 'string' &&
    ['clients', 'prompts', 'audits', 'pages', 'versions', 'revisions'].every((key) => Array.isArray(v[key]))
  );
}

export function loadData(): LoadResult {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { status: 'empty' };
  }
  if (raw === null) return { status: 'empty' };
  try {
    const parsed: unknown = JSON.parse(raw);
    return looksLikeAppData(parsed) ? { status: 'ok', data: parsed } : { status: 'corrupt' };
  } catch {
    return { status: 'corrupt' };
  }
}

/** Menulis seluruh data sekali per aksi. Mengembalikan false bila browser menolak (kuota penuh, diblokir). */
export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
