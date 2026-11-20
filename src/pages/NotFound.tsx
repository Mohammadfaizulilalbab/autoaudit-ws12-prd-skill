import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader, type Crumb } from '../components/layout/PageHeader';
import { NOT_FOUND_MESSAGE } from '../utils/messages';

/** Empty state untuk ID rute yang tidak ada (UX-SPEC 8). */
export function NotFound({ section, listPath }: { section: string; listPath: string }) {
  const crumbs: Crumb[] = [{ label: section, to: listPath }, { label: 'Data tidak ditemukan' }];
  return (
    <>
      <PageHeader title={section} crumbs={crumbs} />
      <EmptyState
        message={NOT_FOUND_MESSAGE}
        action={
          <Link className="btn btn-secondary" to={listPath}>
            Kembali ke daftar
          </Link>
        }
      />
    </>
  );
}
