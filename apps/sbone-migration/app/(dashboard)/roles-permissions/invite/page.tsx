import type { Metadata } from 'next';
import { InviteType } from '@/components/InviteMembers/InviteType';

export const metadata: Metadata = {
  title: 'Invite User | SBOne',
};

export default function InviteTeamMembersPage() {
  return <InviteType />;
}
