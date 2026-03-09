'use client';

import Link from 'next/link';
import { useCart } from '@/application/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Navbar } from '@/presentation/components/layout/Navbar/Navbar';
import { CartItemCard } from '@/presentation/components/cart/CartItemCard/CartItemCard';
import styles from './CartPage.module.scss';

export function CartPage() {
  const { items, totalCount, totalPrice, removeItem, clearCart } = useCart();

  const handlePay = () => {
    clearCart();
  };

  return (
    <>
      <Navbar fullWidthSubHeader hideCart>
        <div className={styles.divider} />
      </Navbar>
      <main className={styles.page}>
        <h1 className={styles.title}>CART ({totalCount})</h1>

        {items.length === 0 ? (
          <p className={styles.emptyMessage}>Your cart is empty.</p>
        ) : (
          <div className={styles.itemList}>
            {items.map((item) => (
              <CartItemCard
                key={`${item.productId}-${item.selectedColor}-${item.selectedStorage}`}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/" className={styles.continueShopping}>
            CONTINUE SHOPPING
          </Link>

          {items.length > 0 && (
            <>
              <div className={styles.totalLine}>
                <span className={styles.totalLabel}>TOTAL</span>
                <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
              </div>

              <button type="button" className={styles.payButton} onClick={handlePay}>
                PAY
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
