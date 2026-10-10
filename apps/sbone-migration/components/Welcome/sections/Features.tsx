import type { ReactNode } from 'react';
import { Button } from '@sbone/shared';
import { AppearanceIcon, DigitalHubIcon, DocumentsIcon, ProfileIcon, QueryIcon, RolesIcon } from '../icons';
import styles from './Features.module.scss';

const FEATURES: Array<{ title: string; text: string; icon: ReactNode }> = [
  {
    title: 'Digital Hub',
    text: 'Never forget a password again. Sign into your digital banking platforms automatically through the Digital Hub.',
    icon: <DigitalHubIcon />,
  },
  {
    title: 'Roles & Permissions',
    text: 'We’re giving you even more control over your banking profile, with enhanced access management features for business admins/owners.',
    icon: <RolesIcon />,
  },
  {
    title: 'Profile management',
    text: 'Manage notification preferences and linked devices for better security oversight and peace of mind.',
    icon: <ProfileIcon />,
  },
  {
    title: 'Documents',
    text: 'Get official stamped monthly bank statements up to 2 years, account confirmation letters and more.',
    icon: <DocumentsIcon />,
  },
  {
    title: 'Query Tracker',
    text: 'Track and monitor queries in one place. Track their status and stay updated on the progress of your query.',
    icon: <QueryIcon />,
  },
  {
    title: 'Appearance',
    text: 'Personalise your experience by configuring the layout and look of your dashboard and more.',
    icon: <AppearanceIcon />,
  },
];

export function Features() {
  return (
    <section id="features" className={styles.section} aria-labelledby="features-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="features-title" className={styles.title}>
            Foundational features
          </h2>
          <p className={styles.intro}>
            To build amazing experiences of the future, we need to first build a solid foundation.
            <br />
            Here are some of the key foundational features we’re serving first.
          </p>
        </header>

        <ul className={styles.grid}>
          {FEATURES.map((feature) => (
            <li key={feature.title} className={styles.card}>
              <span className={styles.icon}>{feature.icon}</span>
              <div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardText}>{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <p className={styles.ctaText}>Are you an existing Standard Bank business client?</p>
          <Button variant="secondary">Enroll to SBOne</Button>
        </div>
      </div>
    </section>
  );
}
