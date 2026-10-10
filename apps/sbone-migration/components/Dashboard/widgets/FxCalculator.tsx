'use client';

import { useId, useState } from 'react';
import { Alert, Dropdown, Panel } from '@sbone/shared';
import { FX_RATES, FX_TIMESTAMP, formatAmount, type Currency } from '../dashboardData';
import styles from './FxCalculator.module.scss';

const CURRENCIES = Object.keys(FX_RATES) as Currency[];
const CURRENCY_NAMES: Record<Currency, string> = {
  ZAR: 'South African Rand',
  USD: 'United States Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
};

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

/** Indicative conversion: enter an amount to buy and see what it would cost in the currency you sell. */
export function FxCalculator() {
  const id = useId();
  const [buy, setBuy] = useState<Currency>('ZAR');
  const [sell, setSell] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');

  const value = parseFloat(amount) || 0;
  const cost = (value * FX_RATES[buy]) / FX_RATES[sell];
  // Rate shown as "1 <sell currency> = n <buy currency>"
  const rate = FX_RATES[sell] / FX_RATES[buy];

  const field = (label: string, currency: Currency, onCurrency: (code: Currency) => void, input: React.ReactNode) => (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control}>
        <Dropdown
          label={`Currency to ${label.toLowerCase()}`}
          labelPosition="hidden"
          appearance="inline"
          className={styles.currency}
          value={currency}
          onChange={(code) => onCurrency(code as Currency)}
          options={CURRENCIES.map((code) => ({ value: code, label: code, meta: CURRENCY_NAMES[code] }))}
        />
        {input}
      </div>
    </div>
  );

  return (
    <Panel title="FX Rate Calculator">
      <p className={styles.intro}>Need forex? Get an idea of how much it could cost.</p>
      <p className={styles.timestamp}>{FX_TIMESTAMP}</p>

      {field(
        'Buy',
        buy,
        setBuy,
        <input
          id={`${id}-buy`}
          aria-label="Amount to buy"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ''))}
        />,
      )}
      {field(
        'Sell',
        sell,
        setSell,
        <output aria-label="Amount to sell" aria-live="polite">
          {formatAmount(cost)}
        </output>,
      )}

      <div className={styles.rate}>
        <span className={styles.rateLabel}>Applicable Rate</span>
        <span>
          {formatAmount(rate)} {CURRENCY_NAMES[buy]}
        </span>
        <strong>1 {CURRENCY_NAMES[sell]}</strong>
      </div>

      <Alert variant="neutral" icon={<InfoIcon />} className={styles.disclaimer}>
        View{' '}
        <a href="#" className={styles.link}>
          Legal Disclaimer
        </a>
      </Alert>
    </Panel>
  );
}
