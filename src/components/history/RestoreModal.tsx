import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useSingleSubmit } from '../common/useSingleSubmit';

/** MODAL-03 Kembalikan revisi (prompt, versi Draft, versi Archived). */
export function RestoreModal({ number, onConfirm, onCancel }: { number: number; onConfirm: () => boolean; onCancel: () => void }) {
  const { busy, run } = useSingleSubmit(onConfirm);
  return (
    <Modal
      title={`Kembalikan ke revisi #${number}?`}
      onClose={onCancel}
      actions={
        <>
          <Button onClick={onCancel}>Batal</Button>
          <Button variant="primary" onClick={run} disabled={busy}>
            Kembalikan revisi #{number}
          </Button>
        </>
      }
    >
      <p>Isi saat ini akan diganti dengan isi revisi #{number}. Riwayat tidak dihapus, dan pengembalian ini dicatat sebagai revisi baru.</p>
    </Modal>
  );
}
