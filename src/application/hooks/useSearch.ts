'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 1000;

interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  const handleSetQuery = useCallback((q: string) => {
    setQuery(q);
  }, []);

  return {
    query,
    setQuery: handleSetQuery,
    debouncedQuery,
  };
}
