import type { CartItem } from '@/domain/models/CartItem';

const CART_STORAGE_KEY = 'mbst-cart';

/**
 * localStorage adapter for cart persistence.
 * Skeleton: full logic to be implemented in the cart feature phase.
 */
export const cartStorage = {
  getItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? (JSON.parse(data) as CartItem[]) : [];
    } catch {
      return [];
    }
  },

  saveItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  },

  clearItems(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_STORAGE_KEY);
  },
};
