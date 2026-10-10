import type { Metadata } from 'next';
import { SelectUsers } from '@/components/InviteMembers/SelectUsers';

export const metadata: Metadata = {
  title: 'Select users | Invite Team Members | SBOne',
};

export default function SelectUsersPage() {
  return <SelectUsers />;
}
