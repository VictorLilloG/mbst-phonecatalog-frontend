import type { Metadata } from 'next';
import { CartPage } from '@/presentation/components/pages/CartPage/CartPage';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review the items in your cart and proceed to checkout.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Shopping Cart | MBST',
    description: 'Review the items in your cart and proceed to checkout.',
    url: '/cart',
  },
  alternates: {
    canonical: '/cart',
  },
};

export default function CartRoute() {
  return <CartPage />;
}
