'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Collapse, RadioGroup } from '@sbone/shared';
import { rememberFlowStep, useStepBack } from '@/lib/stepNavigation';
import type { Approver, BusinessProfileSummary } from '../BusinessProfile/businessProfiles';
import { LinkingCard, LinkingLayout } from './LinkingLayout';
import { ApproverList, ApproverNote } from './ApproverList';
import { WarningIcon } from './icons';
import styles from './ApprovalList.module.scss';

const CONFIRM_OPTIONS = [
  { value: 'yes', label: 'Yes, all director contact details are correct' },
  { value: 'no', label: 'No, details are not correct' },
];

export interface ApprovalListProps {
  business: BusinessProfileSummary;
  approvers: Approver[];
}

/** Step 2 of business linking: who will approve the request, and confirming their contact details. */
export function ApprovalList({ business, approvers }: ApprovalListProps) {
  const router = useRouter();
  const goBack = useStepBack(`/business-linking/${business.id}`);
  // Unique radio group name per instance (visited pages stay mounted, hidden)
  const groupId = useId();
  const [confirmed, setConfirmed] = useState<string>();

  return (
    <LinkingLayout
      currentStep={1}
      business={business}
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Back
          </Button>
          <Button
            variant="secondary"

            disabled={confirmed !== 'yes'}
            onClick={() => {
              const next = `/business-linking/${business.id}/status`;
              rememberFlowStep(next);
              router.push(next);
            }}
          >
            Continue
          </Button>
        </>
      }
    >
      <LinkingCard
        titleId={`${groupId}-title`}
        title="Approval List"
        intro="Your request has been sent for approval to business director/members. You will be notified once all approvals are completed."
      >
        <ApproverList approvers={approvers} />

        <ApproverNote>
          Ensure all director details are correct, they are required for email invites, notifications and OTPs
        </ApproverNote>

        <RadioGroup
          appearance="plain"
          className={styles.confirm}
          label={<span className={styles.srOnly}>Are the director contact details correct?</span>}
          name={`${groupId}-confirm`}
          options={CONFIRM_OPTIONS}
          value={confirmed}
          onChange={setConfirmed}
        />

        <Collapse open={confirmed === 'no'}>
          <Alert variant="warning" icon={<WarningIcon />} className={styles.followUp}>
            Please contact your banker to update the director details. You can continue once they are correct.
          </Alert>
        </Collapse>
      </LinkingCard>
    </LinkingLayout>
  );
}
