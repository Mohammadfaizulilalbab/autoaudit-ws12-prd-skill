import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { DashboardVersion, UploadedFile } from '../types';
import { useStore } from '../store/StoreContext';
import { clientName, versionsOfPage } from '../store/selectors';
import { uploadVersionFile } from '../store/actions';
import { useToast } from '../components/common/Toast';
import { PageHeader } from '../components/layout/PageHeader';
import { VersionCard } from '../components/crm/VersionCard';
import { UploadSummaryModal } from '../components/crm/UploadSummaryModal';
import { PublishedConfirmModal } from '../components/crm/PublishedConfirmModal';
import { readFileAsText } from '../utils/file';
import { versionLabel } from '../utils/format';
import { sameFileMessage, uploadDoneMessage } from '../utils/messages';
import { EXTENSION_ERROR, hasDashboardExtension, validateDashboardContent } from '../utils/validation';
import { NotFound } from './NotFound';

interface PendingUpload {
  version: DashboardVersion;
  file: UploadedFile;
  trigger: HTMLButtonElement | null;
}

/** PAGE-02 Detail CRM Page dengan alur Upload (INTERACTION-SPEC 3). */
export function CrmPageDetailPage() {
  const { pageId } = useParams();
  const { data, commit } = useStore();
  const toast = useToast();
  const [pending, setPending] = useState<PendingUpload | null>(null);

  const page = data.pages.find((p) => p.id === pageId);
  if (!page) return <NotFound section="CRM Pages" listPath="/crm-pages" />;
  const versions = versionsOfPage(data, page.id);
  const client = clientName(data, page.clientId);

  const handleFileSelected = async (version: DashboardVersion, file: File, trigger: HTMLButtonElement | null) => {
    if (!hasDashboardExtension(file.name)) {
      toast('error', EXTENSION_ERROR);
      return;
    }
    let content: string;
    try {
      content = await readFileAsText(file);
    } catch {
      toast('error', 'File tidak bisa dibaca. Pilih ulang file dashboard.');
      return;
    }
    const error = validateDashboardContent(file.size, content);
    if (error) {
      toast('error', error);
      return;
    }
    if (content === version.fileContent) {
      toast('info', sameFileMessage(versionLabel(version.number)));
      return;
    }
    setPending({ version, file: { fileName: file.name, fileSize: file.size, fileContent: content }, trigger });
  };

  const confirm = (): boolean => {
    if (!pending) return false;
    const ok = commit(uploadVersionFile(data, pending.version.id, pending.file, new Date().toISOString()));
    if (ok) {
      toast('success', uploadDoneMessage(versionLabel(pending.version.number), pending.file.fileName));
      setPending(null);
    }
    return ok;
  };

  const cancel = () => setPending(null);

  return (
    <>
      <PageHeader title={page.name} crumbs={[{ label: 'CRM Pages', to: '/crm-pages' }, { label: page.name }]} />
      <p className="text-small">Client: {client}</p>
      <section className="card-list" aria-label="Daftar versi">
        {versions.map((v) => (
          <VersionCard key={v.id} version={v} onFileSelected={handleFileSelected} />
        ))}
      </section>

      {pending && pending.version.status === 'Published' && (
        <PublishedConfirmModal
          pageName={page.name}
          clientName={client}
          versionNumber={pending.version.number}
          current={pending.version}
          next={pending.file}
          onConfirm={confirm}
          onCancel={cancel}
          returnFocusTo={pending.trigger}
        />
      )}
      {pending && pending.version.status !== 'Published' && (
        <UploadSummaryModal
          pageName={page.name}
          versionText={versionLabel(pending.version.number)}
          status={pending.version.status}
          current={pending.version}
          next={pending.file}
          onConfirm={confirm}
          onCancel={cancel}
          returnFocusTo={pending.trigger}
        />
      )}
    </>
  );
}
