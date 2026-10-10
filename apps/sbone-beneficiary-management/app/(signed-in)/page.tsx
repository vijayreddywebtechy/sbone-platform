import type { Metadata } from 'next';
import { BeneficiaryList } from '@/components/BeneficiaryList/BeneficiaryList';

export const metadata: Metadata = {
  title: 'Beneficiary Management | SBOne',
};

export default function BeneficiariesPage() {
  return <BeneficiaryList />;
}
