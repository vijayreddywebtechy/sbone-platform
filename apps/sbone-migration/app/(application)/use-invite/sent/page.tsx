import type { Metadata } from 'next';
import { ApprovalSent } from '@/components/ApprovalSent/ApprovalSent';

export const metadata: Metadata = {
  title: 'Approval Sent | SBOne',
};

export default function ApprovalSentPage() {
  return <ApprovalSent />;
}
