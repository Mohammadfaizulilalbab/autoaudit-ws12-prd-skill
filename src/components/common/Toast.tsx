import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

type ShowToast = (kind: ToastKind, message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info } as const;
const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback<ShowToast>(
    (kind, message) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, kind, message }]);
      // Toast error tetap tampil sampai ditutup (DESIGN-SYSTEM 6.7).
      if (kind !== 'error') setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  const render = (filter: (t: ToastItem) => boolean) =>
    toasts.filter(filter).map((t) => {
      const Icon = ICONS[t.kind];
      return (
        <div key={t.id} className={`toast toast-${t.kind}`} data-testid={`toast-${t.kind}`}>
          <Icon size={20} aria-hidden="true" />
          <p className="toast-message">{t.message}</p>
          <button type="button" className="toast-close" aria-label="Tutup pesan" onClick={() => dismiss(t.id)}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      );
    });

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region">
        <div aria-live="assertive" role="alert" className="toast-stack">{render((t) => t.kind === 'error')}</div>
        <div aria-live="polite" role="status" className="toast-stack">{render((t) => t.kind !== 'error')}</div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast harus dipakai di dalam ToastProvider');
  return show;
}
