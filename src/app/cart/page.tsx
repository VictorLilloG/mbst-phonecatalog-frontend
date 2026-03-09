import type { Metadata } from 'next';
import { CartPage } from '@/presentation/components/pages/CartPage/CartPage';

export const metadata: Metadata = {
  title: 'Cart - MBST',
};

export default function CartRoute() {
  return <CartPage />;
}
