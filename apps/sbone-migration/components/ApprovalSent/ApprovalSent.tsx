'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@sbone/shared';
import { FlowPage } from '../FlowPage/FlowPage';
import styles from './ApprovalSent.module.scss';

/** Confirmation after an approver accepts the terms; DONE returns to the welcome page. */
export function ApprovalSent() {
  const router = useRouter();

  return (
    <FlowPage title="Approval Sent" subtitle="Your approval is on its way">
      <section className={styles.card} aria-labelledby="approval-sent-title">
        <span className={styles.icon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 12.5 4 4 8-9" />
          </svg>
        </span>
        <h2 id="approval-sent-title" className={styles.title}>
          Thank you, your approval has been noted
        </h2>
        <p className={styles.text}>
          Access will be granted once profile creation is finalised. You will be notified when all approvals are complete.
        </p>
        <Button variant="secondary" className={styles.done} onClick={() => router.push('/')}>
          Done
        </Button>
      </section>
    </FlowPage>
  );
}
