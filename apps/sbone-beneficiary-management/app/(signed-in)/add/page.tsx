import type { Metadata } from 'next';
import { PaymentTypeStep } from '@/components/AddBeneficiary/AddBeneficiary';

export const metadata: Metadata = {
  title: 'Add beneficiary | SBOne',
};

export default function Page() {
  return <PaymentTypeStep />;
}
