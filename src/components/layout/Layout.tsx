import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const DrawerContext = createContext<() => void>(() => {});

export function useOpenDrawer() {
  return useContext(DrawerContext);
}

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Memilih menu (pindah rute) menutup drawer.
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <DrawerContext.Provider value={() => setDrawerOpen(true)}>
      <div className="app">
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <div className={`drawer-overlay ${drawerOpen ? 'is-open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        <main className="main">
          <div className="content">
            <Outlet />
          </div>
        </main>
      </div>
    </DrawerContext.Provider>
  );
}
