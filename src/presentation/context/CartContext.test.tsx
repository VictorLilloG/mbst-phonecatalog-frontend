import { renderHook, render, screen } from '@testing-library/react';
import { CartProvider, useCartContext } from './CartContext';

describe('CartProvider', () => {
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
