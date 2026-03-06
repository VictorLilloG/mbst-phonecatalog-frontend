import type { Metadata } from 'next';
import { CartProvider } from '@/presentation/context/CartContext';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'MBST - Phone Catalog',
  description: 'Browse and shop the latest smartphones',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
