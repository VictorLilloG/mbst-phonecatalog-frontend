'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const updateQuery = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuery(e.target.value);
  };

  const handleClear = () => {
    updateQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Search for a smartphone..."
        value={query}
        onChange={handleChange}
        aria-label="Search for a smartphone"
        role="searchbox"
      />
      {query.length > 0 && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <Image
            src="/close-icon.svg"
            alt=""
            width={7.5}
            height={7.5}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
