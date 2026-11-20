import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Revision, TargetType } from '../types';
import { useStore } from '../store/StoreContext';
import { clientName, isSameAsCurrent, revisionsFor } from '../store/selectors';
import { restoreRevision } from '../store/actions';
import { useToast } from '../components/common/Toast';
import { PageHeader, type Crumb } from '../components/layout/PageHeader';
import { RevisionList } from '../components/history/RevisionList';
import { RevisionDetail, type CurrentContent, type DetailTab } from '../components/history/RevisionDetail';
import { RestoreModal } from '../components/history/RestoreModal';
import { PublishedConfirmModal } from '../components/crm/PublishedConfirmModal';
import { versionLabel } from '../utils/format';
import { restoreDoneMessage } from '../utils/messages';
import { NotFound } from './NotFound';

interface HistoryTarget {
  title: string;
  crumbs: Crumb[];
  current: CurrentContent;
  /** Ada bila objeknya versi Published: pengembalian wajib lewat MODAL-02. */
  published?: { pageName: string; clientName: string; versionNumber: number; fileName: string; fileSize: number };
}

/** PAGE-05 Riwayat untuk prompt (`#/riwayat/prompt/:id`) atau versi dashboard (`#/riwayat/versi/:id`). */
export function HistoryPage({ targetType }: { targetType: TargetType }) {
  const { targetId = '' } = useParams();
  const { data, commit } = useStore();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<DetailTab>('content');
  const [restoring, setRestoring] = useState<Revision | null>(null);

  const target = resolveTarget();
  const revisions = revisionsFor(data, targetType, targetId);
  const selected = revisions.find((r) => r.id === selectedId) ?? revisions[0];
  if (!target || !selected) {
    return targetType === 'prompt' ? <NotFound section="Saved Prompt" listPath="/prompts" /> : <NotFound section="CRM Pages" listPath="/crm-pages" />;
  }

  function resolveTarget(): HistoryTarget | null {
    if (targetType === 'prompt') {
      const prompt = data.prompts.find((p) => p.id === targetId);
      if (!prompt) return null;
      return {
        title: `Riwayat prompt ${prompt.id}`,
        crumbs: [{ label: 'Saved Prompt', to: '/prompts' }, { label: `${prompt.id} ${prompt.name}`, to: `/prompts/${prompt.id}` }, { label: 'Riwayat' }],
        current: { title: prompt.name, text: prompt.content },
      };
    }
    const version = data.versions.find((v) => v.id === targetId);
    const page = version && data.pages.find((p) => p.id === version.pageId);
    if (!version || !page) return null;
    const label = versionLabel(version.number);
    return {
      title: `Riwayat ${label}: ${page.name}`,
      crumbs: [{ label: 'CRM Pages', to: '/crm-pages' }, { label: page.name, to: `/crm-pages/${page.id}` }, { label: `Riwayat ${label}` }],
      current: { title: version.fileName, text: version.fileContent },
      published:
        version.status === 'Published'
          ? { pageName: page.name, clientName: clientName(data, page.clientId), versionNumber: version.number, fileName: version.fileName, fileSize: version.fileSize }
          : undefined,
    };
  }

  const confirmRestore = (): boolean => {
    if (!restoring) return false;
    const result = restoreRevision(data, restoring.id, new Date().toISOString());
    if (!commit(result.data)) return false;
    toast('success', restoreDoneMessage(restoring.number, result.newNumber));
    setSelectedId(revisionsFor(result.data, targetType, targetId)[0].id);
    setRestoring(null);
    return true;
  };

  const cancelRestore = () => setRestoring(null);

  return (
    <>
      <PageHeader title={target.title} crumbs={target.crumbs} />
      <div className="grid-history">
        <RevisionList revisions={revisions} selectedId={selected.id} onSelect={setSelectedId} />
        <RevisionDetail
          revision={selected}
          current={target.current}
          tab={tab}
          onTabChange={setTab}
          isCurrent={isSameAsCurrent(data, selected)}
          dangerRestore={!!target.published}
          onRestore={() => setRestoring(selected)}
        />
      </div>

      {restoring && target.published && restoring.targetType === 'version' && (
        <PublishedConfirmModal
          pageName={target.published.pageName}
          clientName={target.published.clientName}
          versionNumber={target.published.versionNumber}
          current={target.published}
          next={restoring.snapshot}
          onConfirm={confirmRestore}
          onCancel={cancelRestore}
        />
      )}
      {restoring && !target.published && <RestoreModal number={restoring.number} onConfirm={confirmRestore} onCancel={cancelRestore} />}
    </>
  );
}
