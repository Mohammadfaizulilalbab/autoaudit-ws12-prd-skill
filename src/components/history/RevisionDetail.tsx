import { useId } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Revision } from '../../types';
import { formatDateTime, formatKb } from '../../utils/format';
import { Button } from '../common/Button';
import { DiffView } from './DiffView';

export type DetailTab = 'content' | 'compare';

/** Isi saat ini dalam bentuk yang sama dengan snapshot revisi. */
export interface CurrentContent {
  title: string;
  text: string;
}

interface RevisionDetailProps {
  revision: Revision;
  current: CurrentContent;
  tab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  isCurrent: boolean;
  dangerRestore: boolean;
  onRestore: () => void;
}

function revisionContent(revision: Revision): CurrentContent {
  return revision.targetType === 'prompt'
    ? { title: revision.snapshot.name, text: revision.snapshot.content }
    : { title: revision.snapshot.fileName, text: revision.snapshot.fileContent };
}

export function RevisionDetail({ revision, current, tab, onTabChange, isCurrent, dangerRestore, onRestore }: RevisionDetailProps) {
  const baseId = useId();
  const content = revisionContent(revision);
  const titleLabel = revision.targetType === 'prompt' ? 'Nama prompt' : 'Nama file';
  const tabs: [DetailTab, string][] = [
    ['content', 'Isi revisi'],
    ['compare', 'Bandingkan dengan isi saat ini'],
  ];

  return (
    <section className="card revision-detail" aria-labelledby={`${baseId}-title`}>
      <div className="meta-list">
        <h3 id={`${baseId}-title`}>Revisi #{revision.number}</h3>
        <p className="text-small">
          {revision.action} · {formatDateTime(revision.createdAt)} · {revision.createdBy}
        </p>
      </div>

      <div className="tabs" role="tablist" aria-label="Tampilan revisi">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${baseId}-tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`${baseId}-panel`}
            className="tab"
            onClick={() => onTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${tab}`} className="revision-detail">
        {tab === 'content' ? (
          <>
            <p className="meta-list">
              <span className="text-small">{titleLabel}</span>
              <span className="text-strong">
                {content.title}
                {revision.targetType === 'version' && ` (${formatKb(revision.snapshot.fileSize)} KB)`}
              </span>
            </p>
            <pre className="code-block" tabIndex={0} aria-label={`Isi revisi #${revision.number}`}>
              {content.text}
            </pre>
          </>
        ) : (
          <>
            {content.title !== current.title && (
              <p className="meta-list text-small">
                <span>
                  {titleLabel} di revisi: <span className="text-strong">{content.title}</span>
                </span>
                <span>
                  {titleLabel} saat ini: <span className="text-strong">{current.title}</span>
                </span>
              </p>
            )}
            <DiffView oldText={content.text} newText={current.text} />
          </>
        )}
      </div>

      <div className="restore-row">
        <Button variant={dangerRestore ? 'danger' : 'secondary'} disabled={isCurrent} onClick={onRestore} icon={<RotateCcw size={16} aria-hidden="true" />}>
          Kembalikan revisi #{revision.number}
        </Button>
        {isCurrent && <span className="text-small">Ini isi saat ini</span>}
      </div>
    </section>
  );
}
