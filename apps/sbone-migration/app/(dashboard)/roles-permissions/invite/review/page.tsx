import type { Metadata } from 'next';
import { ReviewInvite } from '@/components/InviteMembers/ReviewInvite';

export const metadata: Metadata = {
  title: 'Review and send invite | Invite Team Members | SBOne',
};

export default function ReviewInvitePage() {
  return <ReviewInvite />;
}
