import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  describe('rendering', () => {
    it('renders the search input with placeholder text', () => {
      render(<SearchBar />);
      expect(screen.getByPlaceholderText('Search for a smartphone...')).toBeInTheDocument();
    });

    it('has an accessible label for the input', () => {
      render(<SearchBar />);
      expect(screen.getByLabelText('Search for a smartphone')).toBeInTheDocument();
    });

    it('has the searchbox role', () => {
      render(<SearchBar />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('does not render clear button when input is empty', () => {
      render(<SearchBar />);
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });
  });

  describe('typing', () => {
    it('updates input value as user types', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Samsung');

      expect(input).toHaveValue('Samsung');
    });

    it('calls onSearch on each keystroke', async () => {
      const user = userEvent.setup();
      const onSearch = jest.fn();
      render(<SearchBar onSearch={onSearch} />);

      await user.type(screen.getByRole('searchbox'), 'ab');

      expect(onSearch).toHaveBeenCalledTimes(2);
      expect(onSearch).toHaveBeenNthCalledWith(1, 'a');
      expect(onSearch).toHaveBeenNthCalledWith(2, 'ab');
    });
  });

  describe('clear button', () => {
    it('appears when user types text', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      await user.type(screen.getByRole('searchbox'), 'iPhone');

      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('clears the input value when clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'iPhone');
      await user.click(screen.getByRole('button', { name: /clear search/i }));

      expect(input).toHaveValue('');
    });

    it('calls onSearch with empty string when cleared', async () => {
      const user = userEvent.setup();
      const onSearch = jest.fn();
      render(<SearchBar onSearch={onSearch} />);

      await user.type(screen.getByRole('searchbox'), 'test');
      await user.click(screen.getByRole('button', { name: /clear search/i }));

      expect(onSearch).toHaveBeenLastCalledWith('');
    });

    it('returns focus to input after clearing', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      await user.click(screen.getByRole('button', { name: /clear search/i }));

      expect(input).toHaveFocus();
    });

    it('disappears after clearing', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      await user.type(screen.getByRole('searchbox'), 'x');
      await user.click(screen.getByRole('button', { name: /clear search/i }));

      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });
  });

  describe('without onSearch callback', () => {
    it('does not throw when typing without onSearch', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      await expect(user.type(screen.getByRole('searchbox'), 'test')).resolves.not.toThrow();
    });

    it('does not throw when clearing without onSearch', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      await user.type(screen.getByRole('searchbox'), 'test');

      await expect(
        user.click(screen.getByRole('button', { name: /clear search/i })),
      ).resolves.not.toThrow();
    });
  });
});
