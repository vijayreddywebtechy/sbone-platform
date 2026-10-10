'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { cx, FigureStrip, Panel, Segmented, Toolbar, useActiveCompany } from '@sbone/shared';
import {
  BUSINESS_DETAILS,
  daysSince,
  formatAmount,
  formatDate,
  formatMonthYear,
  initials,
  maskNumber,
  yearsSince,
  type LinkedAccountType,
} from './businessDetailsData';
import styles from './BusinessDetails.module.scss';

type AccountFilter = 'all' | LinkedAccountType;
type DirectorFilter = 'all' | 'pending' | 'approved';

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const QUICK_LINKS: Array<{ href: string; label: string; description: string; icon: ReactNode }> = [
  {
    href: '/accounts',
    label: 'Accounts',
    description: 'Balances and transactions',
    icon: <path d="m3 9 9-5 9 5M4 9h16M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18" />,
  },
  {
    href: '/insights',
    label: 'Insights',
    description: 'Cash flow and spending',
    icon: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  },
  {
    href: '/documents',
    label: 'Documents',
    description: 'Statements and letters',
    icon: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" />
      </>
    ),
  },
  {
    href: '/roles-permissions',
    label: 'Roles & Permissions',
    description: 'Team members and access',
    icon: <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6Z" />,
  },
];

