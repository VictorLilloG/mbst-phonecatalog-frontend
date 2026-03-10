import { renderHook } from '@testing-library/react';
import { useCart } from './useCart';
import { useCartContext } from '@/presentation/context/CartContext';
import type { CartItem } from '@/domain/models/CartItem';

jest.mock('@/presentation/context/CartContext');

const mockUseCartContext = useCartContext as jest.MockedFunction<typeof useCartContext>;

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  productId: '1',
  name: 'Phone',
  brand: 'Brand',
  imageUrl: '',
  selectedColor: 'Red',
  selectedStorage: '128 GB',
  price: 100,
  quantity: 1,
  ...overrides,
});

describe('useCart', () => {
  it('computes totalPrice as sum of price * quantity for all items', () => {
    mockUseCartContext.mockReturnValue({
      items: [
        makeItem({ price: 100, quantity: 2 }),
        makeItem({ productId: '2', price: 200, quantity: 1 }),
      ],
      totalCount: 3,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    });

    const { result } = renderHook(() => useCart());
    expect(result.current.totalPrice).toBe(400);
    expect(result.current.totalCount).toBe(3);
  });

  it('returns totalPrice 0 when cart is empty', () => {
    mockUseCartContext.mockReturnValue({
      items: [],
      totalCount: 0,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    });

    const { result } = renderHook(() => useCart());
    expect(result.current.totalPrice).toBe(0);
  });

  it('delegates addItem, removeItem, and clearCart to context', () => {
    const addItem = jest.fn();
    const removeItem = jest.fn();
    const clearCart = jest.fn();

    mockUseCartContext.mockReturnValue({
      items: [],
      totalCount: 0,
      addItem,
      removeItem,
      clearCart,
    });

    const { result } = renderHook(() => useCart());
    expect(result.current.addItem).toBe(addItem);
    expect(result.current.removeItem).toBe(removeItem);
    expect(result.current.clearCart).toBe(clearCart);
  });
});
