import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AccountDetails } from '@/components/AccountDetails/AccountDetails';
import { ACCOUNTS } from '@/components/Dashboard/dashboardData';

export const metadata: Metadata = {
  title: 'Accounts | SBOne',
};

// One static page per account (required for dynamic routes with Cache Components); unknown ids show 404
export function generateStaticParams() {
  return ACCOUNTS.map((account) => ({ accountId: account.id }));
}

// The id is read inside <Suspense> so navigation can show the layout instantly and stream the account in
export default function AccountPage({ params }: PageProps<'/accounts/[accountId]'>) {
  return (
    <Suspense fallback={null}>
      {params.then(({ accountId }) => (
        <AccountForId accountId={accountId} />
      ))}
    </Suspense>
  );
}

function AccountForId({ accountId }: { accountId: string }) {
  const account = ACCOUNTS.find((item) => item.id === accountId);
  if (!account) notFound();
  return <AccountDetails account={account} />;
}
