'use client';

import { useId, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button, cx, Panel } from '@sbone/shared';
import { rememberFlowStep } from '@/lib/stepNavigation';
import { InviteFrame } from './InviteFrame';
import styles from './InviteType.module.scss';

type InviteType = 'directors' | 'employees' | 'bulk';

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const OPTIONS: Array<{ value: InviteType; title: string; description: string; icon: ReactNode; disabled?: boolean }> = [
  {
    value: 'directors',
    title: 'Directors / Signatories',
    description: 'Directors, members or related parties',
    icon: (
      <Icon>
        <circle cx="10" cy="8" r="3.2" />
        <path d="M4 19c0-3.3 2.7-5.5 6-5.5 1.1 0 2.1.2 3 .7M17 13.5 20 15v2.2c0 1.6-1.3 3-3 3.6-1.7-.6-3-2-3-3.6V15Z" />
      </Icon>
    ),
  },
  {
    value: 'employees',
    title: 'Employees / Operators',
    description: 'Employees, non-related parties',
    icon: (
      <Icon>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5" />
      </Icon>
    ),
  },
  {
    value: 'bulk',
    title: 'Bulk Upload - Coming soon',
    description: 'Download and upload bulk permissions',
    disabled: true,
    icon: (
      <Icon>
        <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M14 3v5h5M12 17v-6M9.5 13.5 12 11l2.5 2.5" />
      </Icon>
    ),
  },
];

/** Step 1 of inviting team members: who is being invited. */
export function InviteType() {
  const router = useRouter();
  // Unique radio group name: visited pages stay mounted (hidden) and same-named radios would interfere
  const groupId = useId();
  const [type, setType] = useState<InviteType | null>(null);

  const goNext = () => {
    const next = '/roles-permissions/invite/users';
    rememberFlowStep(next);
    router.push(next);
  };

  return (
    <InviteFrame
      currentStep={0}
      title="Select invite type"
      subtitle="Choose the category that best describes the invitee."
      actions={
        <>
          <Button variant="text" onClick={() => router.push('/roles-permissions')}>
            Cancel
          </Button>
          <Button variant="secondary" disabled={!type} onClick={goNext}>
            Continue
          </Button>
        </>
      }
    >
      <Panel
        title="Invite type"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M18 8v6M15 11h6" />
          </svg>
        }
      >
      <fieldset className={styles.question}>
        {/* The page title shows this visually; the legend still names the radio group */}
        <legend className={styles.srOnly}>Select invite type</legend>

        <div className={styles.options}>
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cx(
                styles.option,
                type === option.value && styles.selected,
                option.disabled && styles.disabled,
              )}
            >
              <input
                type="radio"
                name={`${groupId}-invite-type`}
                value={option.value}
                checked={type === option.value}
                disabled={option.disabled}
                onChange={() => setType(option.value)}
                className={cx(styles.radio, option.disabled && styles.radioHidden)}
              />
              <span className={styles.icon}>{option.icon}</span>
              <span className={styles.text}>
                <span className={styles.optionTitle}>{option.title}</span>
                <span className={styles.optionDescription}>{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      </Panel>
    </InviteFrame>
  );
}
