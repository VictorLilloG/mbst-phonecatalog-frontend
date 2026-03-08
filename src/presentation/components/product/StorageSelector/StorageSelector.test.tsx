import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StorageSelector } from './StorageSelector';
import type { StorageOption } from '@/domain/models/Product';

const storageOptions: StorageOption[] = [
  { capacity: '128 GB', price: 499 },
  { capacity: '256 GB', price: 599 },
  { capacity: '512 GB', price: 799 },
];

describe('StorageSelector', () => {
  it('renders all storage options', () => {
    render(
      <StorageSelector
        storageOptions={storageOptions}
        selectedStorage={null}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('displays capacity text', () => {
    render(
      <StorageSelector
        storageOptions={storageOptions}
        selectedStorage={null}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText('128 GB')).toBeInTheDocument();
    expect(screen.getByText('256 GB')).toBeInTheDocument();
    expect(screen.getByText('512 GB')).toBeInTheDocument();
  });

  it('marks selected storage as aria-checked', () => {
    render(
      <StorageSelector
        storageOptions={storageOptions}
        selectedStorage={storageOptions[1]}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByLabelText(/256 GB/)).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText(/128 GB/)).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onSelect when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(
      <StorageSelector
        storageOptions={storageOptions}
        selectedStorage={null}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByText('512 GB'));
    expect(onSelect).toHaveBeenCalledWith(storageOptions[2]);
  });

  it('renders the legend text', () => {
    render(
      <StorageSelector
        storageOptions={storageOptions}
        selectedStorage={null}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText('STORAGE ¿HOW MUCH SPACE DO YOU NEED?')).toBeInTheDocument();
  });

  it('has a radiogroup role', () => {
    render(
      <StorageSelector
        storageOptions={storageOptions}
        selectedStorage={null}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: /storage options/i })).toBeInTheDocument();
  });
});
