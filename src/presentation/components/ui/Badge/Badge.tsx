import styles from './Badge.module.scss';

interface BadgeProps {
  count: number;
  ariaLabel?: string;
}

/**
 * Numeric badge for the cart icon.
 */
export function Badge({ count, ariaLabel }: BadgeProps) {
  return (
    <span className={styles.badge} aria-label={ariaLabel}>
      {count}
    </span>
  );
}
