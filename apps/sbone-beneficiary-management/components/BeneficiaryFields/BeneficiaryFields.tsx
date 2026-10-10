'use client';

import type { ReactNode } from 'react';
import { Dropdown, Panel, Select, TextField } from '@sbone/shared';
import { BANKS, BENEFICIARY_TYPES, COUNTRIES, CURRENCIES, type BeneficiaryForm } from '@/lib/beneficiaries';
import styles from './BeneficiaryFields.module.scss';

const ADDRESS_HINT = 'Maximum 70 characters. Each address line must be unique.';

export interface BeneficiaryFieldsProps {
  form: BeneficiaryForm;
  onChange: (form: BeneficiaryForm) => void;
  errors?: Partial<Record<keyof BeneficiaryForm, string>>;
  /** Review: every field read-only */
  readOnly?: boolean;
  /** Edit: only the payment limit can change; identity and banking details are locked */
  limitOnly?: boolean;
}

const SectionIcon = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

/** Basic information, international banking details and payment limit for an international beneficiary. */
export function BeneficiaryFields({ form, onChange, errors = {}, readOnly = false, limitOnly = false }: BeneficiaryFieldsProps) {
  const locked = readOnly || limitOnly;
  const set = (field: keyof BeneficiaryForm) => (value: string) => onChange({ ...form, [field]: value });
  const text = (field: keyof BeneficiaryForm, label: string, extra: { hint?: string; placeholder?: string; required?: boolean } = {}) => (
    <TextField
      variant="floating"
      label={`${label}${extra.required ? '*' : ''}`}
      value={form[field]}
      placeholder={extra.placeholder}
      hint={extra.hint}
      error={errors[field]}
      disabled={locked}
      maxLength={field.startsWith('address') ? 70 : undefined}
      autoComplete="off"
      onChange={(event) => set(field)(event.target.value)}
      className={styles.field}
    />
  );
  const select = (field: keyof BeneficiaryForm, label: string, options: Array<{ value: string; label: string }>, placeholder?: string) => (
    <Select
      variant="floating"
      label={label}
      value={form[field]}
      placeholder={placeholder}
      options={options}
      error={errors[field]}
      disabled={locked}
      onChange={(event) => set(field)(event.target.value)}
      className={styles.field}
    />
  );

  return (
    <>
      <Panel
        title="Basic Information"
        icon={
          <SectionIcon>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
          </SectionIcon>
        }
        actions={<span className={styles.sectionMeta}>International Payment Beneficiary</span>}
      >
        <div className={styles.grid}>
          {select('beneficiaryType', 'Beneficiary Type*', BENEFICIARY_TYPES)}
          {text('name', 'Beneficiary Name', { placeholder: 'Full legal name', required: true })}
          {text('addressLine1', 'Address Line 1', { placeholder: 'Address', hint: ADDRESS_HINT, required: true })}
          {text('addressLine2', 'Address Line 2', { placeholder: 'Address', hint: ADDRESS_HINT, required: true })}
          {text('addressLine3', 'Address Line 3', { placeholder: 'City', hint: ADDRESS_HINT })}
        </div>
      </Panel>

      <Panel
        title="International Banking Details"
        icon={
          <SectionIcon>
            <path d="m3 9 9-5 9 5M4 9h16M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18" />
          </SectionIcon>
        }
      >
        <div className={styles.grid}>
          {text('swift', 'SWIFT/BIC Code', { placeholder: 'CHASUS33', required: true })}
          {select('bankCountry', 'Bank Country*', COUNTRIES, 'Select country')}
          {select('bankName', 'Bank Name', BANKS, 'Select Bank')}
          {text('bankAddress', 'Bank Address', { placeholder: 'Bank Address (City, Country)' })}
          {text('accountNumber', 'Account Number/IBAN', { placeholder: '1234567890', required: true })}
          {text('routingCode', 'Routing code', { placeholder: '01233xxx', required: true })}
          {select('paymentCurrency', 'Payment Currency*', CURRENCIES)}
        </div>
      </Panel>

      <Panel
        title="Payment Limits"
        icon={
          <SectionIcon>
            <rect x="3" y="5.5" width="18" height="13" rx="2" />
            <path d="M3 10h18M7 15h4" />
          </SectionIcon>
        }
      >
        <div className={styles.grid}>
          {/* Currency picker inside the amount box, as the FX calculator on the dashboard */}
          <div className={styles.field}>
            <div className={styles.limit} data-disabled={readOnly || undefined} data-invalid={errors.monthlyLimit ? true : undefined}>
              <span className={styles.limitLabel}>Monthly Limit</span>
              {readOnly ? (
                <span className={styles.limitCurrency}>{form.limitCurrency}</span>
              ) : (
                <Dropdown
                  label="Limit currency"
                  labelPosition="hidden"
                  appearance="inline"
                  className={styles.limitPicker}
                  value={form.limitCurrency}
                  onChange={set('limitCurrency')}
                  options={CURRENCIES}
                />
              )}
              <input
                aria-label="Monthly limit amount"
                inputMode="decimal"
                placeholder="0.00"
                value={form.monthlyLimit}
                disabled={readOnly}
                onChange={(event) => set('monthlyLimit')(event.target.value.replace(/[^\d.\s]/g, ''))}
              />
            </div>
            <p className={errors.monthlyLimit ? styles.limitError : styles.limitHint}>{errors.monthlyLimit ?? 'Total per month'}</p>
          </div>
        </div>
      </Panel>
    </>
  );
}
