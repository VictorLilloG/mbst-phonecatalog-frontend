import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search for a smartphone...')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<SearchBar />);
    expect(screen.getByLabelText('Search for a smartphone')).toBeInTheDocument();
  });

  it('calls onSearch when user types', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'iPhone');

    expect(mockOnSearch).toHaveBeenLastCalledWith('iPhone');
  });

  it('updates input value as user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'Samsung');

    expect(input).toHaveValue('Samsung');
  });
});
