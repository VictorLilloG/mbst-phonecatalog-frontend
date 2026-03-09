import Image from 'next/image';
import type { CartItem } from '@/domain/models/CartItem';
import { ensureHttps, formatPrice } from '@/lib/utils';
import styles from './CartItemCard.module.scss';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (productId: string, selectedColor: string, selectedStorage: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <article className={styles.cartItem} aria-label={`${item.name} in cart`}>
      <div className={styles.imageContainer}>
        <Image
          src={ensureHttps(item.imageUrl)}
          alt={`${item.brand} ${item.name}`}
          width={300}
          height={300}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.details}>
          <span className={styles.name}>{item.name.toUpperCase()}</span>
          <span className={styles.variant}>
            {item.selectedStorage} | {item.selectedColor.toUpperCase()}
          </span>
          <span className={styles.price}>{formatPrice(item.price)}</span>
        </div>

        <button
          type="button"
          className={styles.removeButton}
          onClick={() => onRemove(item.productId, item.selectedColor, item.selectedStorage)}
          aria-label={`Remove ${item.name} from cart`}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
