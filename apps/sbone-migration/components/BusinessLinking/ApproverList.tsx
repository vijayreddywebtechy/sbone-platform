import type { ReactNode } from 'react';
import { Alert, cx } from '@sbone/shared';
import type { Approver } from '../BusinessProfile/businessProfiles';
import { InfoIcon } from './icons';
import styles from './ApproverList.module.scss';

export type ApprovalState = 'pending' | 'approved';

const STATE_LABELS: Record<ApprovalState, string> = {
  pending: 'Pending',
  approved: 'Approved',
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export interface ApproverListProps {
  approvers: Approver[];
  /** Approval state per approver email; when given, each row shows a status badge. */
  states?: Record<string, ApprovalState>;
}

/** "Approvers" heading and one row per director/member: initials, name, email, phone, role (and status). */
export function ApproverList({ approvers, states }: ApproverListProps) {
  return (
    <>
      <h3 className={styles.listTitle}>Approvers</h3>
      <ul className={styles.approvers}>
        {approvers.map((approver) => {
          const state = states?.[approver.email];
          return (
            <li key={approver.email} className={cx(styles.approver, states && styles.withStatus)}>
              <span className={styles.avatar} aria-hidden="true">
                {initials(approver.name)}
              </span>
              <span className={styles.identity}>
                <span className={styles.name}>{approver.name}</span>
                <span className={styles.detail}>
                  <span className={styles.srOnly}>Email: </span>
                  {approver.email}
                </span>
              </span>
              <span className={styles.meta}>
                <span className={styles.srOnly}>Phone: </span>
                {approver.phone}
              </span>
              <span className={styles.meta}>
                <span className={styles.srOnly}>Role: </span>
                {approver.role}
              </span>
              {state && (
                <span className={styles.status}>
                  <span className={cx(styles.statusDot, styles[`dot_${state}`])} aria-hidden="true" />
                  <span className={styles.srOnly}>Approval status: </span>
                  {STATE_LABELS[state]}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Neutral info note under the approver list. */
export function ApproverNote({ children }: { children: ReactNode }) {
  return (
    <Alert variant="neutral" icon={<InfoIcon />} className={styles.note}>
      {children}
    </Alert>
  );
}
