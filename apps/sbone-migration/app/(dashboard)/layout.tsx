import type { ReactNode } from 'react';
import { AppShell } from '@sbone/shared';
import { COMPANIES, DEFAULT_COMPANY_ID, USER } from '@/components/Dashboard/dashboardData';

// Signed-in shell (header, side navigation, footer) for the dashboard pages; the same shell is used by the other zones
export default function SignedInLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell zone="main" userName={USER.name} companies={COMPANIES} defaultCompanyId={DEFAULT_COMPANY_ID}>
      {children}
    </AppShell>
  );
}
