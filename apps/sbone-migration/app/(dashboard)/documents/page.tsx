import type { Metadata } from 'next';
import { Documents } from '@/components/Documents/Documents';

export const metadata: Metadata = {
  title: 'Documents | SBOne',
};

export default function DocumentsPage() {
  return <Documents />;
}
