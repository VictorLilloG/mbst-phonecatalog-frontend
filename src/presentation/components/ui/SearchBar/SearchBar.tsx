'use client';

import { useState } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

/**
 * Search input with underline style matching Figma design.
 * Visual only in this phase -- search logic to be added later.
 */
export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={styles.container}>
      <input
        type="search"
        className={styles.input}
        placeholder="Search for a smartphone..."
        value={query}
        onChange={handleChange}
        aria-label="Search for a smartphone"
        role="searchbox"
      />
    </div>
  );
}
