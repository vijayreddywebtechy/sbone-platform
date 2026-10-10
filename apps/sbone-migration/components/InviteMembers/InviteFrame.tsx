import type { ReactNode } from 'react';
import Link from 'next/link';
import { Stepper } from '@sbone/shared';
import styles from './InviteFrame.module.scss';

const STEPS = ['Type', 'Users', 'Access', 'Accounts', 'Review'];

export interface InviteFrameProps {
  /** Zero-based: 0 = Type, 1 = Users, 2 = Access, 3 = Accounts, 4 = Review. */
  currentStep: number;
  /** The step's title and line under it, shown at the top of the page */
  title: string;
  subtitle: string;
  /** Buttons for the bar right under the step's content, left to right. */
  actions: ReactNode;
  children: ReactNode;
}

/** Frame shared by the invite-team-members steps: breadcrumb, progress, the step, and its action bar. */
export function InviteFrame({ currentStep, title, subtitle, actions, children }: InviteFrameProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/roles-permissions" className={styles.back} aria-label="Back to Roles & Permissions">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className={styles.heading}>
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumb}>
              <li>
                <Link href="/dashboard" className={styles.crumb}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/roles-permissions" className={styles.crumb}>
                  Roles &amp; Permissions
                </Link>
              </li>
              <li aria-current="page">Invite Team Members</li>
            </ol>
          </nav>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </header>

      <div className={styles.progress}>
        <Stepper steps={STEPS} currentStep={currentStep} className={styles.stepper} />
      </div>

      {children}

      {/* Kept right under the step's content rather than at the bottom of the screen */}
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
