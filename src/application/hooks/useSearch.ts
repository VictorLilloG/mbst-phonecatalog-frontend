'use client';

/**
 * Hook for search functionality.
 * Skeleton: to be implemented in the search feature phase.
 */
export function useSearch() {
  return {
    query: '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setQuery: (_q: string) => {},
    debouncedQuery: '',
    isSearching: false,
  };
}
