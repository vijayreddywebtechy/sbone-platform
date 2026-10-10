'use client';

import { Fragment, useCallback, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Collapse, FigureStrip, Panel, SearchBox, Segmented, Toast, Toolbar, cx } from '@sbone/shared';
import { useBeneficiaries } from '@/lib/BeneficiariesContext';
import { PAYMENT_TYPE_LABELS, STATUS_LABELS, formatCompact, formatLimit, type Beneficiary, type BeneficiaryType } from '@/lib/beneficiaries';
import styles from './BeneficiaryList.module.scss';

type Filter = 'all' | BeneficiaryType;

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** Every payment beneficiary: counts, type filter, search, and rows that expand to their details. */
export function BeneficiaryList() {
  const router = useRouter();
  const { beneficiaries, resetDraft } = useBeneficiaries();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const count = (type: BeneficiaryType) => beneficiaries.filter((item) => item.beneficiaryType === type).length;
  const active = beneficiaries.filter((item) => item.status === 'active').length;
  const pending = beneficiaries.filter((item) => item.status === 'pending').length;
  const totalValue = beneficiaries.reduce((sum, item) => sum + (Number(item.monthlyLimit) || 0), 0);

  const term = search.trim().toLowerCase();
  const shown = beneficiaries.filter(
    (item) =>
      (filter === 'all' || item.beneficiaryType === filter) &&
      (!term || [item.name, item.bankName, item.accountNumber, PAYMENT_TYPE_LABELS[item.paymentType]].some((value) => value.toLowerCase().includes(term))),
  );

  const startAdd = () => {
    resetDraft();
    router.push('/add');
  };

  // Payments live in another micro frontend that isn't built yet
  const payNow = (item: Beneficiary) => setToast(`Payments to ${item.name} will open in International Payments (coming soon)`);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Beneficiary Management</h1>
          <p className={styles.subtitle}>Manage all your payment beneficiaries in one place</p>
        </div>
        <Button variant="secondary" onClick={startAdd}>
          <span className={styles.buttonLabel}>
            <Icon size={16}>
              <circle cx="10" cy="8" r="3.2" />
              <path d="M4 19c0-3.3 2.7-5.5 6-5.5 1.1 0 2.1.2 3 .7M17.5 14v6M14.5 17h6" />
            </Icon>
            Add beneficiary
          </span>
        </Button>
      </header>

      <section className={styles.summary} aria-label="Beneficiaries at a glance">
        <FigureStrip
          figures={[
            { label: 'Total beneficiaries', value: beneficiaries.length, note: `${count('corporate')} corporate · ${count('individual')} individual` },
            { label: 'Active beneficiaries', value: active, dotColor: 'var(--status-active)', note: 'Ready for payments' },
            { label: 'Pending verifications', value: pending, dotColor: 'var(--status-pending)', note: pending ? 'Awaiting bank verification' : 'Nothing waiting' },
            { label: 'Total value', value: formatCompact(totalValue), note: 'Combined monthly limits' },
          ]}
        />
      </section>

      <Panel
        title="Beneficiaries"
        icon={
          <Icon size={20}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 10h6M7 14h4M15.5 15.5l2 2 3-3.5" />
          </Icon>
        }
      >
        <Toolbar
          start={
            <Segmented
              label="Show beneficiaries"
              options={[
                { value: 'all' as Filter, label: 'All', count: beneficiaries.length },
                { value: 'corporate' as Filter, label: 'Corporate', count: count('corporate') },
                { value: 'individual' as Filter, label: 'Individual', count: count('individual') },
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
          end={<SearchBox label="Search beneficiaries" placeholder="Search" value={search} onChange={setSearch} />}
        />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col" className={styles.wideOnly}>
                  Payment type
                </th>
                <th scope="col" className={styles.wideOnly}>
                  Bank
                </th>
                <th scope="col" className={styles.wideOnly}>
                  Account number
                </th>
                <th scope="col" className={styles.wideOnly}>
                  Status
                </th>
                <th scope="col">
                  <span className={styles.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No beneficiaries match your search.
                  </td>
                </tr>
              ) : (
                shown.map((item) => {
                  const open = openId === item.id;
                  const detailsId = `details-${item.id}`;
                  const payable = item.status === 'active';
                  return (
                    <Fragment key={item.id}>
                      <tr className={cx(styles.row, open && styles.rowOpen)}>
                        <td>
                          <span className={styles.name}>{item.name}</span>
                          {/* Phones: type, bank and status under the name instead of their own columns */}
                          <span className={styles.under}>
                            {PAYMENT_TYPE_LABELS[item.paymentType]} · {item.bankName}
                          </span>
                          <span className={cx(styles.under, styles.underStatus)}>
                            <span className={cx(styles.statusDot, styles[`dot_${item.status}`])} aria-hidden="true" />
                            {STATUS_LABELS[item.status]}
                          </span>
                        </td>
                        <td className={styles.wideOnly}>{PAYMENT_TYPE_LABELS[item.paymentType]}</td>
                        <td className={styles.wideOnly}>{item.bankName}</td>
                        <td className={cx(styles.wideOnly, styles.mono)}>{item.accountLabel ?? item.accountNumber}</td>
                        <td className={styles.wideOnly}>
                          <span className={styles.status}>
                            <span className={cx(styles.statusDot, styles[`dot_${item.status}`])} aria-hidden="true" />
                            {STATUS_LABELS[item.status]}
                          </span>
                        </td>
                        <td className={styles.actionsCell}>
                          <button
                            type="button"
                            className={styles.payNow}
                            disabled={!payable}
                            title={payable ? undefined : 'Only active beneficiaries can be paid'}
                            onClick={() => payNow(item)}
                          >
                            Pay now
                          </button>
                          <button
                            type="button"
                            className={styles.toggle}
                            aria-expanded={open}
                            aria-controls={detailsId}
                            aria-label={`${open ? 'Hide' : 'Show'} details for ${item.name}`}
                            onClick={() => setOpenId(open ? null : item.id)}
                          >
                            <Icon size={18}>
                              <path d="m6 9 6 6 6-6" />
                            </Icon>
                          </button>
                        </td>
                      </tr>
                      <tr className={cx(styles.detailsRow, open && styles.detailsRowOpen)}>
                        <td colSpan={6}>
                          <Collapse open={open}>
                            <div className={styles.details} id={detailsId}>
                              <dl className={styles.facts}>
                                <div>
                                  <dt>Beneficiary name</dt>
                                  <dd>{item.name}</dd>
                                </div>
                                <div>
                                  <dt>Monthly limit</dt>
                                  <dd>{formatLimit(item.monthlyLimit, item.limitCurrency)}</dd>
                                </div>
                                <div>
                                  <dt>Account number</dt>
                                  <dd className={styles.mono}>{item.accountNumber}</dd>
                                </div>
                                <div>
                                  <dt>SWIFT/BIC code</dt>
                                  <dd className={styles.mono}>{item.swift}</dd>
                                </div>
                                <div>
                                  <dt>Bank</dt>
                                  <dd>
                                    {item.bankName}
                                    {item.bankCountry && `, ${item.bankCountry}`}
                                  </dd>
                                </div>
                                <div>
                                  <dt>Beneficiary address</dt>
                                  <dd>{[item.addressLine1, item.addressLine2, item.addressLine3].filter(Boolean).join(', ')}</dd>
                                </div>
                              </dl>
                              <Link href={`/edit?id=${encodeURIComponent(item.id)}`} className={styles.edit}>
                                Edit
                              </Link>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}
