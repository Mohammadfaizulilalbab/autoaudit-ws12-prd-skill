const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const kbFormatter = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Byte -> "12,3" (KB, dibulatkan ke atas satu desimal agar 500,0x KB tidak tampil sebagai 500,0). */
export function formatKb(bytes: number): string {
  return kbFormatter.format(Math.ceil(bytes / 102.4) / 10);
}

/** ISO -> "20 Nov 2026, 14.05" dalam zona waktu browser. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}.${pad(d.getMinutes())}`;
}

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function versionLabel(number: number): string {
  return `v${number}`;
}
