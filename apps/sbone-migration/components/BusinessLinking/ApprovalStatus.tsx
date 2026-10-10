'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@sbone/shared';
import type { Approver, BusinessProfileSummary } from '../BusinessProfile/businessProfiles';
import { ApproverList, ApproverNote, type ApprovalState } from './ApproverList';
import { LinkingCard, LinkingLayout } from './LinkingLayout';

export interface ApprovalStatusProps {
  business: BusinessProfileSummary;
  approvers: Approver[];
}

/** Step 3 of business linking: where each approval stands. DONE FOR NOW returns to the welcome page. */
export function ApprovalStatus({ business, approvers }: ApprovalStatusProps) {
  const router = useRouter();
  const titleId = useId();
  // Every approval starts pending until the approvals API reports otherwise
  const states = Object.fromEntries(approvers.map((approver) => [approver.email, 'pending' as ApprovalState]));

  return (
    <LinkingLayout
      currentStep={2}
      business={business}
      actions={
        <Button variant="secondary" onClick={() => router.push('/')}>
          Done for now
        </Button>
      }
    >
      <LinkingCard
        titleId={titleId}
        title="Approval Status"
        intro="Your request has been sent for approval to business director/members. You will be notified once all approvals are completed."
      >
        <ApproverList approvers={approvers} states={states} />
        <ApproverNote>Once all directors/members have approved your dashboard will be loaded</ApproverNote>
      </LinkingCard>
    </LinkingLayout>
  );
}
