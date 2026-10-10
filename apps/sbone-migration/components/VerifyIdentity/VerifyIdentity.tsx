'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alert, Button, Panel } from '@sbone/shared';
import { FlowPage } from '../FlowPage/FlowPage';
import styles from './VerifyIdentity.module.scss';

// Hand-off to the iiDENTIFii face scan isn't connected yet: SCAN shows its loading state for VERIFY_MS, then
// continues to the business profile step as if the scan had succeeded
const REDIRECT_SECONDS = 10;
const VERIFY_MS = 1500;
const NEXT_STEP = '/business-profile';

const REQUIREMENTS = [
  'Remove your glasses',
  'Avoid bright backgrounds',
  'Ensure your face can be seen clearly',
  'Ensure you don’t wear a hat',
];

export function VerifyIdentity() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [scanRequested, setScanRequested] = useState(false);
  // The scan starts when the user selects SCAN or the countdown runs out
  const scanning = scanRequested || secondsLeft === 0;

  useEffect(() => {
    if (scanning) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [scanning, secondsLeft]);

  useEffect(() => {
    if (!scanning) return;
    const timer = setTimeout(() => router.push(NEXT_STEP), VERIFY_MS);
    return () => clearTimeout(timer);
  }, [scanning, router]);

  return (
    <FlowPage
      title="Verify your identity"
      subtitle="Verify your identity on your mobile or desktop"
      actions={
        <Button variant="secondary" className={styles.action} loading={scanning} onClick={() => setScanRequested(true)}>
          Scan
        </Button>
      }
    >
      <Alert variant="neutral" icon={<InfoIcon />} className={styles.notice}>
        To verify your identity, we’ll securely share your information with the Department of Home Affairs and
        iiDENTIFii, our trusted identity verification partner.
      </Alert>

      <Panel
        title="Face scan"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
            <circle cx="12" cy="11" r="3" />
            <path d="M8 17c.8-1.5 2.3-2.5 4-2.5s3.2 1 4 2.5" />
          </svg>
        }
      >
        <div className={styles.body}>
          <div className={styles.illustration}>
            <Image src="/images/verify-identity/face-scan.svg" alt="" width={160} height={130} loading="eager" />
          </div>
          <div className={styles.details}>
            <h2 id="scan-heading" className={styles.heading}>
              You’ll be redirected to scan your face in{' '}
              <span className={styles.countdown} aria-live="polite">
                {secondsLeft}s
              </span>
            </h2>
            <p className={styles.description}>
              Select Scan to continue. You’ll be asked to allow camera access so iiDENTIFii, our authorised identity
              verification partner, can securely verify your identity against official records.
            </p>
            <h3 className={styles.listTitle}>You’ll need to</h3>
            <ul className={styles.list}>
              {REQUIREMENTS.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
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
