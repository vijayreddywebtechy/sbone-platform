import type { ReactNode } from 'react';
import { InviteProvider } from '@/components/InviteMembers/InviteContext';

// Keeps the invite choices (selected users, job titles) while moving between the steps
export default function InviteLayout({ children }: { children: ReactNode }) {
  return <InviteProvider>{children}</InviteProvider>;
}
