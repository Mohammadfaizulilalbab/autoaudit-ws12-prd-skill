import { useId, useState, type FormEvent } from 'react';
import { TriangleAlert } from 'lucide-react';
import { matchesVersionNumber } from '../../utils/validation';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useSingleSubmit } from '../common/useSingleSubmit';
import { SummaryTable, type FileInfo } from './SummaryTable';

interface PublishedConfirmModalProps {
  pageName: string;
  clientName: string;
  versionNumber: number;
  current: FileInfo;
  next: FileInfo;
  onConfirm: () => boolean;
  onCancel: () => void;
}

/** MODAL-02 Ganti versi tayang: dipakai untuk Upload dan pengembalian revisi pada versi Published. */
export function PublishedConfirmModal({ pageName, clientName, versionNumber, current, next, onConfirm, onCancel }: PublishedConfirmModalProps) {
  // Modal selalu dipasang baru saat dibuka, jadi input selalu kosong di awal.
  const [typed, setTyped] = useState('');
  const inputId = useId();
  const versionText = `v${versionNumber}`;
  const matches = matchesVersionNumber(typed, versionNumber);
  const { busy, run } = useSingleSubmit(onConfirm);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (matches) run();
  };

  return (
    <Modal
      title="Ganti versi yang sedang tayang?"
      onClose={onCancel}
      actions={
        <>
          <Button onClick={onCancel}>Batal</Button>
          <Button variant="danger" type="submit" form={`${inputId}-form`} disabled={!matches || busy}>
            Ganti versi tayang
          </Button>
        </>
      }
    >
      <div className="alert alert-danger">
        <TriangleAlert size={20} aria-hidden="true" />
        <p>
          {versionText} sedang Published dan dibaca client {clientName}. Isi baru langsung tampil ke client setelah Anda menekan Ganti versi tayang.
        </p>
      </div>
      <SummaryTable pageName={pageName} versionText={`${versionText} (Published)`} current={current} next={next} />
      <form id={`${inputId}-form`} className="field" onSubmit={submit}>
        <label className="field-label" htmlFor={inputId}>
          Ketik {versionText} untuk melanjutkan
        </label>
        <input id={inputId} className="input" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" data-autofocus />
      </form>
    </Modal>
  );
}
