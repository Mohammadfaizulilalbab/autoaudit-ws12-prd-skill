import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '../common/Button';
import { useOpenDrawer } from './Layout';

export interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
  const openDrawer = useOpenDrawer();
  return (
    <header className="page-header">
      <Button variant="secondary" className="menu-button icon-button" aria-label="Buka menu" onClick={openDrawer} icon={<Menu size={20} aria-hidden="true" />} />
      <div className="page-header-text">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c) => (
              <li key={c.label}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
        <h1>{title}</h1>
      </div>
      <span className="user-name">Raka Pradipta</span>
    </header>
  );
}
