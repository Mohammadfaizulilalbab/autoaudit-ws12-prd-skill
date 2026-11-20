import { useRef, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FileCode, History, Upload } from 'lucide-react';
import type { DashboardVersion } from '../../types';
import { formatDateTime, formatKb, versionLabel } from '../../utils/format';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

interface VersionCardProps {
  version: DashboardVersion;
  onFileSelected: (version: DashboardVersion, file: File) => void;
}

export function VersionCard({ version, onFileSelected }: VersionCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);
  const label = versionLabel(version.number);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Kosongkan agar file yang sama bisa dipilih lagi; batal memilih file tidak melakukan apa pun.
    e.target.value = '';
    // Pastikan tombol Upload yang fokus, agar modal mengembalikan fokus ke sini saat ditutup.
    uploadButtonRef.current?.focus();
    if (file) onFileSelected(version, file);
  };

  return (
    <article className="card version-card" aria-label={`Versi ${label}`}>
      <div className="version-card-top">
        <h3>{label}</h3>
        <StatusBadge status={version.status} />
      </div>
      <div className="version-file">
        <FileCode size={20} aria-hidden="true" />
        <span className="text-strong">{version.fileName}</span>
        <span className="text-small">{formatKb(version.fileSize)} KB</span>
      </div>
      <div className="version-card-bottom">
        <p className="text-small">
          Diubah {formatDateTime(version.updatedAt)} oleh {version.updatedBy}
        </p>
        <div className="button-row">
          <Button
            onClick={(e) => {
              uploadButtonRef.current = e.currentTarget;
              inputRef.current?.click();
            }} icon={<Upload size={16} aria-hidden="true" />} aria-label={`Upload file ${label}`}>
            Upload
          </Button>
          <Link className="btn btn-secondary" to={`/riwayat/versi/${version.id}`} aria-label={`Riwayat ${label}`}>
            <History size={16} aria-hidden="true" />
            Riwayat
          </Link>
          <input ref={inputRef} type="file" accept=".html,.htm" hidden aria-label={`Pilih file untuk ${label}`} onChange={handleChange} />
        </div>
      </div>
    </article>
  );
}
