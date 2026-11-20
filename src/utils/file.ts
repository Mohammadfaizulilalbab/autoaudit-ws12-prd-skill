/** Membaca file sebagai teks dengan FileReader (dipakai sebelum validasi isi). */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
}
