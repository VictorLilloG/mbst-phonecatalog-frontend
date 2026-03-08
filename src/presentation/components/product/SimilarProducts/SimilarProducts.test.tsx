import { render, screen } from '@testing-library/react';
import { SimilarProducts } from './SimilarProducts';
import type { ProductSummary } from '@/domain/models/Product';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img data-fill={fill} {...props} />;
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

const similarProducts: ProductSummary[] = [
  { id: 'P1', brand: 'Samsung', name: 'Galaxy S23', basePrice: 699, imageUrl: 'http://example.com/s23.webp' },
  { id: 'P2', brand: 'Apple', name: 'iPhone 14', basePrice: 799, imageUrl: 'http://example.com/i14.webp' },
];

describe('SimilarProducts', () => {
  it('renders the section title', () => {
    render(<SimilarProducts products={similarProducts} />);
    expect(screen.getByText('SIMILAR ITEMS')).toBeInTheDocument();
  });

  it('renders all similar product cards', () => {
    render(<SimilarProducts products={similarProducts} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders product names', () => {
    render(<SimilarProducts products={similarProducts} />);
    expect(screen.getByText('GALAXY S23')).toBeInTheDocument();
    expect(screen.getByText('IPHONE 14')).toBeInTheDocument();
  });

  it('renders nothing when products array is empty', () => {
    const { container } = render(<SimilarProducts products={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has an accessible section label', () => {
    render(<SimilarProducts products={similarProducts} />);
    expect(screen.getByRole('region', { name: /similar products/i })).toBeInTheDocument();
  });

  it('renders links to product detail pages', () => {
    render(<SimilarProducts products={similarProducts} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/product/P1');
    expect(links[1]).toHaveAttribute('href', '/product/P2');
  });

  it('renders the scroll indicator bar', () => {
    const { container } = render(<SimilarProducts products={similarProducts} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
