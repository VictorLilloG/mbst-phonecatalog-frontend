import { render, screen, fireEvent } from '@testing-library/react';
import { SimilarProducts } from './SimilarProducts';
import type { ProductSummary } from '@/domain/models/Product';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ ...props }: any) => {
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

  it('sets grabbing cursor on mousedown with primary button', () => {
    render(<SimilarProducts products={similarProducts} />);
    const slider = screen.getByTestId('similar-slider');
    fireEvent.mouseDown(slider, { button: 0, clientX: 100 });
    expect(document.body.style.cursor).toBe('grabbing');
  });

  it('ignores non-primary mouse buttons on mousedown', () => {
    render(<SimilarProducts products={similarProducts} />);
    const slider = screen.getByTestId('similar-slider');
    fireEvent.mouseDown(slider, { button: 2, clientX: 100 });
    expect(document.body.style.cursor).not.toBe('grabbing');
  });

  it('resets cursor on mouseup after drag start', () => {
    render(<SimilarProducts products={similarProducts} />);
    const slider = screen.getByTestId('similar-slider');
    fireEvent.mouseDown(slider, { button: 0, clientX: 100 });
    fireEvent.mouseUp(window);
    expect(document.body.style.cursor).toBe('');
  });

  it('mouseup is a no-op when drag was not started', () => {
    render(<SimilarProducts products={similarProducts} />);
    // No mousedown before mouseup — should not throw
    fireEvent.mouseUp(window);
    expect(document.body.style.cursor).toBe('');
  });

  it('prevents link click after a drag move greater than 3px', () => {
    render(<SimilarProducts products={similarProducts} />);
    const slider = screen.getByTestId('similar-slider');
    fireEvent.mouseDown(slider, { button: 0, clientX: 0 });
    fireEvent.mouseMove(window, { clientX: 50 });
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventSpy = jest.spyOn(clickEvent, 'preventDefault');
    slider.dispatchEvent(clickEvent);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('does not prevent click when drag moved less than 3px', () => {
    render(<SimilarProducts products={similarProducts} />);
    const slider = screen.getByTestId('similar-slider');
    fireEvent.mouseDown(slider, { button: 0, clientX: 0 });
    fireEvent.mouseMove(window, { clientX: 2 });
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventSpy = jest.spyOn(clickEvent, 'preventDefault');
    slider.dispatchEvent(clickEvent);
    expect(preventSpy).not.toHaveBeenCalled();
  });
});
