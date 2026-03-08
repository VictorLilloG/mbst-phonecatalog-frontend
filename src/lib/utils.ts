/**
 * Converts HTTP URLs to HTTPS.
 * The API returns image URLs with http:// protocol,
 * but Next.js Image requires https:// for remote patterns.
 */
export function ensureHttps(url: string | undefined): string {
  if (!url) return '';
  return url.replace(/^http:\/\//, 'https://');
}

/**
 * Formats a numeric price for display following Euro conventions:
 * - Integer prices: no decimal part shown (e.g. 499 EUR)
 * - Non-integer prices: exactly 2 decimal places with comma separator (e.g. 499,99 EUR)
 */
export function formatPrice(price: number): string {
  if (Number.isInteger(price)) {
    return `${price} EUR`;
  }
  return `${price.toFixed(2).replace('.', ',')} EUR`;
}
