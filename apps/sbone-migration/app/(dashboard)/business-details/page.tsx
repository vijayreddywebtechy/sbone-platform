import type { Metadata } from 'next';
import { BusinessDetails } from '@/components/BusinessDetails/BusinessDetails';

export const metadata: Metadata = {
  title: 'Business Details | SBOne',
};

export default function BusinessDetailsPage() {
  return <BusinessDetails />;
}
