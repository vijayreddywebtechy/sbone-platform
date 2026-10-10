import type { Metadata } from 'next';
import { BusinessProfile } from '@/components/BusinessProfile/BusinessProfile';

export const metadata: Metadata = {
  title: 'Your Business Profile | SBOne',
};

export default function BusinessProfilePage() {
  return <BusinessProfile />;
}
