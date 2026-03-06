'use client';

/**
 * Hook for cart operations.
 * Skeleton: to be implemented in the cart feature phase.
 */
export function useCart() {
  return {
    items: [] as const,
    totalCount: 0,
    totalPrice: 0,
    addItem: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeItem: (_productId: string) => {},
    clearCart: () => {},
  };
}
