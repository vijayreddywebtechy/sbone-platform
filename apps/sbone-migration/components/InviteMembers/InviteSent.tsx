'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@sbone/shared';
import { useTeam } from '../RolesPermissions/TeamContext';
import { useInvite } from './InviteContext';
import styles from './InviteSent.module.scss';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Confirmation once the invite has been sent: who was invited, then invite someone else or go back to the team. */
export function InviteSent() {
  const router = useRouter();
  const { reset } = useInvite();
  const { lastInvited } = useTeam();
  const count = lastInvited.length;

  const finish = (href: string) => {
    reset();
    router.push(href);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/roles-permissions" className={styles.back} aria-label="Back to Roles & Permissions">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className={styles.heading}>
          <h1 className={styles.pageTitle}>Invite sent</h1>
          <p className={styles.pageSubtitle}>Your invitation is on its way</p>
        </div>
      </header>

      <section className={styles.card} aria-labelledby="invite-sent-title">
        <span className={styles.icon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 12.5 4 4 8-9" />
          </svg>
        </span>
        <h2 id="invite-sent-title" className={styles.title} tabIndex={-1}>
          {count === 0 ? 'Invitation sent' : `${count} ${count === 1 ? 'person' : 'people'} invited`}
        </h2>
        <p className={styles.text}>
          {count > 0
            ? `An email with the next steps has been sent. ${count > 1 ? 'They' : 'The invitee'} will appear as Invited until access is activated.`
            : 'An email with the next steps has been sent to complete the invite and activate access.'}
        </p>

        {count > 0 && (
          <ul className={styles.invitees} aria-label="Invited">
            {lastInvited.map((member) => (
              <li key={member.id} className={styles.invitee}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(member.name)}
                </span>
                <span className={styles.identity}>
                  <span className={styles.name}>{member.name}</span>
                  <span className={styles.detail}>{member.email}</span>
                </span>
                <span className={styles.role}>
                  <span className={styles.name}>{member.role}</span>
                  <span className={styles.status}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    Invited {member.date}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <Button variant="secondaryOutline" onClick={() => finish('/roles-permissions/invite')}>
            Invite another user
          </Button>
          <Button variant="secondary" onClick={() => finish('/roles-permissions')}>
            Done
          </Button>
        </div>
      </section>
    </div>
  );
}
