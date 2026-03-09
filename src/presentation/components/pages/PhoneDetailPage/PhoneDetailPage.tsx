'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProductDetail } from '@/domain/models/Product';
import { useProductDetail } from '@/application/hooks/useProductDetail';
import { useCart } from '@/application/hooks/useCart';
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

  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedColor || !selectedStorage) return;

    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      imageUrl: selectedColor.imageUrl,
      selectedColor: selectedColor.name,
      selectedStorage: selectedStorage.capacity,
      price: selectedStorage.price,
      quantity: 1,
    });
  };

  return (
    <div>
      <Navbar>
        <Link href="/" className={styles.backLink}>
          <Image
            src="/back-icon.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          <span>BACK</span>
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
    </div>
  );
}
