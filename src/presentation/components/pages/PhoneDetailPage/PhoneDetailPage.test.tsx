import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneDetailPage } from './PhoneDetailPage';
import type { ProductDetail } from '@/domain/models/Product';
import { useCart } from '@/application/hooks/useCart';
import { useCartContext } from '@/presentation/context/CartContext';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img data-priority={priority} {...props} />;
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

const mockAddItem = jest.fn();
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockUseCartContext = useCartContext as jest.MockedFunction<typeof useCartContext>;

const mockProduct: ProductDetail = {
  id: 'OPP-R11F',
  brand: 'OPPO',
  name: 'Reno 11 F',
  description: 'A great smartphone',
  basePrice: 269,
  rating: 4.7,
  imageUrl: 'http://example.com/default.webp',
  specs: {
    screen: '6.7" AMOLED FHD+',
    resolution: 'FHD+',
    processor: 'MediaTek Dimensity 7050',
    mainCamera: '64 MP',
    selfieCamera: '32 MP',
    battery: '5000 mAh',
    os: 'Android',
    screenRefreshRate: '120 Hz',
  },
  colorOptions: [
    { name: 'Green', hexCode: '#008000', imageUrl: 'http://example.com/green.webp' },
    { name: 'Blue', hexCode: '#0000FF', imageUrl: 'http://example.com/blue.webp' },
  ],
  storageOptions: [{ capacity: '256 GB', price: 269 }],
  similarProducts: [
    {
      id: 'SMG-S23FE',
      brand: 'Samsung',
      name: 'Galaxy S23 FE',
      basePrice: 699,
      imageUrl: 'http://example.com/s23.webp',
    },
  ],
};

describe('PhoneDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddItem.mockClear();
    mockUseCart.mockReturnValue({
      items: [],
      totalCount: 0,
      totalPrice: 0,
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    });
    mockUseCartContext.mockReturnValue({
      items: [],
      totalCount: 0,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    });
  });

  it('renders the back link to home', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    const links = screen.getAllByRole('link');
    const backLink = links.find((link) => link.textContent?.includes('BACK'));
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders the product brand in specifications', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByText('OPPO')).toBeInTheDocument();
  });

  it('renders the product name in uppercase', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByText('RENO 11 F')).toBeInTheDocument();
  });

  it('renders the base price initially', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByText('From 269 EUR')).toBeInTheDocument();
  });

  it('renders specifications section', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByText('SPECIFICATIONS')).toBeInTheDocument();
  });

  it('renders similar products section', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByText('SIMILAR ITEMS')).toBeInTheDocument();
  });

  it('disables add button when nothing is selected', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('enables add button when both color and storage are selected', async () => {
    const user = userEvent.setup();
    render(<PhoneDetailPage product={mockProduct} />);

    await user.click(screen.getByLabelText('Green'));
    await user.click(screen.getByLabelText('256 GB for 269 EUR'));

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeEnabled();
  });

  it('updates displayed image when a color is selected', async () => {
    const user = userEvent.setup();
    render(<PhoneDetailPage product={mockProduct} />);

    await user.click(screen.getByLabelText('Blue'));

    const image = screen.getByAltText('OPPO Reno 11 F');
    expect(image).toHaveAttribute('src', 'https://example.com/blue.webp');
  });

  it('selections persist and button stays enabled after clicking add to cart', async () => {
    const user = userEvent.setup();
    render(<PhoneDetailPage product={mockProduct} />);

    await user.click(screen.getByLabelText('Green'));
    await user.click(screen.getByLabelText('256 GB for 269 EUR'));

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    expect(addButton).toBeEnabled();
  });

  it('renders color and storage selectors', () => {
    render(<PhoneDetailPage product={mockProduct} />);
    expect(screen.getByRole('radiogroup', { name: /color options/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /storage options/i })).toBeInTheDocument();
  });

  it('calls addItem with correct CartItem when add to cart is clicked', async () => {
    const user = userEvent.setup();
    render(<PhoneDetailPage product={mockProduct} />);

    await user.click(screen.getByLabelText('Green'));
    await user.click(screen.getByLabelText('256 GB for 269 EUR'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockAddItem).toHaveBeenCalledWith({
      productId: 'OPP-R11F',
      name: 'Reno 11 F',
      brand: 'OPPO',
      imageUrl: 'http://example.com/green.webp',
      selectedColor: 'Green',
      selectedStorage: '256 GB',
      price: 269,
      quantity: 1,
    });
  });
});
