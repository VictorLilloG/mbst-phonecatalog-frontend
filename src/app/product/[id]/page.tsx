import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductApiRepository } from '@/infrastructure/api/ProductApiRepository';
import { PhoneDetailPage } from '@/presentation/components/pages/PhoneDetailPage/PhoneDetailPage';
import type { ProductDetail } from '@/domain/models/Product';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const productRepository = new ProductApiRepository();

function getProductJsonLd(product: ProductDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    ...(product.imageUrl && { image: product.imageUrl }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        bestRating: 5,
      },
    }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: Math.min(...product.storageOptions.map((s) => s.price)),
      highPrice: Math.max(...product.storageOptions.map((s) => s.price)),
      offerCount: product.storageOptions.length,
    },
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await productRepository.getProductById(id);
    const title = `${product.brand} ${product.name}`;
    const priceFrom = Math.min(...product.storageOptions.map((s) => s.price));
    const description =
      product.description ||
      `Buy ${product.brand} ${product.name} from ${priceFrom} EUR. Check specs, colors, and storage options.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | MBST`,
        description,
        url: `/product/${id}`,
        type: 'website',
        ...(product.imageUrl && {
          images: [
            {
              url: product.imageUrl,
              alt: `${product.brand} ${product.name}`,
            },
          ],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | MBST`,
        description,
        ...(product.imageUrl && { images: [product.imageUrl] }),
      },
      alternates: {
        canonical: `/product/${id}`,
      },
    };
  } catch {
    return { title: 'Product not found', robots: { index: false } };
  }
}

/**
 * Product detail page (Server Component).
 * Fetches product data via SSR, then hydrates the PhoneDetailPage client component.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: ProductDetail;
  try {
    product = await productRepository.getProductById(id);
  } catch {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product)) }}
      />
      <PhoneDetailPage product={product} />
    </>
  );
}
