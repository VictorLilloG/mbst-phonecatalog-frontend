import type { Metadata } from 'next';
import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';
import { PhoneListPage } from '@/presentation/components/pages/PhoneListPage/PhoneListPage';
import { DEFAULT_PRODUCT_LIMIT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Explore the Latest Smartphones',
  description:
    'Browse our catalog of the latest smartphones. Compare specs, prices, and colors from top brands like Apple, Samsung, and more.',
  openGraph: {
    title: 'Explore the Latest Smartphones | MBST',
    description:
      'Browse our catalog of the latest smartphones. Compare specs, prices, and colors from top brands.',
    url: '/',
  },
  alternates: {
    canonical: '/',
  },
};

const productRepository = new ProductApiRepository();

/**
 * Phone list page (/).
 * Server Component: fetches initial products via SSR, then hydrates client-side
 * PhoneListPage for search interactivity.
 */
export default async function HomePage() {
  const products = await productRepository.getProducts({
    limit: DEFAULT_PRODUCT_LIMIT,
  });

  return <PhoneListPage initialProducts={products} />;
}
