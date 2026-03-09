import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
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

jest.mock('@/presentation/context/CartContext');

const mockUseCartContext = useCartContext as jest.MockedFunction<typeof useCartContext>;

const defaultContext = {
  items: [],
  totalCount: 0,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
};

describe('Navbar', () => {
  beforeEach(() => {
    mockUseCartContext.mockReturnValue(defaultContext);
  });

  it('renders the MBST logo', () => {
    render(<Navbar />);
    expect(screen.getByAltText('MBST')).toBeInTheDocument();
  });

  it('renders the home link', () => {
    render(<Navbar />);
    const homeLink = screen.getByLabelText('MBST Home');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders the cart link with count 0', () => {
    render(<Navbar />);
    const cartLink = screen.getByLabelText(/Shopping cart with 0 items/i);
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('renders the cart count as 0', () => {
    render(<Navbar />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('has main navigation landmark', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation', { name: /Main navigation/i })).toBeInTheDocument();
  });

  it('renders cart count from context', () => {
    mockUseCartContext.mockReturnValue({ ...defaultContext, totalCount: 3 });
    render(<Navbar />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText(/Shopping cart with 3 items/i)).toBeInTheDocument();
  });

  it('shows inline SVG bag icon when cart is empty', () => {
    render(<Navbar />);
    const svgIcon = document.querySelector('svg.cartIcon, svg[class*="cartIcon"]');
    expect(svgIcon).toBeInTheDocument();
  });

  it('shows full bag icon image when cart has items', () => {
    mockUseCartContext.mockReturnValue({ ...defaultContext, totalCount: 2 });
    const { container } = render(<Navbar />);
    const bagIcon = container.querySelector('img[src="/bag-icon-full.svg"]');
    expect(bagIcon).toBeInTheDocument();
  });

  it('renders subheader children when provided', () => {
    render(
      <Navbar>
        <span>Sub content</span>
      </Navbar>,
    );
    expect(screen.getByText('Sub content')).toBeInTheDocument();
  });

  it('does not render subheader when no children', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('[class*="subHeader"]')).not.toBeInTheDocument();
  });

  it('hides cart link when hideCart is true', () => {
    render(<Navbar hideCart />);
    expect(screen.queryByLabelText(/Shopping cart/i)).not.toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
