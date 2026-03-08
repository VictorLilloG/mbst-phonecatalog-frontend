'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ProductDetail, ColorOption, StorageOption } from '@/domain/models/Product';

interface UseProductDetailReturn {
  selectedColor: ColorOption | null;
  selectedStorage: StorageOption | null;
  currentImageUrl: string;
  currentPrice: number;
  canAddToCart: boolean;
  selectColor: (color: ColorOption) => void;
  selectStorage: (storage: StorageOption) => void;
}

/**
 * Manages product detail state: color/storage selection, price computation, and image switching.
 * Single Responsibility: encapsulates product configuration logic.
 */
export function useProductDetail(product: ProductDetail): UseProductDetailReturn {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);

  const currentImageUrl = useMemo(
    () => selectedColor?.imageUrl ?? product.imageUrl ?? product.colorOptions[0]?.imageUrl ?? '',
    [selectedColor, product.imageUrl, product.colorOptions],
  );

  const currentPrice = useMemo(
    () => selectedStorage?.price ?? product.basePrice,
    [selectedStorage, product.basePrice],
  );

  const canAddToCart = selectedColor !== null && selectedStorage !== null;

  const selectColor = useCallback((color: ColorOption) => {
    setSelectedColor(color);
  }, []);

  const selectStorage = useCallback((storage: StorageOption) => {
    setSelectedStorage(storage);
  }, []);

  return {
    selectedColor,
    selectedStorage,
    currentImageUrl,
    currentPrice,
    canAddToCart,
    selectColor,
    selectStorage,
  };
}
