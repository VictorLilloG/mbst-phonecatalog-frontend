import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItemCard } from './CartItemCard';
import type { CartItem } from '@/domain/models/CartItem';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill: _fill, priority: _priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockItem: CartItem = {
  productId: 'SMG-S24',
  name: 'Galaxy S24',
  brand: 'Samsung',
  imageUrl: 'http://example.com/s24.webp',
  selectedColor: 'Black',
  selectedStorage: '256 GB',
  price: 899,
  quantity: 1,
};

describe('CartItemCard', () => {
  it('renders item name in uppercase', () => {
    render(<CartItemCard item={mockItem} onRemove={jest.fn()} />);
    expect(screen.getByText('GALAXY S24')).toBeInTheDocument();
  });

  it('renders storage and color as variant', () => {
    render(<CartItemCard item={mockItem} onRemove={jest.fn()} />);
    expect(screen.getByText('256 GB | BLACK')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<CartItemCard item={mockItem} onRemove={jest.fn()} />);
    expect(screen.getByText('899 EUR')).toBeInTheDocument();
  });

  it('renders product image with https', () => {
    render(<CartItemCard item={mockItem} onRemove={jest.fn()} />);
    expect(screen.getByAltText('Samsung Galaxy S24')).toHaveAttribute(
      'src',
      'https://example.com/s24.webp',
    );
  });

  it('calls onRemove with composite key when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(<CartItemCard item={mockItem} onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: /remove galaxy s24 from cart/i }));
    expect(onRemove).toHaveBeenCalledWith('SMG-S24', 'Black', '256 GB');
  });

  it('has accessible article landmark with item name', () => {
    render(<CartItemCard item={mockItem} onRemove={jest.fn()} />);
    expect(screen.getByRole('article', { name: /galaxy s24 in cart/i })).toBeInTheDocument();
  });
});
