import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDetailInfo } from './ProductDetailInfo';
import type { ProductDetail, ColorOption, StorageOption } from '@/domain/models/Product';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img data-priority={priority} {...props} />;
  },
}));

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

const defaultProps = {
  product: mockProduct,
  selectedColor: null as ColorOption | null,
  selectedStorage: null as StorageOption | null,
  currentImageUrl: mockProduct.imageUrl,
  currentPrice: mockProduct.basePrice,
  canAddToCart: false,
  onSelectColor: jest.fn(),
  onSelectStorage: jest.fn(),
  onAddToCart: jest.fn(),
};

describe('ProductDetailInfo', () => {
  it('renders the product name in uppercase', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByText('TEST PHONE')).toBeInTheDocument();
  });

  it('renders the current price', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByText('From 499 EUR')).toBeInTheDocument();
  });

  it('shows price without "From" when storage is selected', () => {
    render(
      <ProductDetailInfo
        {...defaultProps}
        currentPrice={599}
        selectedStorage={mockProduct.storageOptions[1]}
      />,
    );
    expect(screen.getByText('599 EUR')).toBeInTheDocument();
    expect(screen.queryByText(/From/)).not.toBeInTheDocument();
  });

  it('shows price with "From" when no storage is selected', () => {
    render(<ProductDetailInfo {...defaultProps} currentPrice={499} selectedStorage={null} />);
    expect(screen.getByText('From 499 EUR')).toBeInTheDocument();
  });

  it('renders the product image', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByAltText('TestBrand Test Phone')).toBeInTheDocument();
  });

  it('renders the add to cart button', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('disables add to cart button when canAddToCart is false', () => {
    render(<ProductDetailInfo {...defaultProps} canAddToCart={false} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('enables add to cart button when canAddToCart is true', () => {
    render(<ProductDetailInfo {...defaultProps} canAddToCart={true} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeEnabled();
  });

  it('calls onAddToCart when add button is clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();
    render(<ProductDetailInfo {...defaultProps} canAddToCart={true} onAddToCart={onAddToCart} />);

    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it('renders color selector', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByRole('radiogroup', { name: /color options/i })).toBeInTheDocument();
  });

  it('renders storage selector', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByRole('radiogroup', { name: /storage options/i })).toBeInTheDocument();
  });

  it('has accessible section label', () => {
    render(<ProductDetailInfo {...defaultProps} />);
    expect(screen.getByRole('region', { name: /product details/i })).toBeInTheDocument();
  });
});
