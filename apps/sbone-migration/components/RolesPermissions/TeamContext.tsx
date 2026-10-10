'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { TEAM_MEMBERS, type MemberStatus, type TeamMember } from './teamMembers';

export interface NewInvite {
  name: string;
  email: string;
  role: string;
  jobTitle?: string;
}

interface TeamValue {
  members: TeamMember[];
  /** People added by the last invite, for the confirmation screen */
  lastInvited: TeamMember[];
  /** Adds the people as Invited (or re-invites someone already on the team) and remembers them as the last invite */
  invite: (people: NewInvite[]) => void;
  setStatus: (id: string, status: MemberStatus) => void;
  remove: (id: string) => void;
  /** Whether someone with this email is already on the team (any status but declined) */
  isOnTeam: (email: string) => boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "10 Oct 2026" */
export const formatToday = () => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;
};

const idFor = (email: string) => email.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const TeamContext = createContext<TeamValue | null>(null);

/** Team members for Roles & Permissions, shared with the invite flow (in memory until the API is available). */
export function TeamProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [lastInvited, setLastInvited] = useState<TeamMember[]>([]);

  const value = useMemo<TeamValue>(
    () => ({
      members,
      lastInvited,
      invite: (people) => {
        const date = formatToday();
        const invited = people.map<TeamMember>((person) => ({
          id: idFor(person.email),
          name: person.name,
          email: person.email,
          role: person.role,
          jobTitle: person.jobTitle,
          status: 'invited',
          date,
        }));
        setMembers((current) => {
          const ids = new Set(invited.map((member) => member.id));
          // Newest first, replacing anyone being invited again
          return [...invited, ...current.filter((member) => !ids.has(member.id))];
        });
        setLastInvited(invited);
      },
      setStatus: (id, status) =>
        setMembers((current) => current.map((member) => (member.id === id ? { ...member, status, date: formatToday() } : member))),
      remove: (id) => setMembers((current) => current.filter((member) => member.id !== id)),
      isOnTeam: (email) => members.some((member) => member.email.toLowerCase() === email.toLowerCase() && member.status !== 'declined'),
    }),
    [members, lastInvited],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const value = useContext(TeamContext);
  if (!value) throw new Error('useTeam must be used inside <TeamProvider>');
  return value;
}
