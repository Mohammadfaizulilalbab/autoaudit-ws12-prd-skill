import { useMemo } from 'react';
import { computeLineDiff } from '../../utils/diff';

const PREFIX = { added: '+', removed: '-', same: ' ' } as const;

/** Perbandingan per baris: revisi (lama) vs isi saat ini (baru). Isi selalu dirender sebagai teks. */
export function DiffView({ oldText, newText }: { oldText: string; newText: string }) {
  const diff = useMemo(() => computeLineDiff(oldText, newText), [oldText, newText]);
  const same = diff.added === 0 && diff.removed === 0;
  return (
    <div className="revision-detail">
      <p className="text-strong">{same ? 'Isi revisi ini sama dengan isi saat ini.' : `${diff.added} baris ditambah, ${diff.removed} baris dihapus`}</p>
      <div className="diff-block" role="region" aria-label="Perbandingan baris" tabIndex={0}>
        {diff.lines.map((line, i) => (
          <div key={i} className={`diff-line ${line.type}`} data-type={line.type}>
            <span className="diff-prefix">{PREFIX[line.type]}</span>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
