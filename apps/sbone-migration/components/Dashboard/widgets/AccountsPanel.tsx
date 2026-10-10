'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CardsViewIcon, cx, ListViewIcon, Pager, Panel, Segmented } from '@sbone/shared';
import { AccountIcon } from '../../AccountIcon/AccountIcon';
import { ACCOUNTS, ACCOUNT_TYPE_LABELS, formatMoney, formatRand, toRand, type Account } from '../dashboardData';
import styles from './AccountsPanel.module.scss';

const PAGE_SIZE = 3;
const HIDDEN = 'R ••• •••.••';

type View = 'grid' | 'list';

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </svg>
);

const EyeIcon = ({ hidden }: { hidden: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {hidden && <path d="M4 4l16 16" />}
  </svg>
);

/** Total balance across accounts, then the accounts as cards or a list, a few per page. */
export function AccountsPanel({ accounts = ACCOUNTS }: { accounts?: Account[] }) {
  const [showBalances, setShowBalances] = useState(true);
  const [view, setView] = useState<View>('grid');
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(accounts.length / PAGE_SIZE);
  const first = page * PAGE_SIZE;
  const visible = accounts.slice(first, first + PAGE_SIZE);
  // Total in rand: foreign-currency balances are converted at today's rate
  const total = accounts.reduce((sum, account) => sum + toRand(account), 0);
  const balance = (account: Account) => (showBalances ? formatMoney(account.balance, account.currency) : HIDDEN);

  return (
    <Panel title="Accounts" icon={<WalletIcon />} collapsible>
      <div className={styles.summary}>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total available balance</span>
          <span className={styles.totalValue}>{showBalances ? formatRand(total) : HIDDEN}</span>
        </div>
        <button
          type="button"
          className={styles.eye}
          aria-pressed={!showBalances}
          aria-label={showBalances ? 'Hide balances' : 'Show balances'}
          title={showBalances ? 'Hide balances' : 'Show balances'}
          onClick={() => setShowBalances((value) => !value)}
        >
          <EyeIcon hidden={!showBalances} />
        </button>
        <span className={styles.viewSwitch}>
          <Segmented
            label="Layout"
            options={[
              { value: 'grid' as View, label: 'Cards', icon: <CardsViewIcon /> },
              { value: 'list' as View, label: 'List', icon: <ListViewIcon /> },
            ]}
            value={view}
            onChange={setView}
          />
        </span>
      </div>

      <ul className={view === 'grid' ? styles.grid : styles.list}>
        {visible.map((account) => (
          <li key={account.id} className={styles.item}>
            {/* The whole card opens the account's detail page */}
            <Link href={`/accounts/${account.id}`} className={view === 'grid' ? styles.card : styles.row}>
              <AccountIcon type={account.type} className={styles.icon} />
              <span className={styles.heading}>
                <span className={styles.name}>{account.name}</span>
                <span className={styles.number}>
                  {view === 'list' && `${ACCOUNT_TYPE_LABELS[account.type]} · `}
                  {account.number}
                </span>
              </span>
              <span className={styles.balanceBlock}>
                <span className={styles.balanceLabel}>Latest balance</span>
                <span className={cx(styles.balance, account.balance < 0 && styles.overdrawn)}>{balance(account)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pageCount > 1 && <Pager label="Accounts pages" page={page} pageCount={pageCount} total={accounts.length} perPage={PAGE_SIZE} onPage={setPage} />}
    </Panel>
  );
}
