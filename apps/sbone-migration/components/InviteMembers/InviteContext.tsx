'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { ROLE_RULES, type AccessRole } from './accessData';
import { INVITE_ACCOUNTS, initialAccountStates, type AccountState } from './accountsData';

interface InviteValue {
  /** Ids of the people chosen on the Users step, in selection order. */
  selectedIds: string[];
  jobTitles: Record<string, string>;
  toggleSelected: (id: string) => void;
  removeSelected: (id: string) => void;
  setJobTitle: (id: string, title: string) => void;
  /** Access step */
  role: AccessRole;
  setRole: Dispatch<SetStateAction<AccessRole>>;
  permissions: string[];
  setPermissions: Dispatch<SetStateAction<string[]>>;
  releaseLevel: string;
  setReleaseLevel: Dispatch<SetStateAction<string>>;
  /** Accounts step: per account, whether it's on and its limits */
  accountStates: Record<string, AccountState>;
  setAccountStates: Dispatch<SetStateAction<Record<string, AccountState>>>;
  /** Clears every choice, e.g. to invite another user. */
  reset: () => void;
}

const InviteContext = createContext<InviteValue | null>(null);

/** Choices made across the invite-team-members steps, kept while the user moves between them. */
export function InviteProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});
  const [role, setRole] = useState<AccessRole>('capturer');
  const [permissions, setPermissions] = useState<string[]>(ROLE_RULES.capturer.defaults);
  const [releaseLevel, setReleaseLevel] = useState('1');
  const [accountStates, setAccountStates] = useState(() => initialAccountStates(INVITE_ACCOUNTS));

  const value = useMemo<InviteValue>(
    () => ({
      selectedIds,
      jobTitles,
      toggleSelected: (id) =>
        setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
      removeSelected: (id) => setSelectedIds((current) => current.filter((item) => item !== id)),
      setJobTitle: (id, title) => setJobTitles((current) => ({ ...current, [id]: title })),
      role,
      setRole,
      permissions,
      setPermissions,
      releaseLevel,
      setReleaseLevel,
      accountStates,
      setAccountStates,
      reset: () => {
        setSelectedIds([]);
        setJobTitles({});
        setRole('capturer');
        setPermissions(ROLE_RULES.capturer.defaults);
        setReleaseLevel('1');
        setAccountStates(initialAccountStates(INVITE_ACCOUNTS));
      },
    }),
    [selectedIds, jobTitles, role, permissions, releaseLevel, accountStates],
  );

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
}

export function useInvite() {
  const value = useContext(InviteContext);
  if (!value) throw new Error('useInvite must be used inside <InviteProvider>');
  return value;
}
