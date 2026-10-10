'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, cx, Panel } from '@sbone/shared';
import { rememberFlowStep } from '@/lib/stepNavigation';
import { APPROVAL_REQUEST, type ApprovalRequest, type ApprovalStatus, type RequestPerson } from './approvalRequest';
import { FlowPage } from '../FlowPage/FlowPage';
import styles from './ApprovalDetails.module.scss';

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
};

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

type Decision = 'declined' | null;

const TERMS_STEP = '/use-invite/terms';

export interface ApprovalDetailsProps {
  request?: ApprovalRequest;
}

/** An invited director/member reviews an enrolment request and approves or declines it. */
export function ApprovalDetails({ request = APPROVAL_REQUEST }: ApprovalDetailsProps) {
  const router = useRouter();
  // Approving continues to the terms; declining isn't sent anywhere yet, so it's only confirmed on screen
  const [decision, setDecision] = useState<Decision>(null);
  const approve = () => {
    rememberFlowStep(TERMS_STEP);
    router.push(TERMS_STEP);
  };
  const { requester, approvers, validUntil } = request;

  return (
    <FlowPage
      title="Approval Details"
      subtitle="Review the details below to approve or decline"
      actions={
        decision ? (
          <>
            <p className={styles.result} role="status">
              You’ve declined {requester.name}’s request.
            </p>
            <Button variant="secondary" onClick={() => router.push('/')}>
              Done
            </Button>
          </>
        ) : (
          <>
            <Button variant="text" onClick={() => router.push('/')}>
              Do it later
            </Button>
            <div className={styles.decisions}>
              <Button variant="secondaryOutline" onClick={() => setDecision('declined')}>
                Decline request
              </Button>
              <Button variant="secondary" onClick={approve}>
                Approve request
              </Button>
            </div>
          </>
        )
      }
    >
      <Panel title="Requester" icon={<PersonIcon />}>
        <PersonRow person={requester} extra={requester.requestedRole} />
      </Panel>

      <Panel title="Approvers" icon={<PeopleIcon />}>
        <ul className={styles.people}>
          {approvers.map((approver) => (
            <li key={approver.email}>
              <PersonRow person={approver} />
            </li>
          ))}
        </ul>
      </Panel>

      <Alert variant="neutral" icon={<InfoIcon />} className={styles.note}>
        Admins have full account access to move money, accept offers, statements, balances, transactions, security
        settings, manage team access and permissions. Roles and permissions can be customised or revoked by your admin
        after the profile is fully set up, and more team members can be added later.
      </Alert>

      <Alert variant="warning" icon={<WarningIcon />} className={styles.note}>
        This approval request is valid until {validUntil}. After this date, it will expire and can no longer be actioned.
      </Alert>
    </FlowPage>
  );
}

function PersonRow({ person, extra }: { person: RequestPerson; extra?: string }) {
  return (
    <div className={styles.person}>
      <span className={styles.avatar} aria-hidden="true">
        {initials(person.name)}
      </span>
      <div className={styles.personText}>
        <span className={styles.name}>{person.name}</span>
        {extra && (
          <span className={styles.detail}>
            Requested role <span className={styles.extra}>{extra}</span>
          </span>
        )}
        <span className={styles.detail}>
          {person.email} · {person.mobile}
        </span>
      </div>
      <span className={styles.status}>
        <span className={cx(styles.statusDot, styles[`dot_${person.status}`])} aria-hidden="true" />
        <span className={styles.srOnly}>Status: </span>
        {STATUS_LABELS[person.status]}
      </span>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v6M12 16.5h.01" />
    </svg>
  );
}
