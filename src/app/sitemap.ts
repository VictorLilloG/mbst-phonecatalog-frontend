import type { MetadataRoute } from 'next';
import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mbst-phonecatalog-frontend.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productRepository = new ProductApiRepository();

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await productRepository.getProducts({});
    productEntries = products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If the API is unavailable, generate sitemap without product pages
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productEntries,
  ];
}
