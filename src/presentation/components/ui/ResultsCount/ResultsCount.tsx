import styles from './ResultsCount.module.scss';

interface ResultsCountProps {
  count: number;
}

/**
 * Displays the number of search results (e.g., "20 RESULTS").
 */
export function ResultsCount({ count }: ResultsCountProps) {
  return (
    <div className={styles.container}>
      <p className={styles.text} aria-live="polite">
        {count} RESULTS
      </p>
    </div>
  );
}
