'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, cx, FigureStrip, FilterMenu, Pager, Panel, SearchBox, Segmented, Select, Toolbar } from '@sbone/shared';
import { AccountIcon } from '../AccountIcon/AccountIcon';
import { ACCOUNTS, ACCOUNT_TYPE_LABELS, formatMoney, maskAccountNumber, type Account } from '../Dashboard/dashboardData';
import { DocumentActions, StatementIcon, useDocumentActions } from '../Documents/DocumentActions';
import { documentsFor, type DocumentGroup, type DocumentItem } from '../Documents/documentsData';
import { LATEST_MONTH, addMonths, transactionsFor } from '../Insights/insightsData';
import styles from './AccountDetails.module.scss';

const TRANSACTIONS_PER_PAGE = 10;
const DOCUMENTS_PER_PAGE = 5;
const HIDDEN = '••• •••.••';
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const PERIOD_OPTIONS = [
  { value: '1', label: 'This month' },
  { value: '3', label: 'Last 3 months' },
];

const YEAR_OPTIONS = [
  { value: 'all', label: 'All years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

type Direction = 'all' | 'in' | 'out';
type DocumentFilter = 'all' | DocumentGroup;

const DIRECTION_OPTIONS: Array<{ value: Direction; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Money in' },
  { value: 'out', label: 'Money out' },
];

// Ordered as the documents are listed
const DOCUMENT_OPTIONS: Array<{ value: DocumentFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'stamped', label: 'Stamped' },
  { value: 'unstamped', label: 'Unstamped' },
  { value: 'letters', label: 'Letters' },
];

/** Mock: the latest three months of transactions, newest first, with a full date */
function recentTransactions(accountId: string) {
  return [0, -1, -2]
    .flatMap((offset) => {
      const ref = addMonths(LATEST_MONTH, offset);
      return transactionsFor(accountId, ref).map((t) => ({
        ...t,
        monthsAgo: -offset,
        sortKey: ref.year * 10000 + ref.month * 100 + t.day,
        date: `${String(t.day).padStart(2, '0')} ${SHORT_MONTHS[ref.month]} ${ref.year}`,
      }));
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

/** One account in detail: balances, transaction history and its documents. Another account can be picked from the header. */
export function AccountDetails({ account }: { account: Account }) {
  const router = useRouter();
  const id = useId();
  const [hideBalances, setHideBalances] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Transaction history
  const [direction, setDirection] = useState<Direction>('all');
  const [txSearch, setTxSearch] = useState('');
  const [months, setMonths] = useState('3');
  const [txPage, setTxPage] = useState(0);

  // Documents
  const [docType, setDocType] = useState<DocumentFilter>('all');
  const [docSearch, setDocSearch] = useState('');
  const [year, setYear] = useState('all');
  const [docPage, setDocPage] = useState(0);

  const accountLabel = `${account.name} ${maskAccountNumber(account.number)}`;
  const money = (value: number) => formatMoney(value, account.currency);
  const balance = (value: number) => (hideBalances ? `${money(0).split(' ')[0]} ${HIDDEN}` : money(value));
  const { onAction, overlays } = useDocumentActions(accountLabel);

  const transactions = useMemo(() => recentTransactions(account.id), [account.id]);
  const inPeriod = transactions.filter((t) => t.monthsAgo < Number(months));
  const moneyIn = inPeriod.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const moneyOut = inPeriod.filter((t) => t.amount < 0).reduce((sum, t) => sum - t.amount, 0);
  // Mock: current accounts carry a R50 000 overdraft facility on top of the balance
  const available = account.balance + (account.type === 'current' ? 50_000 : 0);

  const txTerm = txSearch.trim().toLowerCase();
  const txShown = inPeriod.filter(
    (t) =>
      (direction === 'all' || (direction === 'in' ? t.amount > 0 : t.amount < 0)) &&
      (!txTerm || t.description.toLowerCase().includes(txTerm) || t.date.toLowerCase().includes(txTerm)),
  );
  const txPageCount = Math.max(1, Math.ceil(txShown.length / TRANSACTIONS_PER_PAGE));
  const txCurrent = Math.min(txPage, txPageCount - 1);
  const txRows = txShown.slice(txCurrent * TRANSACTIONS_PER_PAGE, (txCurrent + 1) * TRANSACTIONS_PER_PAGE);

  const documents = useMemo(() => {
    const all = documentsFor(account.id);
    return (['stamped', 'unstamped', 'letters'] as DocumentGroup[]).flatMap((group) => all[group].map((item) => ({ ...item, group })));
  }, [account.id]);
  const docTerm = docSearch.trim().toLowerCase();
  const docShown = documents.filter(
    (item) =>
      (docType === 'all' || item.group === docType) &&
      (year === 'all' || item.period.includes(year)) &&
      (!docTerm || item.title.toLowerCase().includes(docTerm) || item.period.toLowerCase().includes(docTerm)),
  );
  const docPageCount = Math.max(1, Math.ceil(docShown.length / DOCUMENTS_PER_PAGE));
  const docCurrent = Math.min(docPage, docPageCount - 1);
  const docRows = docShown.slice(docCurrent * DOCUMENTS_PER_PAGE, (docCurrent + 1) * DOCUMENTS_PER_PAGE);

  // Mock data doesn't change; the spin shows the refresh happened
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };

  const figures = [
    { label: 'Latest balance', value: account.balance, info: 'Includes transactions still being processed' },
    { label: 'Available balance', value: available },
    { label: 'Money in', value: moneyIn, note: months === '1' ? 'This month' : 'Last 3 months' },
    { label: 'Money out', value: moneyOut, note: months === '1' ? 'This month' : 'Last 3 months' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon size={20}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>Accounts</h1>
        <Select
          variant="floating"
          label="Select account"
          indicator="chevron"
          className={styles.switcher}
          value={account.id}
          onChange={(event) => router.push(`/accounts/${event.target.value}`)}
          options={ACCOUNTS.map((item) => ({ value: item.id, label: item.name, meta: maskAccountNumber(item.number) }))}
        />
      </header>

      {/* Summary */}
      <section className={styles.summary} aria-labelledby={`${id}-name`}>
        <div className={styles.summaryTop}>
          <AccountIcon type={account.type} className={styles.accountIcon} />
          <div className={styles.accountText}>
            <h2 id={`${id}-name`} className={styles.accountName}>
              {account.name}
            </h2>
            <span className={styles.accountMeta}>
              {ACCOUNT_TYPE_LABELS[account.type]} · {maskAccountNumber(account.number)} · {account.currency}
            </span>
          </div>
          <div className={styles.summaryActions}>
            <button
              type="button"
              className={cx(styles.quietButton, refreshing && styles.spinning)}
              aria-label="Refresh balances"
              title="Refresh"
              disabled={refreshing}
              onClick={refresh}
            >
              <Icon>
                <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />
              </Icon>
            </button>
            <button
              type="button"
              className={styles.quietButton}
              aria-pressed={hideBalances}
              aria-label={hideBalances ? 'Show balances' : 'Hide balances'}
              title={hideBalances ? 'Show balances' : 'Hide balances'}
              onClick={() => setHideBalances((value) => !value)}
            >
              <Icon>
                <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
                <circle cx="12" cy="12" r="2.5" />
                {hideBalances && <path d="M4 4l16 16" />}
              </Icon>
            </button>
            <Button
              variant="secondary"
              endIcon={
                <Icon size={16}>
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                </Icon>
              }
            >
              Transact
            </Button>
          </div>
        </div>

        <FigureStrip
          figures={figures.map((figure) => ({ ...figure, value: balance(figure.value), negative: !hideBalances && figure.value < 0 }))}
        />
      </section>

      {/* Transaction history */}
      <Panel
        title="Transaction History"
        collapsible
        icon={
          <Icon size={20}>
            <path d="M4 7h13M14 4l3 3-3 3M20 17H7M10 14l-3 3 3 3" />
          </Icon>
        }
      >
        <Toolbar
          start={
            <Segmented
              label="Show transactions"
              options={DIRECTION_OPTIONS}
              value={direction}
              onChange={(value) => {
                setDirection(value);
                setTxPage(0);
              }}
            />
          }
          end={
            <>
              <SearchBox
                label="Search transactions"
                value={txSearch}
                onChange={(value) => {
                  setTxSearch(value);
                  setTxPage(0);
                }}
              />
              <FilterMenu
                title="Period"
                options={PERIOD_OPTIONS}
                value={months}
                defaultValue="3"
                onChange={(value) => {
                  setMonths(value);
                  setTxPage(0);
                }}
              />
            </>
          }
        />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.dateColumn}>
                  Date
                </th>
                <th scope="col">Description</th>
                <th scope="col" className={styles.amount}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {txRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.empty}>
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                txRows.map((t) => {
                  const isIn = t.amount > 0;
                  return (
                    <tr key={`${t.monthsAgo}-${t.id}`}>
                      <td className={cx(styles.muted, styles.dateColumn)}>{t.date}</td>
                      <td className={styles.description}>
                        {t.description}
                        {/* Phones: the date column is hidden, so the date sits under the description */}
                        <span className={styles.dateUnder} aria-hidden="true">
                          {t.date}
                        </span>
                      </td>
                      <td className={cx(styles.amount, isIn && styles.amountIn)}>
                        {isIn ? '+' : ''}
                        {money(t.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pager label="Transaction pages" page={txCurrent} pageCount={txPageCount} total={txShown.length} perPage={TRANSACTIONS_PER_PAGE} onPage={setTxPage} />
      </Panel>

      {/* Documents and statements */}
      <Panel
        title="Documents and Statements"
        collapsible
        icon={
          <Icon size={20}>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
            <path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" />
          </Icon>
        }
      >
        <Toolbar
          start={
            <Segmented
              label="Show documents"
              options={DOCUMENT_OPTIONS}
              value={docType}
              onChange={(value) => {
                setDocType(value);
                setDocPage(0);
              }}
            />
          }
          end={
            <>
              <SearchBox
                label="Search documents"
                value={docSearch}
                onChange={(value) => {
                  setDocSearch(value);
                  setDocPage(0);
                }}
              />
              <FilterMenu
                title="Year"
                options={YEAR_OPTIONS}
                value={year}
                defaultValue="all"
                onChange={(value) => {
                  setYear(value);
                  setDocPage(0);
                }}
              />
            </>
          }
        />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col" className={styles.periodColumn}>
                  Period
                </th>
                <th scope="col">
                  <span className={styles.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {docRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.empty}>
                    No documents match your filters.
                  </td>
                </tr>
              ) : (
                docRows.map((item: DocumentItem & { group: DocumentGroup }) => (
                  <tr key={item.id}>
                    <td>
                      <span className={styles.docName}>
                        <StatementIcon provisional={item.group === 'letters' || item.provisional} />
                        {item.title}
                      </span>
                    </td>
                    <td className={cx(styles.muted, styles.periodColumn)}>{item.period}</td>
                    <td className={styles.actionsCell}>
                      <DocumentActions item={item} onAction={onAction} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pager label="Document pages" page={docCurrent} pageCount={docPageCount} total={docShown.length} perPage={DOCUMENTS_PER_PAGE} onPage={setDocPage} />
      </Panel>

      {overlays}
    </div>
  );
}
