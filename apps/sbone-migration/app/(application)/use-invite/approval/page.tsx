import type { Metadata } from 'next';
import { ApprovalDetails } from '@/components/ApprovalDetails/ApprovalDetails';

export const metadata: Metadata = {
  title: 'Approval Details | SBOne',
};

export default function ApprovalDetailsPage() {
  return <ApprovalDetails />;
}
