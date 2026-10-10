import type { ReactNode } from 'react';
import { AppShell } from '@sbone/shared';
import { BeneficiariesProvider } from '@/lib/BeneficiariesContext';
import { COMPANIES, DEFAULT_COMPANY_ID, USER } from '@/lib/session';

// The platform's signed-in shell, rendered by this zone so Beneficiaries looks like part of SBOne
export default function SignedInLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell zone="beneficiaries" userName={USER.name} companies={COMPANIES} defaultCompanyId={DEFAULT_COMPANY_ID}>
      <BeneficiariesProvider>{children}</BeneficiariesProvider>
    </AppShell>
  );
}
