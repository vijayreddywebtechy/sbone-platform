import type { ReactNode } from 'react';
import { Stepper } from '@sbone/shared';
import type { BusinessProfileSummary } from '../BusinessProfile/businessProfiles';
import styles from './LinkingLayout.module.scss';

const STEPS = ['Role', 'Details', 'Status'];

export interface LinkingLayoutProps {
  /** Zero-based step: 0 = Role, 1 = Details, 2 = Status. */
  currentStep: number;
  business: BusinessProfileSummary;
  /** Buttons for the bar under the content, left to right. */
  actions: ReactNode;
  children: ReactNode;
}

/** Frame shared by the business-linking steps: progress, heading, the business being linked, and the action bar. */
export function LinkingLayout({ currentStep, business, actions, children }: LinkingLayoutProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Business Linking</h1>
        <p className={styles.subtitle}>To access your business on SBOne you will need an assigned role and approved access</p>
      </header>

      {/* Progress in a white card, as in the invite flow */}
      <div className={styles.progress}>
        <Stepper steps={STEPS} currentStep={currentStep} className={styles.stepper} />
      </div>

      <section className={styles.business} aria-label="Business being linked">
        <span className={styles.businessIcon}>
          <BuildingIcon />
        </span>
        <span className={styles.businessText}>
          <span className={styles.businessName}>{business.name}</span>
          <span className={styles.businessReg}>Reg No. {business.registrationNumber}</span>
        </span>
      </section>

      {children}

      <div className={styles.actions}>{actions}</div>
    </div>
  );
}

export interface LinkingCardProps {
  titleId: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}

/** White content card for a linking step: question/title, explanation, then the step's controls. */
export function LinkingCard({ titleId, title, intro, children }: LinkingCardProps) {
  return (
    <section className={styles.card} aria-labelledby={titleId}>
      {/* Same header as the dashboard panels */}
      <h2 id={titleId} className={styles.cardTitle}>
        {title}
      </h2>
      <div className={styles.cardBody}>
        <p className={styles.intro}>{intro}</p>
        {children}
      </div>
    </section>
  );
}

function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M7 34V7h15v27M22 15h11v19M4 34h32" />
      <path d="M11 11h2M16 11h2M11 15h2M16 15h2M11 19h2M16 19h2M11 23h2M16 23h2M11 27h2M16 27h2M26 20h3M26 24h3M26 28h3" />
    </svg>
  );
}
