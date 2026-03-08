import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { CartProvider } from '@/presentation/context/CartContext';
import '@/styles/globals.scss';

const helveticaNeue = localFont({
  src: [
    { path: './fonts/HelveticaNeueLight.otf', weight: '300', style: 'normal' },
    { path: './fonts/HelveticaNeueRoman.otf', weight: '400', style: 'normal' },
    { path: './fonts/HelveticaNeueMedium.otf', weight: '500', style: 'normal' },
    { path: './fonts/HelveticaNeueBold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-helvetica-neue',
  display: 'swap',
});

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
    <html lang="en" className={helveticaNeue.variable}>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
