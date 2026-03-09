'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '@/presentation/context/CartContext';
import styles from './Navbar.module.scss';

interface NavbarProps {
  children?: React.ReactNode;
  fullWidthSubHeader?: boolean;
  hideCart?: boolean;
}

export function Navbar({ children, fullWidthSubHeader, hideCart }: NavbarProps) {
  const { totalCount: cartCount } = useCartContext();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.logo} aria-label="MBST Home">
          <Image
            src="/logo.svg"
            alt="MBST"
            width={74}
            height={24}
            priority
            className={styles.logoImage}
          />
        </Link>

        {!hideCart && (
          <Link
            href="/cart"
            className={styles.cartLink}
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            {cartCount > 0 ? (
              <Image
                src="/bag-icon-full.svg"
                alt=""
                width={18}
                height={18}
                className={styles.cartIcon}
                aria-hidden="true"
              />
            ) : (
              <svg
                className={styles.cartIcon}
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.4706 1.32031H6.76471V5.08502H3V17.3203H15.2353V5.08502H11.4706V1.32031ZM10.5294 6.0262V8.37914H11.4706V6.0262H14.2941V16.3791H3.94118V6.0262H6.76471V8.37914H7.70588V6.0262H10.5294ZM10.5294 5.08502V2.26149H7.70588V5.08502H10.5294Z"
                  fill="currentColor"
                />
              </svg>
            )}
            <span className={styles.cartCount}>{cartCount}</span>
          </Link>
        )}
      </nav>
      {children && (
        <div className={fullWidthSubHeader ? styles.subHeaderFull : styles.subHeader}>
          {children}
        </div>
      )}
    </header>
  );
}
