import { ensureHttps, formatPrice } from './utils';

describe('ensureHttps', () => {
  it('converts http:// to https://', () => {
    expect(ensureHttps('http://example.com/image.jpg')).toBe('https://example.com/image.jpg');
  });

  it('leaves https:// URLs unchanged', () => {
    expect(ensureHttps('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
  });

  it('returns empty string for undefined', () => {
    expect(ensureHttps(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(ensureHttps('')).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats an integer price without decimals', () => {
    expect(formatPrice(499)).toBe('499 EUR');
  });

  it('formats a non-integer price with exactly 2 decimal places and comma separator', () => {
    expect(formatPrice(499.99)).toBe('499,99 EUR');
  });

  it('pads to 2 decimal places when only 1 significant decimal', () => {
    expect(formatPrice(499.9)).toBe('499,90 EUR');
  });

  it('rounds to 2 decimal places when more than 2 are given', () => {
    expect(formatPrice(499.999)).toBe('500,00 EUR');
  });

  it('handles zero as integer', () => {
    expect(formatPrice(0)).toBe('0 EUR');
  });

  it('handles prices that are .00 as integers (no decimal shown)', () => {
    expect(formatPrice(500.00)).toBe('500 EUR');
  });
});
