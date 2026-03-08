import type { ProductSpecs as ProductSpecsType } from '@/domain/models/Product';
import styles from './ProductSpecs.module.scss';

interface ProductSpecsProps {
  brand: string;
  name: string;
  description: string;
  specs: ProductSpecsType;
}

const SPEC_LABELS: Record<keyof ProductSpecsType, string> = {
  screen: 'Screen',
  resolution: 'Resolution',
  processor: 'Processor',
  mainCamera: 'Main camera',
  selfieCamera: 'Selfie camera',
  battery: 'Battery',
  os: 'OS',
  screenRefreshRate: 'Screen refresh rate',
};

/**
 * Display table of product specifications including brand, name, and description.
 * Open/Closed: add new spec fields by extending SPEC_LABELS.
 */
export function ProductSpecs({ brand, name, description, specs }: ProductSpecsProps) {
  const specEntries = Object.entries(SPEC_LABELS) as [keyof ProductSpecsType, string][];

  return (
    <section className={styles.container} aria-label="Specifications">
      <h2 className={styles.title}>SPECIFICATIONS</h2>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt className={styles.label}>Brand</dt>
          <dd className={styles.value}>{brand}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Name</dt>
          <dd className={styles.value}>{name}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Description</dt>
          <dd className={styles.value}>{description}</dd>
        </div>
        {specEntries.map(([key, label]) => (
          <div key={key} className={styles.row}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{specs[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
