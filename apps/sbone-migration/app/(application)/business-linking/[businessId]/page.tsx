import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BusinessLinking } from '@/components/BusinessLinking/BusinessLinking';
import { BUSINESS_PROFILES } from '@/components/BusinessProfile/businessProfiles';

export const metadata: Metadata = {
  title: 'Business Linking | SBOne',
};

// One static page per business (required for dynamic routes with Cache Components); unknown ids show 404
export function generateStaticParams() {
  return BUSINESS_PROFILES.map((profile) => ({ businessId: profile.id }));
}

// The id is read inside <Suspense> so navigation can show the layout instantly and stream the screen in
export default function BusinessLinkingPage({ params }: PageProps<'/business-linking/[businessId]'>) {
  return (
    <Suspense fallback={null}>
      {params.then(({ businessId }) => (
        <BusinessLinkingForId businessId={businessId} />
      ))}
    </Suspense>
  );
}

function BusinessLinkingForId({ businessId }: { businessId: string }) {
  const business = BUSINESS_PROFILES.find((profile) => profile.id === businessId);
  if (!business) notFound();
  return <BusinessLinking business={business} />;
}
