import type { Metadata } from 'next';
import { SuccessStep } from '@/components/AddBeneficiary/AddBeneficiary';

export const metadata: Metadata = {
  title: 'Beneficiary added | SBOne',
};

export default function Page() {
  return <SuccessStep />;
}
