'use client';

import { useState } from 'react';
import { Alert, Button, Switch, TextField, cx } from '@sbone/shared';
import { AccountIcon } from '@/components/AccountIcon/AccountIcon';
import { useRouter } from 'next/navigation';
import { rememberFlowStep, useStepBack } from '@/lib/stepNavigation';
import {
  ACCOUNT_GROUPS,
  INVITE_ACCOUNTS,
  LIMIT_COLUMNS,
  LIMIT_LABELS,
  formatLimit,
  parseLimit,
  type AccountKind,
  type AccountState,
  type InviteAccount,
  type LimitField,
} from './accountsData';
import { Block } from './Block';
import { useInvite } from './InviteContext';
import { InviteFrame } from './InviteFrame';
import styles from './SelectAccounts.module.scss';

const ICON_TYPES: Record<AccountKind, 'current' | 'savings' | 'foreign'> = {
  current: 'current',
  savings: 'savings',
  cfc: 'foreign',
};

/** Problem with one limit field, or undefined when it's fine. */
function limitError(account: InviteAccount, state: AccountState, field: LimitField) {
  const value = parseLimit(state.limits[field] ?? '');
  if (Number.isNaN(value)) return 'Enter a limit';
  if (value <= 0) return 'Must be more than 0';
  if (value > account.accountLimit) return 'Over account limit';
  // A daily limit can't be higher than the monthly one
  if (field === 'domesticDaily') {
    const monthly = parseLimit(state.limits.domesticMonthly ?? '');
    if (!Number.isNaN(monthly) && value > monthly) return 'Over monthly limit';
  }
  return undefined;
}

/** Step 4 of inviting team members: which accounts the invitees can use, and their limits on each. */
export function SelectAccounts({ accounts = INVITE_ACCOUNTS }: { accounts?: InviteAccount[] }) {
  const goBack = useStepBack('/roles-permissions/invite/access');
  const router = useRouter();
  const goNext = () => {
    const next = '/roles-permissions/invite/review';
    rememberFlowStep(next);
    router.push(next);
  };
  const { accountStates: state, setAccountStates: setState } = useInvite();
  // Errors show once a field has been left, so typing isn't interrupted
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const enabled = accounts.filter((account) => state[account.id].on);
  const hasErrors = enabled.some((account) =>
    Object.keys(account.limits).some((field) => limitError(account, state[account.id], field as LimitField)),
  );

  const setOn = (id: string, on: boolean) => setState((current) => ({ ...current, [id]: { ...current[id], on } }));

  const setLimit = (id: string, field: LimitField, text: string) =>
    setState((current) => ({
      ...current,
      [id]: { ...current[id], limits: { ...current[id].limits, [field]: text.replace(/[^\d\s.,]/g, '') } },
    }));

  // Tidy the number on blur, e.g. "100000" → "100 000.00"
  const blurLimit = (id: string, field: LimitField) => {
    setTouched((current) => new Set(current).add(`${id}:${field}`));
    const value = parseLimit(state[id].limits[field] ?? '');
    if (!Number.isNaN(value)) setLimit(id, field, formatLimit(value));
  };

  return (
    <InviteFrame
      currentStep={3}
      title="Select accounts"
      subtitle="Select accounts and limits"
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Back
          </Button>
          <Button variant="secondary" disabled={enabled.length === 0 || hasErrors} onClick={goNext}>
            Next
          </Button>
        </>
      }
    >
      <Block title="Select accounts and limits" summary={`${enabled.length} Selected`}>
        <div className={styles.groups}>
          {ACCOUNT_GROUPS.map((group) => {
            const groupAccounts = accounts.filter((account) => account.kind === group.kind);
            if (groupAccounts.length === 0) return null;
            return (
              <section key={group.kind} aria-labelledby={`accounts-${group.kind}`}>
                <h3 id={`accounts-${group.kind}`} className={styles.groupTitle}>
                  {group.title}
                  <span className={styles.count}>{groupAccounts.length}</span>
                </h3>
                <ul className={styles.rows}>
                  {groupAccounts.map((account) => {
                    const accountState = state[account.id];
                    const off = !accountState.on;
                    return (
                      <li key={account.id} className={cx(styles.row, off && styles.rowOff)}>
                        <Switch
                          className={styles.switch}
                          checked={accountState.on}
                          disabled={account.unavailable}
                          onChange={(on) => setOn(account.id, on)}
                          label={
                            <span className={styles.srOnly}>
                              Give access to {account.name} {account.number}
                              {account.unavailable ? ' (unavailable)' : ''}
                            </span>
                          }
                        />
                        <AccountIcon type={ICON_TYPES[account.kind]} className={styles.icon} />
                        <span className={styles.info}>
                          <span className={styles.name}>{account.name}</span>
                          <span className={styles.detail}>
                            {account.number}
                            {account.isDefault && ' - Default Acc.'}
                          </span>
                          <span className={styles.detail}>Acc. limit - R {formatLimit(account.accountLimit)}</span>
                        </span>
                        <span className={styles.limits}>
                          {LIMIT_COLUMNS.map((field) => {
                            if (account.limits[field] === undefined) return null;
                            const key = `${account.id}:${field}`;
                            const error =
                              !off && touched.has(key) ? limitError(account, accountState, field) : undefined;
                            return (
                              <TextField
                                key={field}
                                variant="floating"
                                label={`${LIMIT_LABELS[field]}*`}
                                aria-label={`${LIMIT_LABELS[field]} for ${account.name} ${account.number}`}
                                inputMode="decimal"
                                startAdornment="R"
                                disabled={off}
                                required
                                error={error}
                                value={accountState.limits[field] ?? ''}
                                onChange={(event) => setLimit(account.id, field, event.target.value)}
                                onBlur={() => blurLimit(account.id, field)}
                                className={cx(styles.limit, styles[field])}
                              />
                            );
                          })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </Block>

      <Alert
        variant="info"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 11v6M12 7.5v.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        }
        className={styles.check}
      >
        Please ensure all information is correct before continuing
      </Alert>
    </InviteFrame>
  );
}
