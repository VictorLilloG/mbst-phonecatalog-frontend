import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the count value', () => {
    render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders zero count', () => {
    render(<Badge count={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('applies aria-label when provided', () => {
    render(<Badge count={3} ariaLabel="3 items in cart" />);
    expect(screen.getByLabelText('3 items in cart')).toBeInTheDocument();
  });

  it('renders without aria-label when not provided', () => {
    const { container } = render(<Badge count={1} />);
    const span = container.querySelector('span');
    expect(span).not.toHaveAttribute('aria-label');
  });
});
