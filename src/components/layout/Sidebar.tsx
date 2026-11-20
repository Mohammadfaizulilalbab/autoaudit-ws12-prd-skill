import { useState, type ChangeEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, RefreshCcw, X } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../common/Button';
import { ResetDataModal } from './ResetDataModal';

/** Menu aktif ditentukan dari rute, termasuk halaman riwayat. */
export function activeSection(pathname: string): 'prompts' | 'crm-pages' {
  return pathname.startsWith('/prompts') || pathname.startsWith('/riwayat/prompt') ? 'prompts' : 'crm-pages';
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, commit } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [resetOpen, setResetOpen] = useState(false);
  const section = activeSection(pathname);

  const changeClient = (e: ChangeEvent<HTMLSelectElement>) => {
    if (commit({ ...data, selectedClientId: e.target.value })) navigate(`/${section}`);
  };

  const navProps = (key: 'crm-pages' | 'prompts') => ({
    to: `/${key}`,
    className: `nav-item ${section === key ? 'is-active' : ''}`,
    'aria-current': section === key ? ('page' as const) : undefined,
  });

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Navigasi utama">
      <div className="sidebar-header">
        <span className="sidebar-logo">AutoAudit</span>
        <Button variant="ghost" className="sidebar-close icon-button" aria-label="Tutup menu" onClick={onClose} icon={<X size={20} aria-hidden="true" />} />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="client-select">
          Client
        </label>
        <select id="client-select" className="select" value={data.selectedClientId} onChange={changeClient}>
          {data.clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <nav className="sidebar-nav">
        <Link {...navProps('crm-pages')}>
          <LayoutDashboard size={20} aria-hidden="true" />
          CRM Pages
        </Link>
        <Link {...navProps('prompts')}>
          <MessageSquareText size={20} aria-hidden="true" />
          Saved Prompt
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="nav-item" onClick={() => setResetOpen(true)}>
          <RefreshCcw size={20} aria-hidden="true" />
          Atur ulang data contoh
        </button>
      </div>

      {resetOpen && <ResetDataModal onClose={() => setResetOpen(false)} onDone={onClose} />}
    </aside>
  );
}
