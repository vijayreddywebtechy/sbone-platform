'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Panel } from '@sbone/shared';
import { useStepBack } from '@/lib/stepNavigation';
import { FlowPage } from '../FlowPage/FlowPage';
import styles from './TermsConsent.module.scss';

const CONSENTS: Array<{ key: string; label: ReactNode }> = [
  {
    key: 'third-party-information',
    label: (
      <p className={styles.text}>
        I agree and confirm that: If I give Standard Bank personal information about or on behalf of another person
        (including, but not limited to, account signatories and shareholders), I confirm that I am authorised to: (a)
        give their personal information; (b) consent on their behalf to the processing of their personal information;
        and (c) receive any privacy notices on their behalf.
      </p>
    ),
  },
  {
    key: 'processing',
    label: (
      <>
        <p className={styles.text}>I consent to Standard Bank collecting and processing my personal information:</p>
        <p className={styles.text}>
          From external and public sources, where lawful and reasonable, for identity, address, and compliance purposes.
        </p>
        <p className={styles.text}>
          To analyse my interactions and create personalised client communications based on my interactions in the
          approval process, including operational notifications.
        </p>
        <p className={styles.text}>
          To share my personal information within the Group and/or with third-party service providers, including third
          parties who are not within the jurisdiction of the provided services.
        </p>
      </>
    ),
  },
  {
    key: 'liability',
    label: (
      <p className={styles.text}>
        Acknowledgment of Liability: By authorising this applicant, I confirm that I am duly authorised to grant access
        to the business’s banking profile. I acknowledge that Standard Bank shall not be held liable for any loss,
        damage, or fraudulent activity resulting from the applicant’s access or transactions. The business assumes full
        responsibility for all actions performed by this user under the assigned permissions.
      </p>
    ),
  },
];

/** The approver accepts the terms, privacy consents and liability before their approval is submitted. */
export function TermsConsent() {
  const router = useRouter();
  const goBack = useStepBack('/use-invite/approval');
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const allAccepted = CONSENTS.every((consent) => accepted[consent.key]);

  return (
    <FlowPage
      title="Terms & Conditions"
      subtitle="By continuing, you confirm that you have read and agree to the Terms & Conditions and Privacy Notice."
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Cancel
          </Button>
          {/* Submitting the approval isn't connected yet: NEXT goes straight to the confirmation */}
          <Button variant="secondary" disabled={!allAccepted} onClick={() => router.push('/use-invite/sent')}>
            Next
          </Button>
        </>
      }
    >
      <Panel
        title="Consent"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
            <path d="M14 3v5h5M9 14l2 2 4-4" />
          </svg>
        }
      >
        <fieldset className={styles.consents}>
          <legend className={styles.srOnly}>Terms, privacy consents and liability</legend>
          {CONSENTS.map((consent) => (
            <Checkbox
              key={consent.key}
              className={styles.consent}
              checked={Boolean(accepted[consent.key])}
              onChange={(event) => setAccepted((current) => ({ ...current, [consent.key]: event.target.checked }))}
              label={consent.label}
            />
          ))}
        </fieldset>
      </Panel>
    </FlowPage>
  );
}
