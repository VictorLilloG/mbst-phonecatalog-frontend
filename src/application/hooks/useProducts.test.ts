import { renderHook, act } from '@testing-library/react';
import { useProducts } from './useProducts';
import type { ProductSummary } from '@/domain/models/Product';

// jest.mock is hoisted above variable declarations, so the mock function
// must be created inside the factory and exposed via requireMock.
jest.mock('@/infrastructure/api/ProductApiRepository', () => {
  const mockGetProducts = jest.fn();
  return {
    ProductApiRepository: jest.fn().mockImplementation(() => ({ getProducts: mockGetProducts })),
    _mockGetProducts: mockGetProducts,
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetProducts: jest.Mock = (jest.requireMock('@/infrastructure/api/ProductApiRepository') as any)._mockGetProducts;

const initialProducts: ProductSummary[] = [
  { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'http://example.com/iphone.webp' },
];

const freshProducts: ProductSummary[] = [
  { id: '2', brand: 'Samsung', name: 'Galaxy S24', basePrice: 899, imageUrl: 'http://example.com/s24.webp' },
];

beforeEach(() => {
  mockGetProducts.mockClear();
});

describe('useProducts', () => {
  it('returns initialProducts as starting state', () => {
    const { result } = renderHook(() => useProducts(initialProducts));
    expect(result.current.products).toEqual(initialProducts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns empty array when no initial products are provided', () => {
    const { result } = renderHook(() => useProducts());
    expect(result.current.products).toEqual([]);
  });

  it('sets loading to true immediately while fetching', async () => {
    // Never resolves — lets us assert the loading state mid-flight
    mockGetProducts.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useProducts(initialProducts));

    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);
  });

  it('updates products and clears loading on successful refetch', async () => {
    mockGetProducts.mockResolvedValueOnce(freshProducts);
    const { result } = renderHook(() => useProducts(initialProducts));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.products).toEqual(freshProducts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error message and clears loading on failed refetch', async () => {
    mockGetProducts.mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useProducts(initialProducts));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('uses fallback message for non-Error rejections', async () => {
    mockGetProducts.mockRejectedValueOnce('unexpected failure');
    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe('Failed to fetch products');
  });

  it('passes search param through to repository', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useProducts(initialProducts));

    await act(async () => {
      await result.current.refetch({ search: 'Samsung' });
    });

    expect(mockGetProducts).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Samsung' }),
    );
  });

  it('always passes the default limit to repository', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockGetProducts).toHaveBeenCalledWith(
      expect.objectContaining({ limit: expect.any(Number) }),
    );
  });

  it('preserves existing products while loading a new refetch', async () => {
    mockGetProducts.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useProducts(initialProducts));

    act(() => {
      result.current.refetch();
    });

    expect(result.current.products).toEqual(initialProducts);
  });
});
