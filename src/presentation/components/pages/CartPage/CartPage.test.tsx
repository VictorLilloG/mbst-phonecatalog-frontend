import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartPage } from './CartPage';
import { useCart } from '@/application/hooks/useCart';
import { useCartContext } from '@/presentation/context/CartContext';
import type { CartItem } from '@/domain/models/CartItem';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('@/application/hooks/useCart');
jest.mock('@/presentation/context/CartContext');

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockUseCartContext = useCartContext as jest.MockedFunction<typeof useCartContext>;

const mockRemoveItem = jest.fn();
const mockClearCart = jest.fn();

const cartContextDefault = {
  items: [],
  totalCount: 0,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
};

const mockItem: CartItem = {
  productId: 'TEST-1',
  name: 'Test Phone',
  brand: 'TestBrand',
  imageUrl: 'http://example.com/img.webp',
  selectedColor: 'Red',
  selectedStorage: '128 GB',
  price: 499,
  quantity: 1,
};

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCartContext.mockReturnValue(cartContextDefault);
  });

  it('renders CART title with item count', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.getByText('CART (0)')).toBeInTheDocument();
  });

  it('renders empty state message when no items', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('renders cart items when present', () => {
    mockUseCart.mockReturnValue({
      items: [mockItem],
      totalCount: 1,
      totalPrice: 499,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.getByText('CART (1)')).toBeInTheDocument();
    expect(screen.getByText('TEST PHONE')).toBeInTheDocument();
  });

  it('renders CONTINUE SHOPPING link pointing to home', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    const link = screen.getByText('CONTINUE SHOPPING');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders total price and PAY button when items exist', () => {
    mockUseCart.mockReturnValue({
      items: [mockItem],
      totalCount: 1,
      totalPrice: 499,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getAllByText('499 EUR')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /pay/i })).toBeInTheDocument();
  });

  it('clears cart when PAY is clicked', async () => {
    const user = userEvent.setup();
    mockUseCart.mockReturnValue({
      items: [mockItem],
      totalCount: 1,
      totalPrice: 499,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    await user.click(screen.getByRole('button', { name: /pay/i }));
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('does not render PAY button when cart is empty', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.queryByRole('button', { name: /pay/i })).not.toBeInTheDocument();
  });

  it('does not render TOTAL when cart is empty', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.queryByText('TOTAL')).not.toBeInTheDocument();
  });

  it('does not show cart icon in the header', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    });
    render(<CartPage />);
    expect(screen.queryByLabelText(/Shopping cart/i)).not.toBeInTheDocument();
  });
});
