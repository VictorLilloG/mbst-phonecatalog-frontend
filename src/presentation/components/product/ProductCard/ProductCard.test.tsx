import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { ProductSummary } from '@/domain/models/Product';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill: _fill, priority: _priority, ...props }: any) => {
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

const mockProduct: ProductSummary = {
  id: 'TEST-001',
  brand: 'TestBrand',
  name: 'Test Phone X',
  basePrice: 999,
  imageUrl: 'http://example.com/phone.webp',
};

describe('ProductCard', () => {
  it('renders product brand in uppercase', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('TESTBRAND')).toBeInTheDocument();
  });

  it('renders product name in uppercase', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('TEST PHONE X')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
  });

  it('renders link to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/TEST-001');
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText('TestBrand Test Phone X');
    expect(image).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByLabelText(/View details for TestBrand Test Phone X/i);
    expect(link).toBeInTheDocument();
  });

  it('formats decimal prices with comma and 2 decimal places', () => {
    const decimalProduct = { ...mockProduct, basePrice: 553.31 };
    render(<ProductCard product={decimalProduct} />);
    expect(screen.getByText('553,31 EUR')).toBeInTheDocument();
  });
});
