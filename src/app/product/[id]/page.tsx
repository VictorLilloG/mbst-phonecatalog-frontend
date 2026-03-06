import type { Metadata } from 'next';
import { Navbar } from '@/presentation/components/layout/Navbar/Navbar';
import { PageLayout } from '@/presentation/components/layout/PageLayout/PageLayout';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product ${id} - MBST`,
  };
}

/**
 * Product detail page placeholder.
 * Full implementation with color/storage selectors coming soon.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <>
      <Navbar>
        <Link href="/" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-light)' }}>
          &#8249; BACK
        </Link>
      </Navbar>
      <PageLayout>
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h1>Product Detail</h1>
          <p style={{ margin: '1rem 0', color: '#999' }}>
            Detail view for product <strong>{id}</strong> is coming soon.
          </p>
        </div>
      </PageLayout>
    </>
  );
}
