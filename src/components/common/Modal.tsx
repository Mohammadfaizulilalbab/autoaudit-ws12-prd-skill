import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions: ReactNode;
  /** Elemen yang menerima fokus saat modal ditutup; bawaan: elemen yang fokus saat modal dibuka. */
  returnFocusTo?: HTMLElement | null;
}

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';

/** Dialog dasar: fokus terkunci di dalam, Esc menutup, fokus kembali ke tombol pemicu (DESIGN-SYSTEM 10.3). */
export function Modal({ title, onClose, children, actions, returnFocusTo }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = returnFocusTo ?? (document.activeElement as HTMLElement | null);
    const dialog = dialogRef.current;
    const initial = dialog?.querySelector<HTMLElement>('[data-autofocus]') ?? dialog?.querySelector<HTMLElement>(FOCUSABLE);
    initial?.focus();
    return () => {
      if (trigger && trigger !== document.body && trigger.isConnected) trigger.focus();
    };
    // Hanya dijalankan saat modal dibuka dan ditutup.
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Portal ke body agar overlay fixed tidak terkurung elemen ber-transform (drawer).
  return createPortal(
    <div
      className="modal-overlay"
      onKeyDown={handleKeyDown}
      // Klik di luar dialog tidak memindahkan fokus keluar modal.
      onMouseDown={(e) => e.target === e.currentTarget && e.preventDefault()}
    >
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2>
        {children}
        <div className="modal-actions">{actions}</div>
      </div>
    </div>,
    document.body,
  );
}
