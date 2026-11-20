import { useRef, useState } from 'react';

/**
 * Menjaga satu konfirmasi = satu eksekusi aksi (INTERACTION-SPEC 3.6): tombol nonaktif selama aksi berjalan
 * dan klik ganda diabaikan. Tombol aktif lagi setelah aksi selesai (berhasil atau gagal).
 */
export function useSingleSubmit(action: () => void) {
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const run = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      action();
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  return { busy, run };
}
