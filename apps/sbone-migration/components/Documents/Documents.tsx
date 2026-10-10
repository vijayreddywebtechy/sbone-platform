'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Alert, cx, FigureStrip, FilterMenu, Pager, Panel, SearchBox, Segmented, Select, Toolbar } from '@sbone/shared';
import { AccountIcon } from '../AccountIcon/AccountIcon';
import { ACCOUNTS, ACCOUNT_TYPE_LABELS, maskAccountNumber } from '../Dashboard/dashboardData';
import { DocumentActions, StatementIcon, useDocumentActions } from './DocumentActions';
import { GROUP_LABELS, documentsFor, type DocumentGroup } from './documentsData';
import styles from './Documents.module.scss';

const PAGE_SIZE = 8;
// Listed in this order: letters, then stamped, then monthly statements
const GROUPS: DocumentGroup[] = ['letters', 'stamped', 'unstamped'];
const TYPE_LABELS: Record<DocumentGroup, string> = { letters: 'Letter', stamped: 'Stamped statement', unstamped: 'Statement' };

const YEAR_OPTIONS = [
  { value: 'all', label: 'All years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

type TypeFilter = 'all' | DocumentGroup;

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** Letters, stamped and unstamped statements for an account, with view, email and download. */
export function Documents() {
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [type, setType] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('all');
  const [page, setPage] = useState(0);

  const account = ACCOUNTS.find((item) => item.id === accountId) ?? ACCOUNTS[0];
  const accountLabel = `${account.name} ${maskAccountNumber(account.number)}`;
  const { onAction, overlays } = useDocumentActions(accountLabel);

  const grouped = useMemo(() => documentsFor(accountId), [accountId]);
  const documents = useMemo(() => GROUPS.flatMap((group) => grouped[group].map((item) => ({ ...item, group }))), [grouped]);

  const term = search.trim().toLowerCase();
  const shown = documents.filter(
    (item) =>
      (type === 'all' || item.group === type) &&
      (year === 'all' || item.period.includes(year)) &&
      (!term || item.title.toLowerCase().includes(term) || item.period.toLowerCase().includes(term)),
  );
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = shown.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const resetPage = () => setPage(0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon size={20}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>Documents &amp; Statements</h1>
        <Select
          variant="floating"
          label="Select account"
          indicator="chevron"
          className={styles.switcher}
          value={accountId}
          onChange={(event) => {
            setAccountId(event.target.value);
            resetPage();
          }}
          options={ACCOUNTS.map((item) => ({ value: item.id, label: item.name, meta: maskAccountNumber(item.number) }))}
        />
      </header>

      {/* Summary */}
      <section className={styles.summary} aria-labelledby="documents-account">
        <div className={styles.summaryTop}>
          <AccountIcon type={account.type} className={styles.accountIcon} />
          <div className={styles.accountText}>
            <h2 id="documents-account" className={styles.accountName}>
              {account.name}
            </h2>
            <span className={styles.accountMeta}>
              {ACCOUNT_TYPE_LABELS[account.type]} · {maskAccountNumber(account.number)}
            </span>
          </div>
        </div>
        <FigureStrip
          figures={[
            { label: GROUP_LABELS.letters, value: grouped.letters.length, note: 'Confirmation and proof letters' },
            { label: GROUP_LABELS.stamped, value: grouped.stamped.length, note: 'Bank-stamped, for official use' },
            { label: GROUP_LABELS.unstamped, value: grouped.unstamped.length, note: 'Monthly statements' },
            { label: 'Latest statement', value: grouped.unstamped[0]?.period ?? '—', note: 'Available to download' },
          ]}
        />
      </section>

      {/* Documents */}
      <Panel
        title="Documents"
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
              options={[
                { value: 'all' as TypeFilter, label: 'All', count: documents.length },
                { value: 'letters' as TypeFilter, label: 'Letters', count: grouped.letters.length },
                { value: 'stamped' as TypeFilter, label: 'Stamped', count: grouped.stamped.length },
                { value: 'unstamped' as TypeFilter, label: 'Unstamped', count: grouped.unstamped.length },
              ]}
              value={type}
              onChange={(value) => {
                setType(value);
                resetPage();
              }}
            />
          }
          end={
            <>
              <SearchBox
                label="Search documents"
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  resetPage();
                }}
              />
              <FilterMenu
                title="Year"
                options={YEAR_OPTIONS}
                value={year}
                defaultValue="all"
                onChange={(value) => {
                  setYear(value);
                  resetPage();
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
                <th scope="col" className={styles.wideOnly}>
                  Type
                </th>
                <th scope="col" className={styles.wideOnly}>
                  Period
                </th>
                <th scope="col">
                  <span className={styles.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    No documents match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={styles.docName}>
                        <StatementIcon provisional={item.group === 'letters' || item.provisional} />
                        <span>
                          {item.title}
                          {/* Phones: type and period sit under the name */}
                          <span className={styles.under} aria-hidden="true">
                            {TYPE_LABELS[item.group]} · {item.period}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className={cx(styles.muted, styles.wideOnly)}>{TYPE_LABELS[item.group]}</td>
                    <td className={cx(styles.muted, styles.wideOnly)}>{item.period}</td>
                    <td className={styles.actionsCell}>
                      <DocumentActions item={item} onAction={onAction} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pager label="Document pages" page={currentPage} pageCount={pageCount} total={shown.length} perPage={PAGE_SIZE} onPage={setPage} />
      </Panel>

      <Alert
        variant="neutral"
        title="Please note, statements are not password protected."
        icon={
          <Icon size={16}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </Icon>
        }
        className={styles.note}
      >
        Standard Bank is not responsible for any loss or damage you may suffer if any information is accessed or used by any unauthorised party. A service fee of
        R10 will be charged for each retrieval, email and download of statements older than 2 years or stamped statements older than 6 months.
      </Alert>

      {overlays}
    </div>
  );
}
