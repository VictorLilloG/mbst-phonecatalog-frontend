import Image from 'next/image';
import type { ProductDetail, ColorOption, StorageOption } from '@/domain/models/Product';
import { ensureHttps, formatPrice } from '@/lib/utils';
import { ColorSelector } from '../ColorSelector/ColorSelector';
import { StorageSelector } from '../StorageSelector/StorageSelector';
import styles from './ProductDetailInfo.module.scss';

interface ProductDetailInfoProps {
  product: ProductDetail;
  selectedColor: ColorOption | null;
  selectedStorage: StorageOption | null;
  currentImageUrl: string;
  currentPrice: number;
  canAddToCart: boolean;
  onSelectColor: (color: ColorOption) => void;
  onSelectStorage: (storage: StorageOption) => void;
  onAddToCart: () => void;
}

/**
 * Product detail hero section: image on the left, configuration on the right.
 * Single Responsibility: layout and composition of product detail elements.
 */
export function ProductDetailInfo({
  product,
  selectedColor,
  selectedStorage,
  currentImageUrl,
  currentPrice,
  canAddToCart,
  onSelectColor,
  onSelectStorage,
  onAddToCart,
}: ProductDetailInfoProps) {
  return (
    <section className={styles.container} aria-label="Product details">
      <div className={styles.imageSection}>
        <Image
          src={ensureHttps(currentImageUrl)}
          alt={`${product.brand} ${product.name}`}
          fill
          className={styles.image}
          priority
          sizes="(max-width: 768px) 275px, (max-width: 1200px) 415px, 500px"
        />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.header}>
          <h1 className={styles.name}>{product.name.toUpperCase()}</h1>
          <span className={styles.price}>
            {selectedStorage ? '' : 'From '}
            {formatPrice(currentPrice)}
          </span>
        </div>

        <div className={styles.selectors}>
          <StorageSelector
            storageOptions={product.storageOptions}
            selectedStorage={selectedStorage}
            onSelect={onSelectStorage}
          />

          <ColorSelector
            colors={product.colorOptions}
            selectedColor={selectedColor}
            onSelect={onSelectColor}
          />
        </div>

        <button
          type="button"
          className={styles.addButton}
          disabled={!canAddToCart}
          onClick={onAddToCart}
          aria-label="Add to cart"
        >
          ADD
        </button>
      </div>
    </section>
  );
}
