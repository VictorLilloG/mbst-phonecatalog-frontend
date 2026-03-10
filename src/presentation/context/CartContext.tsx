'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/domain/models/CartItem';
import { cartStorage } from '@/infrastructure/storage/cartStorage';

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedColor: string, selectedStorage: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartStorage.getItems());
  }, []);

  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedStorage === newItem.selectedStorage,
      );

      let updated: CartItem[];
      if (existingIndex >= 0) {
        updated = prev.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item,
        );
      } else {
        updated = [...prev, newItem];
      }

      cartStorage.saveItems(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, selectedColor: string, selectedStorage: string) => {
      setItems((prev) => {
        const updated = prev.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.selectedColor === selectedColor &&
              item.selectedStorage === selectedStorage
            ),
        );
        cartStorage.saveItems(updated);
        return updated;
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    cartStorage.clearItems();
  }, []);

  const value: CartContextValue = { items, totalCount, addItem, removeItem, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
