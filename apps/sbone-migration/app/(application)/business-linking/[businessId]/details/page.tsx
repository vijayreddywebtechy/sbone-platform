import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ApprovalList } from '@/components/BusinessLinking/ApprovalList';
import { APPROVERS, BUSINESS_PROFILES } from '@/components/BusinessProfile/businessProfiles';

export const metadata: Metadata = {
  title: 'Approval List | Business Linking | SBOne',
};

// One static page per business (required for dynamic routes with Cache Components); unknown ids show 404
export function generateStaticParams() {
  return BUSINESS_PROFILES.map((profile) => ({ businessId: profile.id }));
}

// The id is read inside <Suspense> so navigation can show the layout instantly and stream the screen in
export default function ApprovalListPage({ params }: PageProps<'/business-linking/[businessId]/details'>) {
  return (
    <Suspense fallback={null}>
      {params.then(({ businessId }) => (
        <ApprovalListForId businessId={businessId} />
      ))}
    </Suspense>
  );
}

function ApprovalListForId({ businessId }: { businessId: string }) {
  const business = BUSINESS_PROFILES.find((profile) => profile.id === businessId);
  if (!business) notFound();
  return <ApprovalList business={business} approvers={APPROVERS[business.id] ?? []} />;
}
