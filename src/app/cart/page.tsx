import type { Metadata } from 'next';
import { Navbar } from '@/presentation/components/layout/Navbar/Navbar';
import { PageLayout } from '@/presentation/components/layout/PageLayout/PageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cart - MBST',
};

/**
 * Cart page placeholder.
 * Full implementation with item list and totals coming soon.
 */
export default function CartPage() {
  return (
    <>
      <Navbar />
      <PageLayout>
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h1>Shopping Cart</h1>
          <p style={{ margin: '1rem 0', color: '#999' }}>Cart functionality is coming soon.</p>
          <Link href="/" style={{ textDecoration: 'underline' }}>
            Continue shopping
          </Link>
        </div>
      </PageLayout>
    </>
  );
}
