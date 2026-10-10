'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { cx, Panel, Switch } from '@sbone/shared';
import { PROFILE } from './profileData';
import styles from './MyProfile.module.scss';

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** The signed-in user's own details, notification preferences and session, opened from the header's account menu. */
export function MyProfile() {
  const [notifications, setNotifications] = useState(PROFILE.notifications);

  const personal: Array<[string, string]> = [
    ['Full name', PROFILE.name],
    ['Role', PROFILE.role],
    ['Email address', PROFILE.email],
    ['Mobile', PROFILE.mobile],
    ['Country', `${PROFILE.country} (${PROFILE.countryCode})`],
    ['Default currency', `${PROFILE.currency} — ${PROFILE.currencyName}`],
    ['KYC', PROFILE.kycVerified ? 'Verified' : 'Pending review'],
  ];

  const channels: Array<{ key: keyof typeof notifications; label: string; value: string }> = [
    { key: 'email', label: 'Email', value: PROFILE.email },
    { key: 'sms', label: 'SMS', value: PROFILE.mobile },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon size={20}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>My Profile</h1>
      </header>

      {/* Summary */}
      <section className={styles.summary} aria-labelledby="profile-name">
        <span className={styles.avatar} aria-hidden="true">
          {initials(PROFILE.name)}
        </span>
        <div className={styles.summaryText}>
          <h2 id="profile-name" className={styles.name}>
            {PROFILE.name}
          </h2>
          <span className={styles.meta}>
            <span className={styles.status}>
              <span className={cx(styles.statusDot, PROFILE.kycVerified ? styles.dotGood : styles.dotWarn)} aria-hidden="true" />
              KYC {PROFILE.kycVerified ? 'verified' : 'pending'}
            </span>
            <span aria-hidden="true">·</span>
            {PROFILE.role}
            <span aria-hidden="true">·</span>
            {PROFILE.email}
          </span>
        </div>
      </section>

      <div className={styles.columns}>
        <Panel
          title="Personal Information"
          icon={
            <Icon size={20}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
            </Icon>
          }
        >
          <dl className={styles.details}>
            {personal.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <div className={styles.column}>
          <Panel
            title="Notifications"
            icon={
              <Icon size={20}>
                <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15ZM10 20.5a2 2 0 0 0 4 0" />
              </Icon>
            }
          >
            <ul className={styles.channels}>
              {channels.map((channel) => (
                <li key={channel.key} className={styles.channel}>
                  <span className={styles.channelText}>
                    <span className={styles.label}>{channel.label}</span>
                    <span className={styles.value}>{channel.value}</span>
                  </span>
                  <Switch
                    label={<span className={styles.srOnly}>{channel.label} notifications</span>}
                    checked={notifications[channel.key]}
                    onChange={(checked) => setNotifications((current) => ({ ...current, [channel.key]: checked }))}
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Security & Session"
            icon={
              <Icon size={20}>
                <rect x="5" y="10.5" width="14" height="10" rx="2" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
              </Icon>
            }
          >
            <dl className={styles.details}>
              <div>
                <dt>Authentication</dt>
                <dd>
                  <span className={styles.status}>
                    <span className={cx(styles.statusDot, styles.dotGood)} aria-hidden="true" />
                    Active session
                  </span>
                </dd>
              </div>
              <div>
                <dt>Last session</dt>
                <dd>{PROFILE.lastSession}</dd>
              </div>
              <div>
                <dt>Access level</dt>
                <dd>{PROFILE.accessLevel}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
