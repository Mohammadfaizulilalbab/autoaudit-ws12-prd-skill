import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { AppData } from '../types';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { CORRUPT_DATA_MESSAGE, RESET_DONE_MESSAGE, STORAGE_ERROR_MESSAGE } from '../utils/messages';
import { createSeedData } from './seed';
import { loadData, saveData } from './storage';

interface StoreValue {
  data: AppData;
  /** Menulis data ke localStorage lalu ke layar. Jika tulis gagal: toast error, layar tidak berubah, hasil false. */
  commit: (next: AppData) => boolean;
  /** Mengganti semua data dengan data contoh. */
  resetData: () => boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

type StoreState = { status: 'ready'; data: AppData } | { status: 'corrupt' };

function initialize(): { state: StoreState; seedSaveFailed: boolean } {
  const loaded = loadData();
  if (loaded.status === 'ok') return { state: { status: 'ready', data: loaded.data }, seedSaveFailed: false };
  if (loaded.status === 'corrupt') return { state: { status: 'corrupt' }, seedSaveFailed: false };
  const seed = createSeedData();
  return { state: { status: 'ready', data: seed }, seedSaveFailed: !saveData(seed) };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [init] = useState(initialize);
  const [state, setState] = useState<StoreState>(init.state);
  const warned = useRef(false);

  useEffect(() => {
    if (init.seedSaveFailed && !warned.current) {
      warned.current = true;
      toast('error', STORAGE_ERROR_MESSAGE);
    }
  }, [init.seedSaveFailed, toast]);

  const commit = useCallback(
    (next: AppData) => {
      if (!saveData(next)) {
        toast('error', STORAGE_ERROR_MESSAGE);
        return false;
      }
      setState({ status: 'ready', data: next });
      return true;
    },
    [toast],
  );

  const resetData = useCallback(() => {
    const ok = commit(createSeedData());
    if (ok) toast('success', RESET_DONE_MESSAGE);
    return ok;
  }, [commit, toast]);

  if (state.status === 'corrupt') {
    return (
      <main className="fullscreen-message">
        <div className="card empty-state" role="alert">
          <p>{CORRUPT_DATA_MESSAGE}</p>
          <Button variant="primary" onClick={resetData}>
            Atur ulang data contoh
          </Button>
        </div>
      </main>
    );
  }

  return <StoreContext.Provider value={{ data: state.data, commit, resetData }}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore harus dipakai di dalam StoreProvider');
  return value;
}
