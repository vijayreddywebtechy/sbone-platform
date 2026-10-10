'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export interface ShellCompany {
  id: string;
  name: string;
  /** The signed-in user's role in this company */
  role: 'Admin' | 'Viewer';
}

interface ActiveCompanyValue {
  company: ShellCompany;
  setCompanyId: (id: string) => void;
}

const ActiveCompanyContext = createContext<ActiveCompanyValue | null>(null);

/** The company the signed-in user is currently working in; switched from the shell's account menu. */
export function ActiveCompanyProvider({
  companies,
  defaultCompanyId,
  children,
}: {
  companies: ShellCompany[];
  defaultCompanyId: string;
  children: ReactNode;
}) {
  const [companyId, setCompanyId] = useState(defaultCompanyId);
  const company = companies.find((item) => item.id === companyId) ?? companies[0];
  return <ActiveCompanyContext.Provider value={{ company, setCompanyId }}>{children}</ActiveCompanyContext.Provider>;
}

export function useActiveCompany() {
  const value = useContext(ActiveCompanyContext);
  if (!value) throw new Error('useActiveCompany must be used inside <AppShell> or <ActiveCompanyProvider>');
  return value;
}

/** Active company's name and the user's role in it, for page headings. */
export function ActiveCompanyLabel() {
  const { company } = useActiveCompany();
  return (
    <>
      {company.name} | {company.role === 'Admin' ? 'Administrator' : company.role}
    </>
  );
}
