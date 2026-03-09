import type { ProductSummary } from '@/domain/models/Product';
import { ProductCard } from '../ProductCard/ProductCard';
import { LoadingOverlay } from './LoadingOverlay';
import styles from './ProductGrid.module.scss';

interface ProductGridProps {
  products: ProductSummary[];
  loading?: boolean;
}

/**
 * Responsive grid layout for product cards.
 * Mobile: 1 column, Tablet (>=768px): 2 columns, Desktop (>=1280px): 5 columns.
 */
export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (products.length === 0 && !loading) {
    return (
      <div className={styles.empty} role="status">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <LoadingOverlay visible={loading} />
      <div className={styles.grid} role="list" aria-label="Phone catalog">
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} role="listitem">
            <ProductCard product={product} priority={index < 4} />
          </div>
        ))}
      </div>
    </div>
  );
}
