import type { Metadata } from 'next';
import { Queries } from '@/components/Queries/Queries';

export const metadata: Metadata = {
  title: 'Queries | SBOne',
};

export default function QueriesPage() {
  return <Queries />;
}
