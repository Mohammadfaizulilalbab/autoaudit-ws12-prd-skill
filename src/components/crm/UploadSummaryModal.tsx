import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useSingleSubmit } from '../common/useSingleSubmit';
import { SummaryTable, type FileInfo } from './SummaryTable';

interface UploadSummaryModalProps {
  pageName: string;
  versionText: string;
  status: string;
  current: FileInfo;
  next: FileInfo;
  onConfirm: () => boolean;
  onCancel: () => void;
  returnFocusTo?: HTMLElement | null;
}

/** MODAL-01 Ringkasan Upload untuk versi Draft atau Archived. */
export function UploadSummaryModal({ pageName, versionText, status, current, next, onConfirm, onCancel, returnFocusTo }: UploadSummaryModalProps) {
  const { busy, run } = useSingleSubmit(onConfirm);
  return (
    <Modal
      title={`Ganti file ${versionText}?`}
      onClose={onCancel}
      returnFocusTo={returnFocusTo}
      actions={
        <>
          <Button onClick={onCancel}>Batal</Button>
          <Button variant="primary" onClick={run} disabled={busy}>
            Ganti file
          </Button>
        </>
      }
    >
      <SummaryTable pageName={pageName} versionText={`${versionText} (${status})`} current={current} next={next} />
      <p className="text-small">File sekarang tetap tersimpan di riwayat dan bisa dikembalikan.</p>
    </Modal>
  );
}
