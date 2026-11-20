import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { Layout } from './components/layout/Layout';
import { StoreProvider } from './store/StoreContext';
import { CrmPagesPage } from './pages/CrmPagesPage';
import { CrmPageDetailPage } from './pages/CrmPageDetailPage';
import { PromptsPage } from './pages/PromptsPage';
import { PromptEditPage } from './pages/PromptEditPage';
import { HistoryPage } from './pages/HistoryPage';

/** Rute sesuai UX-SPEC 3.1. Rute tidak dikenal diarahkan ke #/crm-pages. */
export function AppRoutes() {
  return (
    <ToastProvider>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/crm-pages" element={<CrmPagesPage />} />
            <Route path="/crm-pages/:pageId" element={<CrmPageDetailPage />} />
            <Route path="/riwayat/versi/:targetId" element={<HistoryPage targetType="version" />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/prompts/:promptId" element={<PromptEditPage />} />
            <Route path="/riwayat/prompt/:targetId" element={<HistoryPage targetType="prompt" />} />
            <Route path="*" element={<Navigate to="/crm-pages" replace />} />
          </Route>
        </Routes>
      </StoreProvider>
    </ToastProvider>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
