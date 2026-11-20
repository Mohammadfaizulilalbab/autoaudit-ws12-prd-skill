import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useSingleSubmit } from '../common/useSingleSubmit';

/** MODAL-04 Atur ulang data contoh. */
export function ResetDataModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { resetData } = useStore();
  const navigate = useNavigate();
  const { busy, run } = useSingleSubmit(() => {
    if (!resetData()) return false;
    onClose();
    onDone();
    navigate('/crm-pages');
    return true;
  });

  return (
    <Modal
      title="Atur ulang data contoh?"
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>Batal</Button>
          <Button variant="danger" onClick={run} disabled={busy}>
            Atur ulang
          </Button>
        </>
      }
    >
      <p>Semua perubahan dan riwayat akan dihapus dan diganti data awal.</p>
    </Modal>
  );
}
