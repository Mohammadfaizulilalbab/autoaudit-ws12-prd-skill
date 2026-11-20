import { Link } from 'react-router-dom';
import type { CrmPage } from '../types';
import { useStore } from '../store/StoreContext';
import { versionsOfPage } from '../store/selectors';
import { DataTable, type Column } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/layout/PageHeader';
import { formatDateTime, versionLabel } from '../utils/format';

/** PAGE-01 Daftar CRM Pages. */
export function CrmPagesPage() {
  const { data } = useStore();
  const pages = data.pages.filter((p) => p.clientId === data.selectedClientId);

  const columns: Column<CrmPage>[] = [
    { header: 'Nama', cell: (p) => <Link className="row-link" to={`/crm-pages/${p.id}`}>{p.name}</Link> },
    { header: 'Jumlah versi', cell: (p) => `${versionsOfPage(data, p.id).length} versi` },
    {
      header: 'Versi Published',
      cell: (p) => {
        const published = versionsOfPage(data, p.id).find((v) => v.status === 'Published');
        return published ? versionLabel(published.number) : <span className="text-muted">Tidak ada</span>;
      },
    },
    {
      header: 'Diubah terakhir',
      cell: (p) => {
        const latest = versionsOfPage(data, p.id).map((v) => v.updatedAt).sort().pop();
        return latest ? formatDateTime(latest) : '-';
      },
    },
  ];

  return (
    <>
      <PageHeader title="CRM Pages" crumbs={[{ label: 'CRM Pages' }]} />
      {pages.length === 0 ? (
        <EmptyState message="Client ini belum punya CRM Page." />
      ) : (
        <DataTable caption="Daftar CRM Page" columns={columns} rows={pages} rowKey={(p) => p.id} rowHref={(p) => `/crm-pages/${p.id}`} />
      )}
    </>
  );
}
