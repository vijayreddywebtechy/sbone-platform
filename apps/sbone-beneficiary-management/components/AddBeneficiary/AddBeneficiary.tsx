'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Panel, cx } from '@sbone/shared';
import { useBeneficiaries } from '@/lib/BeneficiariesContext';
import { PAYMENT_TYPES, validate, type PaymentType } from '@/lib/beneficiaries';
import { AddFrame } from '../AddFrame/AddFrame';
import { BeneficiaryFields } from '../BeneficiaryFields/BeneficiaryFields';
import styles from './AddBeneficiary.module.scss';

const STEPS = ['Payment Type', 'Add a beneficiary', 'Review & Save'];
const DONE_STEPS = ['Payment Type', 'Add a beneficiary', 'Success'];

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v6M12 16.5h.01" />
  </svg>
);

/** Foreign beneficiaries can't be checked automatically, so they're verified by the bank after saving */
const VerificationNote = () => (
  <Alert variant="neutral" title="Verification required" icon={<InfoIcon />} className={styles.note}>
    Foreign beneficiaries cannot be digitally verified.
  </Alert>
);

/** Step 1: which kind of beneficiary to add. Only international payments are available for now. */
export function PaymentTypeStep() {
  const router = useRouter();
  const groupId = useId();
  const { draftType, setDraftType, resetDraft } = useBeneficiaries();
  const [type, setType] = useState<PaymentType | null>(draftType);

  return (
    <AddFrame
      current="Add Beneficiary"
      steps={STEPS}
      currentStep={0}
      actions={
        <>
          <Button
            variant="text"
            onClick={() => {
              resetDraft();
              router.push('/');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            disabled={!type}
            onClick={() => {
              if (!type) return;
              setDraftType(type);
              router.push('/add/details');
            }}
          >
            Continue
          </Button>
        </>
      }
    >
      <Panel title="What type of beneficiary would you like to add?">
        <fieldset className={styles.typeField}>
          <legend className={styles.srOnly}>Payment type</legend>
          <div className={styles.types}>
            {PAYMENT_TYPES.map((option) => {
              const selected = type === option.value;
              return (
                <label key={option.value} className={cx(styles.type, selected && styles.typeSelected, !option.available && styles.typeDisabled)}>
                  <input
                    type="radio"
                    name={`${groupId}-type`}
                    value={option.value}
                    checked={selected}
                    disabled={!option.available}
                    onChange={() => setType(option.value)}
                    className={cx(styles.radio, !option.available && styles.radioHidden)}
                  />
                  <span className={styles.typeTitle}>{option.title}</span>
                  <span className={styles.typeText}>{option.description}</span>
                  {!option.available && (
                    <span className={styles.soon}>
                      <span className={styles.soonDot} aria-hidden="true" />
                      Coming soon
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      </Panel>
    </AddFrame>
  );
}

/** Step 2: the beneficiary's details. Problems show once Continue is pressed. */
export function DetailsStep() {
  const router = useRouter();
  const { draft, setDraft, draftType } = useBeneficiaries();
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validate(draft) : {};

  // Started part-way (e.g. a reload): go back to choosing the payment type
  useEffect(() => {
    if (!draftType) router.replace('/add');
  }, [draftType, router]);

  return (
    <AddFrame
      current="Add Beneficiary"
      steps={STEPS}
      currentStep={1}
      actions={
        <>
          <Button variant="text" onClick={() => router.push('/add')}>
            Back
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSubmitted(true);
              if (Object.keys(validate(draft)).length === 0) router.push('/add/review');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Continue
          </Button>
        </>
      }
    >
      {submitted && Object.keys(errors).length > 0 && (
        <Alert variant="error" icon={<WarningIcon />} className={styles.note}>
          Please correct the highlighted fields to continue.
        </Alert>
      )}
      <BeneficiaryFields form={draft} onChange={setDraft} errors={errors} />
      <VerificationNote />
    </AddFrame>
  );
}

/** Step 3: everything read-only for a final check, then Save. */
export function ReviewStep() {
  const router = useRouter();
  const { draft, draftType, saveDraft } = useBeneficiaries();

  useEffect(() => {
    if (!draftType) router.replace('/add');
  }, [draftType, router]);

  return (
    <AddFrame
      current="Add Beneficiary"
      steps={STEPS}
      currentStep={2}
      actions={
        <>
          <Button variant="text" onClick={() => router.push('/add/details')}>
            Back
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              saveDraft();
              router.replace('/add/success');
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <BeneficiaryFields form={draft} onChange={() => undefined} readOnly />
      <VerificationNote />
    </AddFrame>
  );
}

/** Confirmation: the new beneficiary waits for verification before it can be paid. */
export function SuccessStep() {
  const router = useRouter();
  const { draft, resetDraft } = useBeneficiaries();

  return (
    <AddFrame
      current="Add Beneficiary"
      steps={DONE_STEPS}
      currentStep={3}
      actions={
        <Button
          variant="secondary"
          onClick={() => {
            resetDraft();
            router.push('/');
          }}
        >
          Done
        </Button>
      }
    >
      <section className={styles.success} aria-labelledby="beneficiary-added">
        <span className={styles.tick}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 12.5 4 4 8-9" />
          </svg>
        </span>
        <h2 id="beneficiary-added" className={styles.successTitle}>
          Beneficiary added
        </h2>
        <p className={styles.successText}>
          {draft.name ? <>“{draft.name}” has been added successfully.</> : 'The beneficiary has been added successfully.'}
        </p>
        <Alert variant="warning" title="Status: Pending verification" icon={<WarningIcon />} className={styles.pending}>
          You will receive a notification once the beneficiary is verified and ready for payments.
        </Alert>
      </section>
    </AddFrame>
  );
}

