import type { Metadata } from 'next';
import { InviteSent } from '@/components/InviteMembers/InviteSent';

export const metadata: Metadata = {
  title: 'Invite sent | SBOne',
};

export default function InviteSentPage() {
  return <InviteSent />;
}
