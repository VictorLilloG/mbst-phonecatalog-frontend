'use client';

import { useMemo } from 'react';
import { useCartContext } from '@/presentation/context/CartContext';

export function useCart() {
  const { items, totalCount, addItem, removeItem, clearCart } = useCartContext();

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    items,
    totalCount,
    totalPrice,
    addItem,
    removeItem,
    clearCart,
  };
}
