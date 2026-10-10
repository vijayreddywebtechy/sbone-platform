'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Button, cx, Modal, Panel } from '@sbone/shared';
import { FlowPage } from '../FlowPage/FlowPage';
import { APPLICATION, type Application, type ApplicationDirector } from './applicationData';
import styles from './ApplicationStatus.module.scss';

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const STATUS_LABELS = { signed: 'Signed', pending: 'Pending' } as const;

/** Status words with their icon: a tick once signed, a clock while pending */
function SignatureStatus({ director }: { director: ApplicationDirector }) {
  const signed = director.status === 'signed';
  return (
    <span className={cx(styles.statusText, signed ? styles.signed : styles.pending)}>
      {STATUS_LABELS[director.status]}
      <Icon size={16}>{signed ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>}</Icon>
    </span>
  );
}

/** Standalone page (no dashboard shell): a submitted account application waiting on director signatures: summary, each director's status and what happens next. */
export function ApplicationStatus({ application = APPLICATION }: { application?: Application }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { applicant, directors } = application;
  const signedCount = directors.filter((director) => director.status === 'signed').length;

  return (
    <FlowPage title={`Welcome, ${applicant.firstName}`} subtitle={applicant.company}>

      <Panel
        title="We’ve received your application"
        collapsible
        icon={
          <Icon size={20}>
            <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
            <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </Icon>
        }
      >
        {/* The application at a glance */}
        <section className={styles.summary} aria-label="Application">
          <Image src="/images/application/business-card.svg" alt="" width={120} height={80} className={styles.cardImage} />
          <span className={styles.summaryText}>
            <span className={styles.eyebrow}>Application submitted</span>
            <span className={styles.product}>{application.product}</span>
            <span className={styles.reference}>Reference No: {application.reference}</span>
          </span>
          <span className={styles.summaryEnd}>
            <Button
              variant="secondary"
              endIcon={
                <Icon size={16}>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </Icon>
              }
              onClick={() => setDetailsOpen(true)}
            >
              View details
            </Button>
            <span className={styles.awaiting}>
              <Icon size={16}>
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 10h16M9 3v4M15 3v4" />
              </Icon>
              {application.status}
            </span>
          </span>
        </section>

        {/* Each director's signature */}
        <section aria-labelledby="directors-title">
          <div className={styles.directorsHeader}>
            <h2 id="directors-title" className={styles.directorsTitle}>
              Director’s application status
            </h2>
            <span className={styles.count}>
              {signedCount} of {directors.length} signed
            </span>
          </div>
          <ul className={styles.directors}>
            {directors.map((director) => (
              <li key={director.name} className={styles.director}>
                <span className={cx(styles.ring, director.status === 'signed' ? styles.ringSigned : styles.ringPending)} aria-hidden="true" />
                <span className={styles.directorText}>
                  <span className={styles.name}>
                    {director.name}
                    {director.isYou && ' (You)'}
                  </span>
                  <span className={styles.role}>{director.role}</span>
                  {director.note && <span className={styles.role}>{director.note}</span>}
                </span>
                <SignatureStatus director={director} />
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.footnote}>
          Your account will be opened once all the necessary checks are complete and all directors have approved their part of the
          application.
        </p>
      </Panel>

      <Modal
        open={detailsOpen}
        title="Application details"
        onClose={() => setDetailsOpen(false)}
        footer={
          <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        }
      >
        <dl className={styles.facts}>
          <div>
            <dt>Product</dt>
            <dd>{application.product}</dd>
          </div>
          <div>
            <dt>Reference number</dt>
            <dd>{application.reference}</dd>
          </div>
          <div>
            <dt>Business</dt>
            <dd>{applicant.company}</dd>
          </div>
          <div>
            <dt>Submitted</dt>
            <dd>{application.submittedOn}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{application.status}</dd>
          </div>
        </dl>
        <h3 className={styles.modalHeading}>Director signatures</h3>
        <ul className={styles.modalDirectors}>
          {directors.map((director) => (
            <li key={director.name}>
              <span>
                <span className={styles.name}>
                  {director.name}
                  {director.isYou && ' (You)'}
                </span>
                <span className={styles.role}>
                  {director.role}
                  {director.signedOn ? ` · signed ${director.signedOn}` : director.note ? ` · ${director.note}` : ''}
                </span>
              </span>
              <SignatureStatus director={director} />
            </li>
          ))}
        </ul>
      </Modal>
    </FlowPage>
  );
}