/** Profile of the business chosen in the header's Switch Business menu: summary, accounts, directors, legal identity and compliance. */
export function BusinessDetails() {
  const { company } = useActiveCompany();
  const details = BUSINESS_DETAILS[company.id] ?? BUSINESS_DETAILS.abc;
  const [accountFilter, setAccountFilter] = useState<AccountFilter>('all');
  const [directorFilter, setDirectorFilter] = useState<DirectorFilter>('all');

  const { accounts, directors } = details;
  const currentCount = accounts.filter((a) => a.type === 'current').length;
  const savingsCount = accounts.length - currentCount;
  const totalAvailable = accounts.reduce((sum, a) => sum + a.available, 0);
  const oldest = accounts.reduce((first, a) => (a.opened < first.opened ? a : first), accounts[0]);
  const years = yearsSince(oldest.opened).toFixed(1);
  const pending = directors.filter((d) => d.status === 'pending').length;
  const verified = details.kycStatus === 'verified';

  const shownAccounts = accounts.filter((a) => accountFilter === 'all' || a.type === accountFilter);
  const shownDirectors = directors.filter((d) => directorFilter === 'all' || d.status === directorFilter);

  const compliance: Array<{ title: string; detail: string; done: boolean }> = [
    { title: 'KYC status', detail: verified ? 'Verified' : 'Pending review', done: verified },
    { title: 'Business identity verified', detail: details.businessPartnerRef, done: true },
    { title: 'Legal entity registered', detail: details.legalEntityRef, done: true },
    { title: 'Profile status', detail: details.profileStatus === 'APPROVED' ? 'Active' : 'In review', done: details.profileStatus === 'APPROVED' },
    { title: 'Administrator linked', detail: details.admin.email, done: true },
    { title: 'Bank accounts linked', detail: `${accounts.length} account${accounts.length === 1 ? '' : 's'}`, done: accounts.length > 0 },
    { title: 'Directors / approvers', detail: `${directors.length} on record`, done: directors.length > 0 },
    { title: 'Profile completeness', detail: `${details.profileCompleteness}% complete`, done: details.profileCompleteness >= 80 },
  ];

  const legal: Array<[string, string]> = [
    ['Registered name', details.registeredName],
    ['Registration number', details.registrationNumber],
    ['Trading name', details.tradingName],
    ['Industry / sector', details.industry],
    ['Business type', details.businessType],
    ['Domicile', `${details.country} (${details.countryCode})`],
    ['Currency', `${details.currency} — ${details.currencyName}`],
    ['Business tax number', details.taxNumber ?? 'Not available'],
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon size={20}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>Business Details</h1>
      </header>

      {/* Summary */}
      <section className={styles.summary} aria-labelledby="business-name">
        <div className={styles.summaryTop}>
          <span className={styles.avatar} aria-hidden="true">
            {/* The design shows the name's first two letters ("AT" for ATHITHI) */}
            {details.registeredName.replace(/[^A-Z]/gi, '').slice(0, 2).toUpperCase()}
          </span>
          <div className={styles.entityText}>
            <h2 id="business-name" className={styles.entityName}>
              {details.registeredName}
            </h2>
            <span className={styles.entityMeta}>
              <span className={styles.status}>
                <span className={cx(styles.statusDot, verified ? styles.dotGood : styles.dotWarn)} aria-hidden="true" />
                KYC {verified ? 'verified' : 'pending'}
              </span>
              <span aria-hidden="true">·</span>
              {details.country} · {details.currency}
              <span aria-hidden="true">·</span>
              Reg. {details.registrationNumber}
            </span>
          </div>
          <div className={styles.admin}>
            <span className={styles.adminAvatar} aria-hidden="true">
              {initials(details.admin.name)}
            </span>
            <span className={styles.adminText}>
              <span className={styles.adminLabel}>Profile admin</span>
              <span className={styles.adminName}>
                {details.admin.name}
                <span
                  className={cx(styles.presence, details.admin.online && styles.presenceOnline)}
                  role="img"
                  aria-label={details.admin.online ? 'Online' : 'Offline'}
                />
              </span>
              <span className={styles.adminEmail}>{details.admin.email}</span>
            </span>
          </div>
        </div>
        <FigureStrip
          wide
          figures={[
            { label: 'Total available balance', value: formatAmount(totalAvailable), note: `Across ${accounts.length} accounts` },
            { label: 'Open accounts', value: accounts.length, note: `${currentCount} current · ${savingsCount} savings` },
            { label: 'Directors / approvers', value: directors.length, note: pending > 0 ? `${pending} pending approval` : 'All approved' },
            { label: 'Banking since', value: formatMonthYear(oldest.opened), note: `${years} year relationship` },
          ]}
        />
      </section>

      <div className={styles.columns}>
        <div className={styles.column}>
          {/* Linked accounts */}
          <Panel
            title="Linked Accounts"
            icon={
              <Icon size={20}>
                <rect x="3" y="5.5" width="18" height="13" rx="2" />
                <path d="M3 10h18" />
              </Icon>
            }
          >
            <Toolbar
              start={
                <Segmented
                  label="Show accounts"
                  options={[
                    { value: 'all' as AccountFilter, label: 'All', count: accounts.length },
                    { value: 'current' as AccountFilter, label: 'Current', count: currentCount },
                    { value: 'savings' as AccountFilter, label: 'Savings', count: savingsCount },
                  ]}
                  value={accountFilter}
                  onChange={setAccountFilter}
                />
              }
            />
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Account</th>
                    <th scope="col" className={styles.wideOnly}>
                      Opened
                    </th>
                    <th scope="col" className={styles.amount}>
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shownAccounts.map((account) => (
                    <tr key={account.number}>
                      <td>
                        <span className={styles.primary}>{account.name}</span>
                        <span className={styles.secondary}>
                          {maskNumber(account.number)} · {account.type === 'current' ? 'Current' : 'Savings'}
                        </span>
                      </td>
                      <td className={styles.wideOnly}>
                        <span className={styles.primary}>{formatDate(account.opened)}</span>
                        <span className={styles.secondary}>{daysSince(account.opened)} days ago</span>
                      </td>
                      <td className={styles.amount}>
                        <span className={cx(styles.primary, account.balance < 0 && styles.negative)}>{formatAmount(account.balance)}</span>
                        <span className={cx(styles.secondary, styles.wideOnlyBlock)}>{formatAmount(account.available)} available</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Directors */}
          <Panel
            title="Directors & Approvers"
            icon={
              <Icon size={20}>
                <circle cx="9" cy="8" r="3.5" />
                <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7" />
              </Icon>
            }
          >
            <Toolbar
              start={
                <Segmented
                  label="Show directors"
                  options={[
                    { value: 'all' as DirectorFilter, label: 'All', count: directors.length },
                    { value: 'pending' as DirectorFilter, label: 'Pending', count: pending },
                    { value: 'approved' as DirectorFilter, label: 'Approved', count: directors.length - pending },
                  ]}
                  value={directorFilter}
                  onChange={setDirectorFilter}
                />
              }
            />
            <ul className={styles.directors}>
              {shownDirectors.map((director) => (
                <li key={director.name} className={styles.director}>
                  <span className={styles.directorAvatar} aria-hidden="true">
                    {initials(director.name)}
                  </span>
                  <span className={styles.directorName}>{director.name}</span>
                  <span className={styles.status}>
                    <span className={cx(styles.statusDot, director.status === 'approved' ? styles.dotGood : styles.dotWarn)} aria-hidden="true" />
                    {director.status === 'approved' ? 'Approved' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className={styles.column}>
          {/* Legal identity */}
          <Panel
            title="Legal Identity"
            icon={
              <Icon size={20}>
                <path d="m3 9 9-5 9 5M4 9h16M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18" />
              </Icon>
            }
          >
            <dl className={styles.legal}>
              {legal.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          {/* Compliance */}
          <Panel
            title="Compliance & KYC"
            icon={
              <Icon size={20}>
                <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6Z" />
              </Icon>
            }
          >
            <ul className={styles.checks}>
              {compliance.map((item) => (
                <li key={item.title} className={styles.check}>
                  <span className={item.done ? styles.checkDone : styles.checkPending}>
                    <Icon size={16}>
                      <circle cx="12" cy="12" r="9" />
                      {item.done ? <path d="m8.5 12 2.5 2.5 4.5-5" /> : <path d="M12 7.5V12l3 2" />}
                    </Icon>
                    <span className={styles.srOnly}>{item.done ? 'Complete: ' : 'Outstanding: '}</span>
                  </span>
                  <span className={styles.checkTitle}>{item.title}</span>
                  <span className={styles.checkDetail}>{item.detail}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Quick links */}
          <Panel
            title="Quick Links"
            icon={
              <Icon size={20}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Icon>
            }
          >
            <nav aria-label="Quick links">
              <ul className={styles.links}>
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      <span className={styles.linkIcon}>
                        <Icon>{link.icon}</Icon>
                      </span>
                      <span className={styles.linkText}>
                        <span className={styles.primary}>{link.label}</span>
                        <span className={styles.secondary}>{link.description}</span>
                      </span>
                      <Icon size={16}>
                        <path d="m9 6 6 6-6 6" />
                      </Icon>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Panel>
        </div>
      </div>
    </div>
  );
}
