import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EditBeneficiary } from '@/components/EditBeneficiary/EditBeneficiary';

export const metadata: Metadata = {
  title: 'Edit beneficiary | SBOne',
};

// The beneficiary id comes from ?id=, read inside <Suspense> (required for search params with Cache Components)
export default function EditBeneficiaryPage() {
  return (
    <Suspense fallback={null}>
      <EditBeneficiary />
    </Suspense>
  );
}
