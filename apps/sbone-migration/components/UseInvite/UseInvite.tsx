'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Panel, TextField } from '@sbone/shared';
import { FlowPage } from '../FlowPage/FlowPage';
import styles from './UseInvite.module.scss';

/** Lets an invited user find their enrolment request with the invite's reference code and their ID/passport. */
export function UseInvite() {
  const router = useRouter();
  const formId = useId();
  const [reference, setReference] = useState('');
  const [identity, setIdentity] = useState('');

  const canContinue = reference.trim() !== '' && identity.trim() !== '';

  // Looking up the request isn't connected yet: NEXT goes straight to the one-time PIN step
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (canContinue) router.push('/use-invite/otp');
  };

  return (
    <FlowPage
      title="Capture Invitation Details"
      subtitle="Enter the details below as they appear on the invitation"
      actions={
        <>
          <Button variant="text" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button variant="secondary" type="submit" form={formId} disabled={!canContinue}>
            Next
          </Button>
        </>
      }
    >
      <Panel
        title="Invitation"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
          </svg>
        }
      >
        <form id={formId} onSubmit={submit} noValidate>
          <div className={styles.fields}>
            <TextField
              variant="floating"
              label="Reference Code*"
              name="reference"
              autoComplete="off"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className={styles.field}
            />
            <TextField
              variant="floating"
              label="South African ID/ Passport"
              name="identity"
              autoComplete="off"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              className={styles.field}
            />
          </div>

          <Alert variant="neutral" icon={<InfoIcon />} className={styles.note}>
            You’ll find the reference code in the invite email sent to you by your business administrator.
          </Alert>
        </form>
      </Panel>
    </FlowPage>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}
