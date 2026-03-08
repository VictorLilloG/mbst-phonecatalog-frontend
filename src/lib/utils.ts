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
 * Formats a numeric price for display (rounded integer + EUR).
 */
export function formatPrice(price: number): string {
  return `${Math.round(price)} EUR`;
}
