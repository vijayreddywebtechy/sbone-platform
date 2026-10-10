'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { cx, FigureStrip, FilterMenu, Pager, Panel, SearchBox, Segmented, Select, Toolbar } from '@sbone/shared';
import { AccountIcon } from '../AccountIcon/AccountIcon';
import { ACCOUNTS, ACCOUNT_TYPE_LABELS, formatRand, maskAccountNumber } from '../Dashboard/dashboardData';
import {
  LATEST_MONTH,
  MONTHS_OF_HISTORY,
  addMonths,
  daysInMonth,
  longDay,
  monthIndex,
  monthLabel,
  shortDay,
  transactionsFor,
  weekdayOf,
  type MonthRef,
} from './insightsData';
import styles from './Insights.module.scss';

const PAGE_SIZE = 10;
const WEEKDAY_HEADINGS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

type Direction = 'all' | 'in' | 'out';

const DIRECTION_OPTIONS: Array<{ value: Direction; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Money in' },
  { value: 'out', label: 'Money out' },
];

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'largest', label: 'Largest amount' },
  { value: 'smallest', label: 'Smallest amount' },
  { value: 'description', label: 'Description (A–Z)' },
];

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const signed = (value: number) => `${value >= 0 ? '+' : '-'}${formatRand(Math.abs(value))}`;
/** Compact amount for the calendar bars, e.g. 1 234 → "1.2k" */
const compact = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${Math.round(value)}`);

/** Monthly view of one account: headline figures, smart insights, a day-by-day calendar, top payees and transactions. */
export function Insights() {
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [month, setMonth] = useState<MonthRef>(LATEST_MONTH);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [page, setPage] = useState(0);

  const account = ACCOUNTS.find((item) => item.id === accountId) ?? ACCOUNTS[0];
  const transactions = useMemo(() => transactionsFor(accountId, month), [accountId, month]);

  // ---- Month figures ----
  const moneyIn = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const moneyOut = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum - t.amount, 0);
  const net = moneyIn - moneyOut;
  const average = transactions.length ? transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length : 0;
  const largestSpend = transactions.reduce((max, t) => Math.min(max, t.amount), 0);

  const byDay = new Map<number, { in: number; out: number; count: number }>();
  for (const t of transactions) {
    const entry = byDay.get(t.day) ?? { in: 0, out: 0, count: 0 };
    if (t.amount > 0) entry.in += t.amount;
    else entry.out -= t.amount;
    entry.count += 1;
    byDay.set(t.day, entry);
  }
  const busiest = [...byDay.entries()].sort((a, b) => b[1].count - a[1].count)[0];
  const maxDayAmount = Math.max(1, ...[...byDay.values()].flatMap((d) => [d.in, d.out]));

  const payees = new Map<string, number>();
  for (const t of transactions) if (t.payee) payees.set(t.payee, (payees.get(t.payee) ?? 0) - t.amount);
  const topPayees = [...payees.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  // ---- Transactions table ----
  const term = search.trim().toLowerCase();
  const shown = transactions.filter(
    (t) =>
      (selectedDay === null || t.day === selectedDay) &&
      (direction === 'all' || (direction === 'in' ? t.amount > 0 : t.amount < 0)) &&
      (!term || t.description.toLowerCase().includes(term)),
  );
  const sorted = [...shown].sort((a, b) => {
    if (sort === 'largest') return Math.abs(b.amount) - Math.abs(a.amount);
    if (sort === 'smallest') return Math.abs(a.amount) - Math.abs(b.amount);
    if (sort === 'description') return a.description.localeCompare(b.description);
    return b.day - a.day; // Newest first
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = sorted.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  // ---- Navigation ----
  const canGoBack = monthIndex(month) > monthIndex(LATEST_MONTH) - (MONTHS_OF_HISTORY - 1);
  const canGoForward = monthIndex(month) < monthIndex(LATEST_MONTH);
  const changeMonth = (delta: number) => {
    setMonth((current) => addMonths(current, delta));
    setSelectedDay(null);
    setPage(0);
  };
  const changeAccount = (id: string) => {
    setAccountId(id);
    setSelectedDay(null);
    setPage(0);
  };

  // Leading blanks so the 1st lands under its weekday (weeks start on Monday)
  const leading = weekdayOf(month, 1);
  const totalDays = daysInMonth(month);

  const insights: Array<{ tone: 'good' | 'warn' | 'info'; label: string; text: string }> = [
    net >= 0
      ? { tone: 'good', label: 'Positive month', text: `You received ${formatRand(net)} more than you spent.` }
      : { tone: 'warn', label: 'Spending ahead of income', text: `You spent ${formatRand(-net)} more than you received.` },
    ...(busiest ? [{ tone: 'info' as const, label: 'Busiest day', text: `${longDay(month, busiest[0])}, with ${busiest[1].count} transactions.` }] : []),
    ...(topPayees[0] ? [{ tone: 'info' as const, label: 'Top payee', text: `${topPayees[0][0]} received ${formatRand(topPayees[0][1])}.` }] : []),
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon size={20}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>Insights</h1>
        <Select
          variant="floating"
          label="Select account"
          indicator="chevron"
          className={styles.switcher}
          value={accountId}
          onChange={(event) => changeAccount(event.target.value)}
          options={ACCOUNTS.map((item) => ({ value: item.id, label: item.name, meta: maskAccountNumber(item.number) }))}
        />
      </header>

      {/* Summary */}
      <section className={styles.summary} aria-labelledby="insights-account">
        <div className={styles.summaryTop}>
          <AccountIcon type={account.type} className={styles.accountIcon} />
          <div className={styles.accountText}>
            <h2 id="insights-account" className={styles.accountName}>
              {account.name}
            </h2>
            <span className={styles.accountMeta}>
              {ACCOUNT_TYPE_LABELS[account.type]} · {maskAccountNumber(account.number)}
            </span>
          </div>
          <div className={styles.monthNav}>
            <button type="button" className={styles.quietButton} aria-label="Previous month" disabled={!canGoBack} onClick={() => changeMonth(-1)}>
              <Icon size={16}>
                <path d="m15 6-6 6 6 6" />
              </Icon>
            </button>
            <span className={styles.monthName} aria-live="polite">
              {monthLabel(month)}
            </span>
            <button type="button" className={styles.quietButton} aria-label="Next month" disabled={!canGoForward} onClick={() => changeMonth(1)}>
              <Icon size={16}>
                <path d="m9 6 6 6-6 6" />
              </Icon>
            </button>
          </div>
        </div>
        <FigureStrip
          figures={[
            { label: 'Net cash flow', value: <span className={net >= 0 ? styles.positive : undefined}>{signed(net)}</span>, negative: net < 0, note: `In ${formatRand(moneyIn)} · Out ${formatRand(moneyOut)}` },
            { label: 'Average transaction', value: formatRand(average), note: `${transactions.length} transactions` },
            { label: 'Largest spend', value: formatRand(Math.abs(largestSpend)), note: 'Single debit' },
            {
              label: 'Busiest day',
              value: busiest ? shortDay(month, busiest[0]) : '—',
              note: busiest ? `${busiest[1].count} transaction${busiest[1].count === 1 ? '' : 's'}` : 'No transactions',
            },
          ]}
        />
      </section>

      {/* Smart insights */}
      <Panel
        title="Smart Insights"
        icon={
          <Icon size={20}>
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
          </Icon>
        }
      >
        <ul className={styles.insights}>
          {insights.map((insight) => (
            <li key={insight.label} className={styles.insight}>
              <span className={cx(styles.insightIcon, styles[`tone_${insight.tone}`])}>
                <Icon size={18}>
                  {insight.tone === 'good' && <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />}
                  {insight.tone === 'warn' && <path d="m3 7 6 6 4-4 8 8M15 17h6v-6" />}
                  {insight.tone === 'info' && (
                    <>
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 11v5M12 8h.01" />
                    </>
                  )}
                </Icon>
              </span>
              <span className={styles.insightText}>
                <span className={styles.insightLabel}>{insight.label}</span>
                {insight.text}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className={styles.split}>
        {/* Calendar */}
        <Panel
          title="Activity Calendar"
          icon={
            <Icon size={20}>
              <rect x="3.5" y="5" width="17" height="15" rx="2" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </Icon>
          }
        >
          <div className={styles.calendarIntro}>
            <span className={styles.caption}>Select a day to see its transactions</span>
            <ul className={styles.legend} aria-label="Legend">
              <li>
                <span className={cx(styles.legendDot, styles.inColor)} aria-hidden="true" />
                Money in
              </li>
              <li>
                <span className={cx(styles.legendDot, styles.outColor)} aria-hidden="true" />
                Money out
              </li>
            </ul>
          </div>

          <div className={styles.calendar} role="grid" aria-label={`Activity in ${monthLabel(month)}`}>
            <div className={styles.week} role="row">
              {WEEKDAY_HEADINGS.map((heading) => (
                <span key={heading} className={styles.weekday} role="columnheader">
                  {heading}
                </span>
              ))}
            </div>
            <div className={styles.days} role="row">
              {Array.from({ length: leading }, (_, i) => (
                <span key={`blank-${i}`} aria-hidden="true" />
              ))}
              {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const data = byDay.get(day);
                const weekend = weekdayOf(month, day) >= 5;
                const selected = selectedDay === day;
                const content = (
                  <>
                    <span className={styles.dayNumber}>{day}</span>
                    {data && (
                      <span className={styles.bars} aria-hidden="true">
                        {data.in > 0 && (
                          <span className={styles.barRow}>
                            <span className={cx(styles.bar, styles.inColor)} style={{ width: `${(data.in / maxDayAmount) * 100}%` }} />
                            <span className={styles.barValue}>{compact(data.in)}</span>
                          </span>
                        )}
                        {data.out > 0 && (
                          <span className={styles.barRow}>
                            <span className={cx(styles.bar, styles.outColor)} style={{ width: `${(data.out / maxDayAmount) * 100}%` }} />
                            <span className={styles.barValue}>{compact(data.out)}</span>
                          </span>
                        )}
                      </span>
                    )}
                  </>
                );
                return data ? (
                  <button
                    key={day}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    aria-label={`${longDay(month, day)}: ${data.count} transactions, in ${formatRand(data.in)}, out ${formatRand(data.out)}`}
                    className={cx(styles.day, weekend && styles.weekend, selected && styles.daySelected)}
                    onClick={() => {
                      setSelectedDay(selected ? null : day);
                      setPage(0);
                    }}
                  >
                    {content}
                  </button>
                ) : (
                  <span key={day} role="gridcell" aria-label={`${longDay(month, day)}: no transactions`} className={cx(styles.day, styles.dayEmpty, weekend && styles.weekend)}>
                    {content}
                  </span>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Top payees */}
        <Panel
          title="Top Payees"
          icon={
            <Icon size={20}>
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
            </Icon>
          }
        >
          <p className={cx(styles.caption, styles.payeesIntro)}>Highest debit recipients in {monthLabel(month)}</p>
          {topPayees.length === 0 ? (
            <p className={styles.empty}>No payments this month.</p>
          ) : (
            <ol className={styles.payees}>
              {topPayees.map(([payee, total], index) => (
                <li key={payee} className={styles.payee}>
                  <span className={styles.rank}>{index + 1}</span>
                  <span className={styles.payeeBody}>
                    <span className={styles.payeeLine}>
                      <span className={styles.payeeName}>{payee}</span>
                      <span className={styles.payeeAmount}>{formatRand(total)}</span>
                    </span>
                    <span className={styles.payeeTrack} aria-hidden="true">
                      <span className={styles.payeeBar} style={{ width: `${(total / topPayees[0][1]) * 100}%` }} />
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      {/* Transactions */}
      <Panel
        title="Transactions"
        icon={
          <Icon size={20}>
            <path d="M4 7h13M14 4l3 3-3 3M20 17H7M10 14l-3 3 3 3" />
          </Icon>
        }
        actions={
          selectedDay !== null && (
            <button type="button" className={styles.dayFilter} onClick={() => setSelectedDay(null)} aria-label={`Showing ${longDay(month, selectedDay)}. Show the whole month`}>
              {shortDay(month, selectedDay)}
              <Icon size={14}>
                <path d="M6 6l12 12M18 6 6 18" />
              </Icon>
            </button>
          )
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
                setPage(0);
              }}
            />
          }
          end={
            <>
              <SearchBox
                label="Search transactions"
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(0);
                }}
              />
              <FilterMenu
                title="Sort by"
                buttonLabel="Sort"
                options={SORT_OPTIONS}
                value={sort}
                defaultValue="date"
                onChange={(value) => {
                  setSort(value);
                  setPage(0);
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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.empty}>
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((t) => {
                  const isIn = t.amount > 0;
                  return (
                    <tr key={t.id}>
                      <td className={cx(styles.muted, styles.dateColumn)}>
                        {shortDay(month, t.day)} {month.year}
                      </td>
                      <td className={styles.description}>
                        {t.description}
                        <span className={styles.dateUnder} aria-hidden="true">
                          {shortDay(month, t.day)} {month.year}
                        </span>
                      </td>
                      <td className={cx(styles.amount, isIn && styles.amountIn)}>{signed(t.amount)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pager label="Transaction pages" page={currentPage} pageCount={pageCount} total={sorted.length} perPage={PAGE_SIZE} onPage={setPage} />
      </Panel>
    </div>
  );
}
