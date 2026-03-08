import { render, screen } from '@testing-library/react';
import { ProductSpecs } from './ProductSpecs';
import type { ProductSpecs as ProductSpecsType } from '@/domain/models/Product';

const specs: ProductSpecsType = {
  screen: '6.7" AMOLED FHD+',
  resolution: 'FHD+',
  processor: 'MediaTek Dimensity 7050',
  mainCamera: '64 MP',
  selfieCamera: '32 MP',
  battery: '5000 mAh',
  os: 'Android',
  screenRefreshRate: '120 Hz',
};

const defaultProps = {
  brand: 'OPPO',
  name: 'Reno 11 F',
  description: 'A great smartphone',
  specs,
};

describe('ProductSpecs', () => {
  it('renders the specifications title', () => {
    render(<ProductSpecs {...defaultProps} />);
    expect(screen.getByText('SPECIFICATIONS')).toBeInTheDocument();
  });

  it('renders brand, name, and description rows', () => {
    render(<ProductSpecs {...defaultProps} />);
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('OPPO')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Reno 11 F')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('A great smartphone')).toBeInTheDocument();
  });

  it('renders all spec labels', () => {
    render(<ProductSpecs {...defaultProps} />);
    expect(screen.getByText('Screen')).toBeInTheDocument();
    expect(screen.getByText('Resolution')).toBeInTheDocument();
    expect(screen.getByText('Processor')).toBeInTheDocument();
    expect(screen.getByText('Main camera')).toBeInTheDocument();
    expect(screen.getByText('Selfie camera')).toBeInTheDocument();
    expect(screen.getByText('Battery')).toBeInTheDocument();
    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('Screen refresh rate')).toBeInTheDocument();
  });

  it('renders all spec values', () => {
    render(<ProductSpecs {...defaultProps} />);
    expect(screen.getByText('6.7" AMOLED FHD+')).toBeInTheDocument();
    expect(screen.getByText('MediaTek Dimensity 7050')).toBeInTheDocument();
    expect(screen.getByText('64 MP')).toBeInTheDocument();
    expect(screen.getByText('5000 mAh')).toBeInTheDocument();
    expect(screen.getByText('120 Hz')).toBeInTheDocument();
  });

  it('has a section with accessible label', () => {
    render(<ProductSpecs {...defaultProps} />);
    expect(screen.getByRole('region', { name: /specifications/i })).toBeInTheDocument();
  });

  it('uses description list semantics', () => {
    const { container } = render(<ProductSpecs {...defaultProps} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(11);
    expect(container.querySelectorAll('dd')).toHaveLength(11);
  });
});
