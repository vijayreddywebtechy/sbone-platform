'use client';

import { useState } from 'react';
import { Alert, AreaChartIcon, BarChartIcon, FigureStrip, Panel, Segmented } from '@sbone/shared';
import { CASHFLOW, formatRand, type CashflowMonth } from '../dashboardData';
import { CashflowChart, type ChartKind } from './CashflowChart';
import styles from './CashflowPanel.module.scss';

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m7 15 4-4 3 3 5-6" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

/** Net, in and out totals for the year, the monthly chart (area or bars) and the data-coverage note. */
export function CashflowPanel({ data = CASHFLOW }: { data?: CashflowMonth[] }) {
  const [kind, setKind] = useState<ChartKind>('area');

  const moneyIn = data.reduce((sum, month) => sum + month.moneyIn, 0);
  const moneyOut = data.reduce((sum, month) => sum + month.moneyOut, 0);
  const net = moneyIn - moneyOut;

  return (
    <Panel title="Cashflow" icon={<ChartIcon />} collapsible>
      <FigureStrip
        wide
        className={styles.figures}
        figures={[
          { label: 'Net cash flow', value: formatRand(net), negative: net < 0, info: 'Total money in minus total money out for the period.', note: 'Money in minus money out' },
          { label: 'Money in', value: formatRand(moneyIn), note: 'Last 12 months' },
          { label: 'Money out', value: formatRand(moneyOut), note: 'Last 12 months' },
        ]}
      />

      <div className={styles.chartBar}>
        <ul className={styles.legend} aria-label="Legend">
          <li>
            <span className={styles.keyIn} aria-hidden="true" />
            Money in
          </li>
          <li>
            <span className={styles.keyOut} aria-hidden="true" />
            Money out
          </li>
        </ul>
        <Segmented
          label="Chart type"
          options={[
            { value: 'area' as ChartKind, label: 'Area', icon: <AreaChartIcon /> },
            { value: 'bar' as ChartKind, label: 'Bars', icon: <BarChartIcon /> },
          ]}
          value={kind}
          onChange={setKind}
        />
      </div>

      <CashflowChart data={data} kind={kind} />

      <Alert variant="neutral" icon={<InfoIcon />} className={styles.note}>
        Cashflow values presented are based on current and savings transaction data only. We are working on including
        all transactional accounts.
      </Alert>
    </Panel>
  );
}
