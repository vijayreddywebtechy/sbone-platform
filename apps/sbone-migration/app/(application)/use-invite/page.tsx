import type { Metadata } from 'next';
import { UseInvite } from '@/components/UseInvite/UseInvite';

export const metadata: Metadata = {
  title: 'Use invite | SBOne',
};

export default function UseInvitePage() {
  return <UseInvite />;
}
