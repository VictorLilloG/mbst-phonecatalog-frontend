import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneListPage } from './PhoneListPage';
import type { ProductSummary } from '@/domain/models/Product';

const mockRefetch = jest.fn();

jest.mock('@/application/hooks/useProducts', () => ({
  useProducts: (initial: ProductSummary[]) => ({
    products: initial,
    loading: false,
    error: null,
    refetch: mockRefetch,
  }),
}));

jest.mock('@/presentation/context/CartContext', () => ({
  useCartContext: () => ({
    items: [],
    totalCount: 0,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
  }),
}));

const initialProducts: ProductSummary[] = [
  {
    id: '1',
    brand: 'Samsung',
    name: 'Galaxy S24',
    basePrice: 899,
    imageUrl: '/phone1.png',
  },
  {
    id: '2',
    brand: 'Apple',
    name: 'iPhone 15',
    basePrice: 999,
    imageUrl: '/phone2.png',
  },
];

beforeEach(() => {
  jest.useFakeTimers();
  mockRefetch.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('PhoneListPage', () => {
  it('renders the search bar and product grid', () => {
    render(<PhoneListPage initialProducts={initialProducts} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Phone catalog' })).toBeInTheDocument();
  });

  it('displays the correct results count', () => {
    render(<PhoneListPage initialProducts={initialProducts} />);

    expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
  });

  it('calls refetch with search param after debounce', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PhoneListPage initialProducts={initialProducts} />);

    // Initial mount triggers refetch with no search
    mockRefetch.mockClear();

    await user.type(screen.getByRole('searchbox'), 'Samsung');

    // Before debounce — no new refetch call
    expect(mockRefetch).not.toHaveBeenCalled();

    // After debounce fires
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledWith({ search: 'Samsung' });
    });
  });

  it('does not refetch on every keystroke', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PhoneListPage initialProducts={initialProducts} />);

    mockRefetch.mockClear();

    await user.type(screen.getByRole('searchbox'), 'ab');

    // No refetch during typing
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('calls refetch with undefined search when query is cleared', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PhoneListPage initialProducts={initialProducts} />);

    await user.type(screen.getByRole('searchbox'), 'test');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledWith({ search: 'test' });
    });

    mockRefetch.mockClear();

    await user.click(screen.getByRole('button', { name: /clear search/i }));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledWith({ search: undefined });
    });
  });
});
