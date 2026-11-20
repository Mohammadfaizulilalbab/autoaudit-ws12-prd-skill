import { formatKb } from './format';

export const MAX_FILE_BYTES = 512_000;
export const MAX_PROMPT_NAME = 120;
export const MAX_PROMPT_CONTENT = 20_000;

export function hasDashboardExtension(fileName: string): boolean {
  return /\.html?$/i.test(fileName);
}

/** Pesan error setelah file dibaca (kosong atau terlalu besar), atau null bila valid. */
export function validateDashboardContent(fileSize: number, content: string): string | null {
  if (fileSize === 0 || content.trim() === '') return 'File kosong. Pilih file dashboard yang berisi.';
  if (fileSize > MAX_FILE_BYTES) return `Ukuran file ${formatKb(fileSize)} KB melebihi batas 500 KB.`;
  return null;
}

export const EXTENSION_ERROR = 'File harus berformat .html atau .htm.';

/** Input MODAL-02 cocok bila sama dengan "v[n]", tanpa spasi tepi dan tanpa membedakan huruf besar/kecil. */
export function matchesVersionNumber(input: string, versionNumber: number): boolean {
  return input.trim().toLowerCase() === `v${versionNumber}`;
}

export interface PromptFormErrors {
  name?: string;
  content?: string;
}

export function validatePromptForm(name: string, content: string): PromptFormErrors {
  const errors: PromptFormErrors = {};
  if (name.trim() === '') errors.name = 'Nama prompt wajib diisi.';
  else if (name.trim().length > MAX_PROMPT_NAME) errors.name = 'Nama prompt paling banyak 120 karakter.';
  if (content.trim() === '') errors.content = 'Isi prompt wajib diisi.';
  else if (content.length > MAX_PROMPT_CONTENT) errors.content = 'Isi prompt paling banyak 20.000 karakter.';
  return errors;
}
