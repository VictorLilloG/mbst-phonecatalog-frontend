'use client';

import { useEffect } from 'react';
import type { ProductSummary } from '@/domain/models/Product';
import { useSearch } from '@/application/hooks/useSearch';
import { useProducts } from '@/application/hooks/useProducts';
import { Navbar } from '@/presentation/components/layout/Navbar/Navbar';
import { SearchBar } from '@/presentation/components/ui/SearchBar/SearchBar';
import { ResultsCount } from '@/presentation/components/ui/ResultsCount/ResultsCount';
import { PageLayout } from '@/presentation/components/layout/PageLayout/PageLayout';
import { ProductGrid } from '@/presentation/components/product/ProductGrid/ProductGrid';

interface PhoneListPageProps {
  initialProducts: ProductSummary[];
}

export function PhoneListPage({ initialProducts }: PhoneListPageProps) {
  const { setQuery, debouncedQuery } = useSearch();
  const { products, loading, refetch } = useProducts(initialProducts);

  useEffect(() => {
    const search = debouncedQuery.trim() || undefined;
    refetch({ search });
  }, [debouncedQuery, refetch]);

  return (
    <div>
      <Navbar>
        <SearchBar onSearch={setQuery} />
        <ResultsCount count={products.length} />
      </Navbar>
      <PageLayout>
        <h1 className="sr-only">Explore the Latest Smartphones</h1>
        <ProductGrid products={products} loading={loading} />
      </PageLayout>
    </div>
  );
}
