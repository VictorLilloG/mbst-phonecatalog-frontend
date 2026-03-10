import { render, screen } from '@testing-library/react';
import { ResultsCount } from './ResultsCount';

describe('ResultsCount', () => {
  it('renders the count with RESULTS label', () => {
    render(<ResultsCount count={20} />);
    expect(screen.getByText('20 RESULTS')).toBeInTheDocument();
  });

  it('renders zero results', () => {
    render(<ResultsCount count={0} />);
    expect(screen.getByText('0 RESULTS')).toBeInTheDocument();
  });

  it('has aria-live polite for screen readers', () => {
    render(<ResultsCount count={5} />);
    const element = screen.getByText('5 RESULTS');
    expect(element).toHaveAttribute('aria-live', 'polite');
  });
});
