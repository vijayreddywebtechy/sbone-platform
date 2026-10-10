'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { EMPTY_FORM, INITIAL_BENEFICIARIES, type Beneficiary, type BeneficiaryForm, type PaymentType } from './beneficiaries';

interface BeneficiariesValue {
  beneficiaries: Beneficiary[];
  /** Add-beneficiary flow: chosen payment type and the form, kept while moving between the steps */
  draftType: PaymentType | null;
  setDraftType: (type: PaymentType) => void;
  draft: BeneficiaryForm;
  setDraft: (form: BeneficiaryForm) => void;
  resetDraft: () => void;
  /** Saves the draft as a new beneficiary (pending verification) and returns it */
  saveDraft: () => Beneficiary;
  update: (id: string, form: BeneficiaryForm) => void;
}

const BeneficiariesContext = createContext<BeneficiariesValue | null>(null);

/** Beneficiaries and the add flow's draft, in memory until the beneficiaries API is available. */
export function BeneficiariesProvider({ children }: { children: ReactNode }) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [draftType, setDraftType] = useState<PaymentType | null>(null);
  const [draft, setDraft] = useState<BeneficiaryForm>(EMPTY_FORM);

  const value = useMemo<BeneficiariesValue>(
    () => ({
      beneficiaries,
      draftType,
      setDraftType,
      draft,
      setDraft,
      resetDraft: () => {
        setDraftType(null);
        setDraft(EMPTY_FORM);
      },
      saveDraft: () => {
        const created: Beneficiary = {
          ...draft,
          id: `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${beneficiaries.length + 1}`,
          paymentType: draftType ?? 'international',
          status: 'pending',
        };
        setBeneficiaries((current) => [created, ...current]);
        return created;
      },
      update: (id, form) => setBeneficiaries((current) => current.map((item) => (item.id === id ? { ...item, ...form } : item))),
    }),
    [beneficiaries, draftType, draft],
  );

  return <BeneficiariesContext.Provider value={value}>{children}</BeneficiariesContext.Provider>;
}

export function useBeneficiaries() {
  const value = useContext(BeneficiariesContext);
  if (!value) throw new Error('useBeneficiaries must be used inside <BeneficiariesProvider>');
  return value;
}
