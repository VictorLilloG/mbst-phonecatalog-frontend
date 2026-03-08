import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

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

describe('Navbar', () => {
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
});
