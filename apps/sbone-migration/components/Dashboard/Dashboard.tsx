import type { ReactNode } from 'react';
import { ActiveCompanyLabel, Button, Panel } from '@sbone/shared';
import Image from 'next/image';
import { BANKER, DIGITAL_HUB_LINKS, USER, WHATS_NEW } from './dashboardData';
import { AccountsPanel } from './widgets/AccountsPanel';
import { CashflowPanel } from './widgets/CashflowPanel';
import { FxCalculator } from './widgets/FxCalculator';
import styles from './Dashboard.module.scss';

const Icon = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ExternalIcon = () => (
  <Icon size={16}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
);

const ChevronIcon = () => (
  <Icon size={18}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

const LINK_ICONS = [
  <Icon key="obb">
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M8 20h8M12 16v4" />
  </Icon>,
  <Icon key="trade">
    <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
  </Icon>,
  <Icon key="bol">
    <rect x="4" y="4" width="16" height="12" rx="1.5" />
    <path d="M2 20h20" />
  </Icon>,
];

const WHATS_NEW_ICONS = [
  <Icon key="hub">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 17.5h7M17.5 14v7" />
  </Icon>,
  <Icon key="docs">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </Icon>,
  <Icon key="cash">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Icon>,
  <Icon key="roles">
    <circle cx="9" cy="8" r="3" />
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5" />
  </Icon>,
];

/** Signed-in home: accounts, cashflow, campaigns and what's new, with quick tools in a side column. */
export function Dashboard() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome, {USER.name.split(' ')[0]}</h1>
          <p className={styles.meta}>
            <ActiveCompanyLabel /> | Last Signed In - {USER.lastSignedIn}
          </p>
        </div>
        <Button variant="secondary" endIcon={<ExternalIcon />}>
          Transact
        </Button>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <AccountsPanel />
          <CashflowPanel />

          <Panel
            title="Campaigns"
            icon={
              <Icon>
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4a2 2 0 0 0 0 4M12 8s1.5-4 4-4a2 2 0 0 1 0 4" />
              </Icon>
            }
            collapsible
          >
            <article className={styles.campaign} aria-labelledby="campaign-title">
              <div className={styles.campaignText}>
                <h3 id="campaign-title" className={styles.campaignTitle}>
                  Business Current Account
                </h3>
                <p className={styles.campaignBody}>
                  Run your business with a business bank account that lets you manage your money and transact 24/7 from
                  your Banking App or Internet Banking.
                </p>
                <Button variant="inverse" className={styles.apply}>
                  Apply now
                </Button>
              </div>
              <div className={styles.campaignArt}>
                <Image src="/images/welcome/app-phone.svg" alt="" width={140} height={280} className={styles.phone} />
              </div>
            </article>
          </Panel>

          <section aria-labelledby="whats-new-title">
            <h2 id="whats-new-title" className={styles.sectionTitle}>
              What’s new on SBOne
            </h2>
            <ul className={styles.whatsNew}>
              {WHATS_NEW.map((item, index) => (
                <li key={item.title} className={styles.newItem}>
                  <h3 className={styles.newTitle}>
                    <span className={styles.newIcon}>{WHATS_NEW_ICONS[index]}</span>
                    {item.title}
                  </h3>
                  <p className={styles.newText}>{item.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.sideColumn}>
          <Panel title="Digital Hub Links" className={styles.flush}>
            <ul className={styles.links}>
              {DIGITAL_HUB_LINKS.map((link, index) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer" className={styles.link}>
                    <span className={styles.linkIcon}>{LINK_ICONS[index]}</span>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <span className={styles.linkEnd}>
                      <ExternalIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>

          <FxCalculator />

          <Panel title="Contact Your Banker" className={`${styles.flush} ${styles.sticky}`}>
            <div className={styles.banker}>
              <span className={styles.avatar} aria-hidden="true">
                {BANKER.initials}
              </span>
              <span>
                <span className={styles.bankerName}>{BANKER.name}</span>
                <span className={styles.bankerTeam}>{BANKER.team}</span>
              </span>
            </div>
            <ul className={styles.links}>
              <li>
                <a href={`mailto:${BANKER.email}`} className={styles.link}>
                  <span className={styles.linkIcon}>
                    <Icon>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </Icon>
                  </span>
                  <span className={styles.linkLabel}>{BANKER.email}</span>
                  <span className={styles.linkEnd}>
                    <ChevronIcon />
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${BANKER.phone.replace(/\s/g, '')}`} className={styles.link}>
                  <span className={styles.linkIcon}>
                    <Icon>
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                    </Icon>
                  </span>
                  <span className={styles.linkLabel}>{BANKER.phone}</span>
                  <span className={styles.linkEnd}>
                    <ChevronIcon />
                  </span>
                </a>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
