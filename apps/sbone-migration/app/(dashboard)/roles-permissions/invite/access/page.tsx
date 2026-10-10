import type { Metadata } from 'next';
import { ConfigureAccess } from '@/components/InviteMembers/ConfigureAccess';

export const metadata: Metadata = {
  title: 'Configure access | Invite Team Members | SBOne',
};

export default function ConfigureAccessPage() {
  return <ConfigureAccess />;
}
