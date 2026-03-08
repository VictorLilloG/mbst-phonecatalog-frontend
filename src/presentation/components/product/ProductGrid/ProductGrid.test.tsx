import { render, screen } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';
import type { ProductSummary } from '@/domain/models/Product';

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

const mockProducts: ProductSummary[] = [
  { id: '1', brand: 'Apple', name: 'iPhone 15', basePrice: 999, imageUrl: 'http://example.com/iphone.webp' },
  { id: '2', brand: 'Samsung', name: 'Galaxy S24', basePrice: 899, imageUrl: 'http://example.com/s24.webp' },
];

describe('ProductGrid', () => {
  it('renders a list of products', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the accessible grid label', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByRole('list', { name: /phone catalog/i })).toBeInTheDocument();
  });

  it('renders empty state when no products and not loading', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  it('renders empty state with status role', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows loading overlay when loading=true with no products', () => {
    render(<ProductGrid products={[]} loading={true} />);
    expect(screen.getByRole('status', { name: /loading products/i })).toBeInTheDocument();
  });

  it('does not show empty state when loading with no products', () => {
    render(<ProductGrid products={[]} loading={true} />);
    expect(screen.queryByText('No products found.')).not.toBeInTheDocument();
  });

  it('shows loading overlay alongside products when loading=true', () => {
    render(<ProductGrid products={mockProducts} loading={true} />);
    expect(screen.getByRole('status', { name: /loading products/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
