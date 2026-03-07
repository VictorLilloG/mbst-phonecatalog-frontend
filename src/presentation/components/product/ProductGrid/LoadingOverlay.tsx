import styles from './LoadingOverlay.module.scss';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className={styles.overlay} role="status" aria-label="Loading products">
      <div className={styles.spinner} />
    </div>
  );
}
