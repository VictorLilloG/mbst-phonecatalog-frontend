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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mbst-phonecatalog-frontend.vercel.app';
const SITE_NAME = 'MBST Phone Catalog';
const SITE_DESCRIPTION =
  'Browse and shop the latest smartphones. Compare prices, specs, and colors from top brands.';

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: new URL(SITE_URL) }),
  title: {
    default: SITE_NAME,
    template: '%s | MBST',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'smartphones',
    'mobile phones',
    'phone catalog',
    'buy phones',
    'phone specs',
    'phone comparison',
  ],
  authors: [{ name: 'MBST' }],
  creator: 'MBST',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/web-example.png',
        width: 1104,
        height: 908,
        alt: 'MBST Phone Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/web-example.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={helveticaNeue.variable}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
