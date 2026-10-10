import type { Metadata } from 'next';
import { SelectAccounts } from '@/components/InviteMembers/SelectAccounts';

export const metadata: Metadata = {
  title: 'Select accounts | Invite Team Members | SBOne',
};

export default function SelectAccountsPage() {
  return <SelectAccounts />;
}
