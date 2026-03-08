import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorSelector } from './ColorSelector';
import type { ColorOption } from '@/domain/models/Product';

const colors: ColorOption[] = [
  { name: 'Red', hexCode: '#FF0000', imageUrl: 'http://example.com/red.webp' },
  { name: 'Blue', hexCode: '#0000FF', imageUrl: 'http://example.com/blue.webp' },
  { name: 'Green', hexCode: '#00FF00', imageUrl: 'http://example.com/green.webp' },
];

describe('ColorSelector', () => {
  it('renders all color options', () => {
    render(<ColorSelector colors={colors} selectedColor={null} onSelect={jest.fn()} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders color names as aria-labels', () => {
    render(<ColorSelector colors={colors} selectedColor={null} onSelect={jest.fn()} />);
    expect(screen.getByLabelText('Red')).toBeInTheDocument();
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
    expect(screen.getByLabelText('Green')).toBeInTheDocument();
  });

  it('marks selected color as aria-checked', () => {
    render(<ColorSelector colors={colors} selectedColor={colors[1]} onSelect={jest.fn()} />);
    expect(screen.getByLabelText('Blue')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText('Red')).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onSelect when a color is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<ColorSelector colors={colors} selectedColor={null} onSelect={onSelect} />);

    await user.click(screen.getByLabelText('Green'));
    expect(onSelect).toHaveBeenCalledWith(colors[2]);
  });

  it('renders the legend text', () => {
    render(<ColorSelector colors={colors} selectedColor={null} onSelect={jest.fn()} />);
    expect(screen.getByText('COLOR. PICK YOUR FAVOURITE.')).toBeInTheDocument();
  });

  it('has a radiogroup role', () => {
    render(<ColorSelector colors={colors} selectedColor={null} onSelect={jest.fn()} />);
    expect(screen.getByRole('radiogroup', { name: /color options/i })).toBeInTheDocument();
  });
});
