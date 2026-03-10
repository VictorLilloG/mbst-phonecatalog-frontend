import { renderHook, act, render, screen } from '@testing-library/react';
import { CartProvider, useCartContext } from './CartContext';
import { cartStorage } from '@/infrastructure/storage/cartStorage';
import type { CartItem } from '@/domain/models/CartItem';

jest.mock('@/infrastructure/storage/cartStorage', () => ({
  cartStorage: {
    getItems: jest.fn(() => []),
    saveItems: jest.fn(),
    clearItems: jest.fn(),
  },
}));

const mockCartItem: CartItem = {
  productId: 'TEST-001',
  name: 'Test Phone',
  brand: 'TestBrand',
  imageUrl: 'http://example.com/phone.webp',
  selectedColor: 'Black',
  selectedStorage: '128 GB',
  price: 499,
  quantity: 1,
};

describe('CartProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cartStorage.getItems as jest.Mock).mockReturnValue([]);
  });

  it('renders children without throwing', () => {
    render(
      <CartProvider>
        <span>child content</span>
      </CartProvider>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('provides an empty items array by default', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    expect(result.current.items).toEqual([]);
  });

  it('provides totalCount of 0 by default', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    expect(result.current.totalCount).toBe(0);
  });

  it('exposes addItem, removeItem, and clearCart functions', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.removeItem).toBe('function');
    expect(typeof result.current.clearCart).toBe('function');
  });

  it('loads items from storage on mount', async () => {
    (cartStorage.getItems as jest.Mock).mockReturnValue([mockCartItem]);
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    await act(async () => {});
    expect(result.current.items).toEqual([mockCartItem]);
    expect(result.current.totalCount).toBe(1);
  });

  it('adds a new item and persists to storage', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    act(() => {
      result.current.addItem(mockCartItem);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockCartItem);
    expect(result.current.totalCount).toBe(1);
    expect(cartStorage.saveItems).toHaveBeenCalledWith([mockCartItem]);
  });

  it('increments quantity when adding duplicate item (same product, color, storage)', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    act(() => {
      result.current.addItem(mockCartItem);
    });
    act(() => {
      result.current.addItem(mockCartItem);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalCount).toBe(2);
  });

  it('adds separate entries for different variants of the same product', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    act(() => {
      result.current.addItem(mockCartItem);
    });
    act(() => {
      result.current.addItem({ ...mockCartItem, selectedStorage: '256 GB', price: 599 });
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalCount).toBe(2);
  });

  it('removes item by composite key and persists', async () => {
    (cartStorage.getItems as jest.Mock).mockReturnValue([mockCartItem]);
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    await act(async () => {});
    act(() => {
      result.current.removeItem('TEST-001', 'Black', '128 GB');
    });
    expect(result.current.items).toHaveLength(0);
    expect(cartStorage.saveItems).toHaveBeenCalledWith([]);
  });

  it('only removes the matching variant when removing', async () => {
    const variant = { ...mockCartItem, selectedStorage: '256 GB', price: 599 };
    (cartStorage.getItems as jest.Mock).mockReturnValue([mockCartItem, variant]);
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    await act(async () => {});
    act(() => {
      result.current.removeItem('TEST-001', 'Black', '128 GB');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].selectedStorage).toBe('256 GB');
  });

  it('clears all items and persists', async () => {
    (cartStorage.getItems as jest.Mock).mockReturnValue([mockCartItem]);
    const { result } = renderHook(() => useCartContext(), { wrapper: CartProvider });
    await act(async () => {});
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
    expect(cartStorage.clearItems).toHaveBeenCalled();
  });
});

describe('useCartContext', () => {
  it('throws when used outside CartProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCartContext())).toThrow(
      'useCartContext must be used within a CartProvider',
    );
    consoleError.mockRestore();
  });
});
