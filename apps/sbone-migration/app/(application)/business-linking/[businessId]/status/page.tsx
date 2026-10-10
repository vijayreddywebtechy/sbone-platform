import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ApprovalStatus } from '@/components/BusinessLinking/ApprovalStatus';
import { APPROVERS, BUSINESS_PROFILES } from '@/components/BusinessProfile/businessProfiles';

export const metadata: Metadata = {
  title: 'Approval Status | Business Linking | SBOne',
};

// One static page per business (required for dynamic routes with Cache Components); unknown ids show 404
export function generateStaticParams() {
  return BUSINESS_PROFILES.map((profile) => ({ businessId: profile.id }));
}

// The id is read inside <Suspense> so navigation can show the layout instantly and stream the screen in
export default function ApprovalStatusPage({ params }: PageProps<'/business-linking/[businessId]/status'>) {
  return (
    <Suspense fallback={null}>
      {params.then(({ businessId }) => (
        <ApprovalStatusForId businessId={businessId} />
      ))}
    </Suspense>
  );
}

function ApprovalStatusForId({ businessId }: { businessId: string }) {
  const business = BUSINESS_PROFILES.find((profile) => profile.id === businessId);
  if (!business) notFound();
  return <ApprovalStatus business={business} approvers={APPROVERS[business.id] ?? []} />;
}
