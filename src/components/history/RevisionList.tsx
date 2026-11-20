import type { Revision } from '../../types';
import { formatDateTime } from '../../utils/format';

interface RevisionListProps {
  revisions: Revision[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Daftar revisi, terbaru di atas; revisi terbaru diberi label "Isi saat ini". */
export function RevisionList({ revisions, selectedId, onSelect }: RevisionListProps) {
  return (
    <section className="revision-detail" aria-label="Daftar revisi">
      {revisions.length === 1 && <p className="text-small">Belum ada perubahan sejak data dibuat.</p>}
      <ul className="revision-list">
        {revisions.map((r, i) => (
          <li key={r.id}>
            <button
              type="button"
              className={`revision-item ${r.id === selectedId ? 'is-selected' : ''}`}
              aria-pressed={r.id === selectedId}
              onClick={() => onSelect(r.id)}
            >
              <span className="revision-item-top">
                <span className="text-strong">Revisi #{r.number}</span>
                {i === 0 && <span className="badge badge-current">Isi saat ini</span>}
              </span>
              <span className="text-small">{formatDateTime(r.createdAt)}</span>
              <span className="text-small">{r.createdBy}</span>
              <span className="text-small">{r.action}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
