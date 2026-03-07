import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';
import { PhoneListPage } from '@/presentation/components/pages/PhoneListPage/PhoneListPage';
import { DEFAULT_PRODUCT_LIMIT } from '@/lib/constants';

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
