'use client';

import Link from 'next/link';
import type { ProductDetail } from '@/domain/models/Product';
import { useProductDetail } from '@/application/hooks/useProductDetail';
import { Navbar } from '@/presentation/components/layout/Navbar/Navbar';
import { PageLayout } from '@/presentation/components/layout/PageLayout/PageLayout';
import { ProductDetailInfo } from '@/presentation/components/product/ProductDetailInfo/ProductDetailInfo';
import { ProductSpecs } from '@/presentation/components/product/ProductSpecs/ProductSpecs';
import { SimilarProducts } from '@/presentation/components/product/SimilarProducts/SimilarProducts';
import styles from './PhoneDetailPage.module.scss';

interface PhoneDetailPageProps {
  product: ProductDetail;
}

/**
 * Client component orchestrating the product detail view.
 * Composes Navbar (with back link), ProductDetailInfo, ProductSpecs, and SimilarProducts.
 */
export function PhoneDetailPage({ product }: PhoneDetailPageProps) {
  const {
    selectedColor,
    selectedStorage,
    currentImageUrl,
    currentPrice,
    canAddToCart,
    selectColor,
    selectStorage,
  } = useProductDetail(product);

  const handleAddToCart = () => {
    // TODO: integrate with CartContext when implemented
  };

  return (
    <>
      <Navbar>
        <Link href="/" className={styles.backLink}>
          &#8249; BACK
        </Link>
      </Navbar>
      <PageLayout>
        <ProductDetailInfo
          product={product}
          selectedColor={selectedColor}
          selectedStorage={selectedStorage}
          currentImageUrl={currentImageUrl}
          currentPrice={currentPrice}
          canAddToCart={canAddToCart}
          onSelectColor={selectColor}
          onSelectStorage={selectStorage}
          onAddToCart={handleAddToCart}
        />
        <ProductSpecs
          brand={product.brand}
          name={product.name}
          description={product.description}
          specs={product.specs}
        />
        <SimilarProducts products={product.similarProducts} />
      </PageLayout>
    </>
  );
}
