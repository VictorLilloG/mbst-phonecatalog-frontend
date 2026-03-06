import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';
import { Navbar } from '@/presentation/components/layout/Navbar/Navbar';
import { SearchBar } from '@/presentation/components/ui/SearchBar/SearchBar';
import { ResultsCount } from '@/presentation/components/ui/ResultsCount/ResultsCount';
import { ProductGrid } from '@/presentation/components/product/ProductGrid/ProductGrid';
import { PageLayout } from '@/presentation/components/layout/PageLayout/PageLayout';
import { DEFAULT_PRODUCT_LIMIT } from '@/lib/constants';

const productRepository = new ProductApiRepository();

/**
 * Phone list page (/).
 * Server Component: fetches products on the server for SSR.
 */
export default async function HomePage() {
  const products = await productRepository.getProducts({
    limit: DEFAULT_PRODUCT_LIMIT,
  });

  return (
    <>
      <Navbar>
        <SearchBar />
        <ResultsCount count={products.length} />
      </Navbar>
      <PageLayout>
        <ProductGrid products={products} />
      </PageLayout>
    </>
  );
}
