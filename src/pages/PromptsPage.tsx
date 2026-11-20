import { Link } from 'react-router-dom';
import type { SavedPrompt } from '../types';
import { useStore } from '../store/StoreContext';
import { auditsForPrompt } from '../store/selectors';
import { DataTable, type Column } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/layout/PageHeader';
import { formatDateTime } from '../utils/format';

/** PAGE-03 Daftar Saved Prompt. */
export function PromptsPage() {
  const { data } = useStore();
  const prompts = data.prompts.filter((p) => p.clientId === data.selectedClientId);

  const columns: Column<SavedPrompt>[] = [
    { header: 'ID prompt', cell: (p) => <span className="mono">{p.id}</span> },
    { header: 'Nama', cell: (p) => <Link className="row-link" to={`/prompts/${p.id}`}>{p.name}</Link> },
    {
      header: 'Dipakai oleh',
      cell: (p) => {
        const count = auditsForPrompt(data, p.id).length;
        return count > 0 ? `${count} audit` : <span className="text-muted">Tidak dipakai audit</span>;
      },
    },
    { header: 'Diubah terakhir', cell: (p) => formatDateTime(p.updatedAt) },
  ];

  return (
    <>
      <PageHeader title="Saved Prompt" crumbs={[{ label: 'Saved Prompt' }]} />
      {prompts.length === 0 ? (
        <EmptyState message="Client ini belum punya Saved Prompt." />
      ) : (
        <DataTable caption="Daftar Saved Prompt" columns={columns} rows={prompts} rowKey={(p) => p.id} rowHref={(p) => `/prompts/${p.id}`} />
      )}
    </>
  );
}
