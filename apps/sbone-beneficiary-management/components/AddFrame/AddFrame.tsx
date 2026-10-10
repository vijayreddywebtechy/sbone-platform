import type { ReactNode } from 'react';
import Link from 'next/link';
import { Stepper } from '@sbone/shared';
import styles from './AddFrame.module.scss';

export interface AddFrameProps {
  /** Last breadcrumb, e.g. "Add Beneficiary" */
  current: string;
  /** Step labels; omitted on screens without progress (edit) */
  steps?: string[];
  currentStep?: number;
  /** Buttons for the bar under the content, left to right */
  actions: ReactNode;
  children: ReactNode;
}

/** Frame for the add/edit screens: breadcrumb, progress in a white card, the content, and the action bar. */
export function AddFrame({ current, steps, currentStep = 0, actions, children }: AddFrameProps) {
  return (
    <div className={styles.page}>
      <nav aria-label="Breadcrumb">
        <ol className={styles.breadcrumb}>
          <li>
            {/* Home is in the platform zone: a plain link */}
            <a href="/dashboard" className={styles.crumb}>
              Home
            </a>
          </li>
          <li>
            <Link href="/" className={styles.crumb}>
              Beneficiary Management
            </Link>
          </li>
          <li aria-current="page">{current}</li>
        </ol>
      </nav>

      {steps && (
        <div className={styles.progress}>
          <Stepper steps={steps} currentStep={currentStep} className={styles.stepper} />
        </div>
      )}

      {children}

      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
