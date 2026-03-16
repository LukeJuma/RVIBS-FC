import { useEffect, useState } from 'react';
import { dataStore } from '../store/data-store';

let initialized = false;

export function useDataStore() {
  const [loading, setLoading] = useState(!initialized);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    dataStore.initStaticData();

    if (!initialized) {
      dataStore.load().then(() => {
        initialized = true;
        setLoading(false);
      }).catch(() => setLoading(false));
    }

    const unsubscribe = dataStore.subscribe(() => forceUpdate({}));
    return unsubscribe;
  }, []);

  return { store: dataStore, loading };
}
