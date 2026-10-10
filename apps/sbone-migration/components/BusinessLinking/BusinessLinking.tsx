'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Collapse, RadioGroup, cx } from '@sbone/shared';
import { rememberFlowStep, useStepBack } from '@/lib/stepNavigation';
import type { BusinessProfileSummary } from '../BusinessProfile/businessProfiles';
import { LinkingCard, LinkingLayout } from './LinkingLayout';
import { InfoIcon, WarningIcon } from './icons';
import styles from './BusinessLinking.module.scss';

type Role = 'admin' | 'operator';

const ROLES: Array<{ value: Role; title: string; description: string }> = [
  {
    value: 'admin',
    title: 'Admin/Designated Person',
    description:
      'Full account access to move money, view balances and transactions, manage team account and profile access.',
  },
  {
    value: 'operator',
    title: 'Operator',
    description:
      'Digital Operator roles are account specific: your administrator will assign relevant permissions and send you an invite.',
  },
];

const AUTHORISED_OPTIONS = [
  { value: 'yes', label: 'Yes, I’m authorised' },
  { value: 'no', label: 'No, I’m not authorised' },
];

export interface BusinessLinkingProps {
  business: BusinessProfileSummary;
}

/** Step 1 of business linking: the user's role in the business. */
export function BusinessLinking({ business }: BusinessLinkingProps) {
  const router = useRouter();
  const goBack = useStepBack('/business-profile');
  // Unique radio group names per instance: Next keeps visited pages mounted (hidden), and radios sharing a name
  // across those copies would uncheck each other
  const groupId = useId();
  const [role, setRole] = useState<Role | null>(null);
  const [authorised, setAuthorised] = useState<string>();

  const isAdmin = role === 'admin';
  const canContinue = role === 'operator' || (isAdmin && Boolean(authorised));

  const continueToDetails = () => {
    const next = `/business-linking/${business.id}/details`;
    rememberFlowStep(next);
    router.push(next);
  };

  return (
    <LinkingLayout
      currentStep={0}
      business={business}
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Back
          </Button>
          <Button variant="secondary" disabled={!canContinue} onClick={continueToDetails}>
            Continue
          </Button>
        </>
      }
    >
      <LinkingCard
        titleId={`${groupId}-title`}
        title="What is your role in the business?"
        intro="To secure your business profile and allow your business greater control we need to establish an administrator/designated person for SBOne. Not an administrator, no worries, your designated admin/designated person will approve your access once their admin access is approved."
      >
        <fieldset className={styles.roles}>
          <legend className={styles.legend}>Select a role to be applied</legend>
          <div className={styles.roleOptions}>
            {ROLES.map((item) => (
              <label key={item.value} className={cx(styles.role, role === item.value && styles.roleSelected)}>
                <input
                  type="radio"
                  name={`${groupId}-role`}
                  value={item.value}
                  checked={role === item.value}
                  onChange={() => setRole(item.value)}
                  className={styles.roleInput}
                />
                <span className={styles.roleTitle}>{item.title}</span>
                <span className={styles.roleText}>{item.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Collapse open={isAdmin}>
          <RadioGroup
            appearance="plain"
            className={styles.question}
            label="Have you been authorised to act on behalf of the business to set up and administer its SBOne business profile?"
            name={`${groupId}-authorised`}
            options={AUTHORISED_OPTIONS}
            value={authorised}
            onChange={setAuthorised}
          />
        </Collapse>

        <Collapse open={isAdmin && Boolean(authorised)}>
          <Alert variant="warning" icon={<WarningIcon />} className={styles.notice}>
            A request will be sent for approval to business director/members.
          </Alert>
        </Collapse>
        <Collapse open={role === 'operator'}>
          <Alert variant="info" icon={<InfoIcon />} className={styles.notice}>
            Your administrator will assign the relevant permissions and send you an invite.
          </Alert>
        </Collapse>
      </LinkingCard>
    </LinkingLayout>
  );
}
