import type { Metadata } from 'next';
import { ReviewStep } from '@/components/AddBeneficiary/AddBeneficiary';

export const metadata: Metadata = {
  title: 'Review beneficiary | SBOne',
};

export default function Page() {
  return <ReviewStep />;
}
