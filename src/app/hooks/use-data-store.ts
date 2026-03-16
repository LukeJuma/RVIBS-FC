import { useEffect, useState } from 'react';
import { dataStore } from '../store/data-store';

let initialized = false;
let initPromise: Promise<void> | null = null;

export function useDataStore() {
  const [loading, setLoading] = useState(!initialized);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    dataStore.initStaticData();

    if (!initialized) {
      if (!initPromise) {
        initPromise = dataStore.load()
          .then(() => { initialized = true; })
          .catch((err) => {
            console.error('Failed to load data from Supabase:', err);
            initialized = true; // still mark done so UI renders with empty state
          })
          .finally(() => { setLoading(false); });
      } else {
        // Another component already kicked off the load — just wait for it
        initPromise.finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }

    const unsubscribe = dataStore.subscribe(() => forceUpdate({}));
    return unsubscribe;
  }, []);

  return { store: dataStore, loading };
}
