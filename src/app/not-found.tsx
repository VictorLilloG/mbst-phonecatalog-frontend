import { PageLayout } from '@/presentation/components/layout/PageLayout/PageLayout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageLayout>
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h1>Page Not Found</h1>
        <p style={{ margin: '1rem 0', color: '#999' }}>
          The page you are looking for does not exist.
        </p>
        <Link href="/" style={{ textDecoration: 'underline' }}>
          Go to catalog
        </Link>
      </div>
    </PageLayout>
  );
}
