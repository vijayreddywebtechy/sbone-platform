import type { Metadata } from 'next';
import { AccountDetails } from '@/components/AccountDetails/AccountDetails';
import { ACCOUNTS } from '@/components/Dashboard/dashboardData';

export const metadata: Metadata = {
  title: 'Accounts | SBOne',
};

// The Accounts tab opens on the first account; others are picked from the account switcher
export default function AccountsPage() {
  return <AccountDetails account={ACCOUNTS[0]} />;
}
