'use client';

import { useId, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Alert, Collapse, cx, FigureStrip, FilterMenu, Pager, Panel, SearchBox, Segmented, Toolbar } from '@sbone/shared';
import { QUERIES, STATUS_LABELS, STATUS_ORDER, formatDateTime, type QueryStatus } from './queriesData';
import styles from './Queries.module.scss';

const PAGE_SIZE = 10;
const EVERYONE = 'everyone';

/** Status colours for the figure dots and status cells; the variables are set from shared tokens in Queries.module.scss */
const STATUS_COLORS: Record<QueryStatus, string> = {
  open: 'var(--status-open)',
  inProgress: 'var(--status-in-progress)',
  resolved: 'var(--status-resolved)',
  closed: 'var(--status-closed)',
};

const Icon = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

type Filter = QueryStatus | 'all';

/** Query tracker: counts per status, then the queries with a status switch, search, a logged-by filter and expandable rows. */
export function Queries() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [loggedBy, setLoggedBy] = useState(EVERYONE);
  const [expanded, setExpanded] = useState<Set<string>>(new Set([QUERIES[0].caseNumber]));
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const idPrefix = useId();

  const counts = Object.fromEntries(STATUS_ORDER.map((status) => [status, QUERIES.filter((q) => q.status === status).length])) as Record<QueryStatus, number>;
  const people = [...new Set(QUERIES.map((q) => q.loggedBy.name))];

  // Matches the subject, or the case number typed with or without "C-" and leading zeros
  const term = search.trim().toLowerCase();
  const digits = term.replace(/\D/g, '').replace(/^0+/, '');
  const filtered = QUERIES.filter(
    (q) =>
      (filter === 'all' || q.status === filter) &&
      (loggedBy === EVERYONE || q.loggedBy.name === loggedBy) &&
      (!term || q.subject.toLowerCase().includes(term) || q.caseNumber.toLowerCase().includes(term) || (digits !== '' && q.caseNumber.replace(/\D/g, '').includes(digits))),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const toggle = (caseNumber: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(caseNumber)) next.delete(caseNumber);
      else next.add(caseNumber);
      return next;
    });

  // Mock data doesn't change; the spin shows the refresh happened
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>Queries</h1>
        <button
          type="button"
          className={cx(styles.quietButton, refreshing && styles.spinning)}
          aria-label="Refresh queries"
          title="Refresh"
          onClick={refresh}
          disabled={refreshing}
        >
          <Icon size={18}>
            <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />
          </Icon>
        </button>
      </header>

      <section className={styles.summary} aria-label="Queries by status">
        <FigureStrip
          figures={STATUS_ORDER.map((status) => ({
            label: STATUS_LABELS[status],
            value: counts[status],
            dotColor: STATUS_COLORS[status],
            note: `of ${QUERIES.length} queries`,
          }))}
        />
      </section>

      <Panel
        title="Your Queries"
        icon={
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01" />
          </Icon>
        }
      >
        <Toolbar
          start={
            <Segmented
              label="Show queries"
              options={[
                { value: 'all' as Filter, label: 'All', count: QUERIES.length },
                ...STATUS_ORDER.map((status) => ({ value: status as Filter, label: STATUS_LABELS[status], count: counts[status] })),
              ]}
              value={filter}
              onChange={(value) => {
                setFilter(value);
                setPage(0);
              }}
            />
          }
          end={
            <>
              <SearchBox
                label="Search subject or case number"
                placeholder="Search subject or case number"
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(0);
                }}
              />
              <FilterMenu
                title="Logged by"
                options={[{ value: EVERYONE, label: 'Everyone' }, ...people.map((name) => ({ value: name, label: name }))]}
                value={loggedBy}
                defaultValue={EVERYONE}
                onChange={(value) => {
                  setLoggedBy(value);
                  setPage(0);
                }}
              />
            </>
          }
        />

        <div className={styles.headRow} aria-hidden="true">
          <span className={styles.headDate}>Date opened</span>
          <span>Logged by</span>
          <span>Subject</span>
          <span>Due date</span>
          <span className={styles.headStatus}>Status</span>
        </div>

        {rows.length === 0 ? (
          <p className={styles.empty}>No queries match your search.</p>
        ) : (
          <ul className={styles.rows}>
            {rows.map((query) => {
              const open = expanded.has(query.caseNumber);
              const detailsId = `${idPrefix}-${query.caseNumber}`;
              return (
                <li key={query.caseNumber} className={cx(styles.row, open && styles.rowOpen)}>
                  <button
                    type="button"
                    className={styles.toggle}
                    aria-expanded={open}
                    aria-controls={detailsId}
                    aria-label={`${open ? 'Hide' : 'Show'} details for ${query.subject}, ${query.caseNumber}`}
                    onClick={() => toggle(query.caseNumber)}
                  >
                    <Icon size={16}>
                      <path d="m9 6 6 6-6 6" />
                    </Icon>
                  </button>
                  <span className={styles.date}>
                    <span className={styles.cellLabel}>Date opened</span>
                    {formatDateTime(query.opened)}
                  </span>
                  <span className={styles.logged}>
                    <span className={styles.cellLabel}>Logged by</span>
                    <span className={styles.primary}>{query.loggedBy.name}</span>
                    <span className={styles.secondary}>{query.loggedBy.email}</span>
                  </span>
                  <span className={styles.subject}>
                    <span className={styles.cellLabel}>Subject</span>
                    <span className={styles.primary}>{query.subject}</span>
                    <span className={styles.secondary}>{query.caseNumber}</span>
                  </span>
                  <span className={styles.due}>
                    <span className={styles.cellLabel}>Due date</span>
                    {formatDateTime(query.due)}
                  </span>
                  <span className={styles.statusCell}>
                    <span className={styles.status}>
                      <span className={styles.statusDot} style={{ background: STATUS_COLORS[query.status] }} aria-hidden="true" />
                      {STATUS_LABELS[query.status]}
                    </span>
                  </span>

                  <Collapse open={open} className={styles.detailsWrap}>
                    <div className={styles.details} id={detailsId}>
                      <dl className={styles.detailMain}>
                        <div>
                          <dt>Case owner</dt>
                          <dd>{query.caseOwner}</dd>
                        </div>
                        <div>
                          <dt>Description</dt>
                          <dd>{query.description}</dd>
                        </div>
                      </dl>
                      <dl className={styles.closedDate}>
                        <div>
                          <dt>Closed date</dt>
                          <dd>{query.closed ? formatDateTime(query.closed) : '—'}</dd>
                        </div>
                      </dl>
                    </div>
                  </Collapse>
                </li>
              );
            })}
          </ul>
        )}

        <Pager label="Query pages" page={currentPage} pageCount={pageCount} total={filtered.length} perPage={PAGE_SIZE} onPage={setPage} />
      </Panel>

      <Alert
        variant="neutral"
        icon={
          <Icon size={16}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </Icon>
        }
        className={styles.note}
      >
        Please note, closed queries will be viewable for a further 30 days after being closed.
      </Alert>
    </div>
  );
}
