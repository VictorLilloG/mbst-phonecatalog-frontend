import styles from './PageLayout.module.scss';

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * Main content wrapper providing consistent min-height.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return <main className={styles.main}>{children}</main>;
}
