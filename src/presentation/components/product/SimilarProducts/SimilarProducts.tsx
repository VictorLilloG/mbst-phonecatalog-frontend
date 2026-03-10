'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { ProductSummary } from '@/domain/models/Product';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './SimilarProducts.module.scss';

interface SimilarProductsProps {
  products: ProductSummary[];
}

/**
 * Horizontal draggable slider of related products with scroll indicator.
 * Uses spacer elements to align cards with the 1200px content boundary
 * while the scroll area spans the full viewport width.
 */
export function SimilarProducts({ products }: SimilarProductsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });

  // --- Scroll progress tracking ---

  const updateProgress = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  // --- Drag to scroll (all native listeners, no React handlers needed) ---

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      drag.current = { active: true, moved: false, startX: e.clientX, scrollLeft: el.scrollLeft };
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dx) > 3) drag.current.moved = true;
      el.scrollLeft = drag.current.scrollLeft - dx;
    };

    const onMouseUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const onClickCapture = (e: MouseEvent) => {
      if (drag.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        drag.current.moved = false;
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('click', onClickCapture, true);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className={styles.container} aria-label="Similar products">
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>SIMILAR ITEMS</h2>
      </div>

      <div ref={sliderRef} className={styles.slider} data-testid="similar-slider">
        <div className={styles.sliderSpacer} aria-hidden="true" />
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className={styles.item} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
        <div className={styles.sliderSpacer} aria-hidden="true" />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.scrollBarTrack} aria-hidden="true">
          <div className={styles.scrollBarThumb} style={{ left: `${scrollProgress * 70}%` }} />
        </div>
      </div>
    </section>
  );
}
