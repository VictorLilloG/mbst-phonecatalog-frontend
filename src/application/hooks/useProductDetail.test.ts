import { renderHook, act } from '@testing-library/react';
import { useProductDetail } from './useProductDetail';
import type { ProductDetail } from '@/domain/models/Product';

const mockProduct: ProductDetail = {
  id: 'TEST-001',
  brand: 'TestBrand',
  name: 'Test Phone',
  description: 'A test phone',
  basePrice: 499,
  rating: 4.5,
  imageUrl: 'http://example.com/default.webp',
  specs: {
    screen: '6.5"',
    resolution: 'FHD+',
    processor: 'Test Chip',
    mainCamera: '48 MP',
    selfieCamera: '12 MP',
    battery: '4500 mAh',
    os: 'Android',
    screenRefreshRate: '120 Hz',
  },
  colorOptions: [
    { name: 'Red', hexCode: '#FF0000', imageUrl: 'http://example.com/red.webp' },
    { name: 'Blue', hexCode: '#0000FF', imageUrl: 'http://example.com/blue.webp' },
  ],
  storageOptions: [
    { capacity: '128 GB', price: 499 },
    { capacity: '256 GB', price: 599 },
  ],
  similarProducts: [],
};

describe('useProductDetail', () => {
  it('returns null for selectedColor and selectedStorage initially', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    expect(result.current.selectedColor).toBeNull();
    expect(result.current.selectedStorage).toBeNull();
  });

  it('uses product imageUrl when no color is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    expect(result.current.currentImageUrl).toBe('http://example.com/default.webp');
  });

  it('uses product basePrice when no storage is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    expect(result.current.currentPrice).toBe(499);
  });

  it('canAddToCart is false when nothing is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    expect(result.current.canAddToCart).toBe(false);
  });

  it('updates image when a color is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    act(() => {
      result.current.selectColor(mockProduct.colorOptions[0]);
    });
    expect(result.current.currentImageUrl).toBe('http://example.com/red.webp');
    expect(result.current.selectedColor?.name).toBe('Red');
  });

  it('updates price when a storage is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    act(() => {
      result.current.selectStorage(mockProduct.storageOptions[1]);
    });
    expect(result.current.currentPrice).toBe(599);
    expect(result.current.selectedStorage?.capacity).toBe('256 GB');
  });

  it('canAddToCart is true when both color and storage are selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    act(() => {
      result.current.selectColor(mockProduct.colorOptions[0]);
      result.current.selectStorage(mockProduct.storageOptions[0]);
    });
    expect(result.current.canAddToCart).toBe(true);
  });

  it('canAddToCart remains false when only color is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    act(() => {
      result.current.selectColor(mockProduct.colorOptions[0]);
    });
    expect(result.current.canAddToCart).toBe(false);
  });

  it('canAddToCart remains false when only storage is selected', () => {
    const { result } = renderHook(() => useProductDetail(mockProduct));
    act(() => {
      result.current.selectStorage(mockProduct.storageOptions[0]);
    });
    expect(result.current.canAddToCart).toBe(false);
  });

  it('falls back to first colorOption imageUrl when product has no imageUrl', () => {
    const productWithoutImage = {
      ...mockProduct,
      imageUrl: undefined as unknown as string,
    };
    const { result } = renderHook(() => useProductDetail(productWithoutImage));
    expect(result.current.currentImageUrl).toBe('http://example.com/red.webp');
  });
});
