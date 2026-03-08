import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';
import { PhoneDetailPage } from '@/presentation/components/pages/PhoneDetailPage/PhoneDetailPage';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const productRepository = new ProductApiRepository();

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await productRepository.getProductById(id);
    return {
      title: `${product.brand} ${product.name} - MBST`,
      description: product.description,
    };
  } catch {
    return { title: 'Product not found - MBST' };
  }
}

/**
 * Product detail page (Server Component).
 * Fetches product data via SSR, then hydrates the PhoneDetailPage client component.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await productRepository.getProductById(id);
  } catch {
    notFound();
  }

  return <PhoneDetailPage product={product} />;
}
