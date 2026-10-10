import type { ReactNode } from 'react';
import { cx } from '@sbone/shared';
import type { AccountType } from '../Dashboard/dashboardData';
import styles from './AccountIcon.module.scss';

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ICONS: Record<AccountType, ReactNode> = {
  current: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </Icon>
  ),
  savings: (
    <Icon>
      <path d="M5 11a7 6 0 0 1 13-2h2v4l-2 1v3h-3v-2H9v2H6v-3a6 6 0 0 1-1-3Z" />
      <path d="M10 7.5h3" />
    </Icon>
  ),
  notice: (
    <Icon>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9 3h6" />
    </Icon>
  ),
  foreign: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  ),
};

/** Rounded tile with an icon and tint for the account's type. */
export function AccountIcon({ type, className }: { type: AccountType; className?: string }) {
  return <span className={cx(styles.icon, styles[type], className)}>{ICONS[type]}</span>;
}
