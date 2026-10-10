'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@sbone/shared';
import { useBeneficiaries } from '@/lib/BeneficiariesContext';
import { validate, type Beneficiary, type BeneficiaryForm } from '@/lib/beneficiaries';
import { AddFrame } from '../AddFrame/AddFrame';
import { BeneficiaryFields } from '../BeneficiaryFields/BeneficiaryFields';
import styles from './EditBeneficiary.module.scss';

/** Edit an existing beneficiary: identity and banking details are locked; the payment limit can change. */
export function EditBeneficiary() {
  const id = useSearchParams().get('id');
  const { beneficiaries } = useBeneficiaries();
  const beneficiary = beneficiaries.find((item) => item.id === id);

  if (!beneficiary) {
    return (
      <div className={styles.missing}>
        <p>That beneficiary couldn’t be found.</p>
        <Link href="/">Back to Beneficiary Management</Link>
      </div>
    );
  }
  // Keyed so the form resets if another beneficiary is opened
  return <EditForm key={beneficiary.id} beneficiary={beneficiary} />;
}

function EditForm({ beneficiary }: { beneficiary: Beneficiary }) {
  const router = useRouter();
  const { update } = useBeneficiaries();
  const [form, setForm] = useState<BeneficiaryForm>(beneficiary);
  const [submitted, setSubmitted] = useState(false);
  // Only the limit can change here, so only it is checked (locked details were checked when the beneficiary was added)
  const limitErrors = () => {
    const { monthlyLimit } = validate(form);
    return monthlyLimit ? { monthlyLimit } : {};
  };
  const errors = submitted ? limitErrors() : {};

  return (
    <AddFrame
      current="Edit Beneficiary"
      actions={
        <>
          <Button variant="text" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSubmitted(true);
              if (Object.keys(limitErrors()).length > 0) return;
              update(beneficiary.id, form);
              router.push('/');
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <BeneficiaryFields form={form} onChange={setForm} errors={errors} limitOnly />
    </AddFrame>
  );
}
