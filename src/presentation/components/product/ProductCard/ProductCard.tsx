import Link from 'next/link';
import Image from 'next/image';
import type { ProductSummary } from '@/domain/models/Product';
import { ensureHttps, formatPrice } from '@/lib/utils';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: ProductSummary;
}

/**
 * Individual phone card displaying image, brand, name, and price.
 * Clicking navigates to the product detail page.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={styles.card}
      aria-label={`View details for ${product.brand} ${product.name}, ${formatPrice(product.basePrice)}`}
    >
      <div className={styles.imageContainer}>
        <Image
          src={ensureHttps(product.imageUrl)}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 20vw"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.brand}>{product.brand.toUpperCase()}</span>
        <div className={styles.namePrice}>
          <span className={styles.name}>{product.name.toUpperCase()}</span>
          <span className={styles.price}>{formatPrice(product.basePrice)}</span>
        </div>
      </div>
    </Link>
  );
}
