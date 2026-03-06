'use client';

import { useState, useCallback } from 'react';
import type { ProductSummary } from '@/domain/models/Product';
import type { GetProductsParams } from '@/domain/repositories/ProductRepository';
import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';
import { DEFAULT_PRODUCT_LIMIT } from '@/lib/constants';

const repository = new ProductApiRepository();

interface UseProductsState {
  products: ProductSummary[];
  loading: boolean;
  error: string | null;
}

interface UseProductsResult extends UseProductsState {
  refetch: (params?: GetProductsParams) => Promise<void>;
}

/**
 * Hook for fetching products on the client side.
 * Initial data comes from SSR; refetch enables future search functionality.
 */
export function useProducts(initialProducts: ProductSummary[] = []): UseProductsResult {
  const [state, setState] = useState<UseProductsState>({
    products: initialProducts,
    loading: false,
    error: null,
  });

  const fetchProducts = useCallback(async (params?: GetProductsParams) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await repository.getProducts({
        limit: DEFAULT_PRODUCT_LIMIT,
        ...params,
      });
      setState({ products: data, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch products',
      }));
    }
  }, []);

  return {
    ...state,
    refetch: fetchProducts,
  };
}
