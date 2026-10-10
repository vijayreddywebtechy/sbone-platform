// Mock team until the roles & permissions API is available

export type MemberStatus = 'active' | 'invited' | 'declined' | 'locked';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  /** Custom job title given when inviting */
  jobTitle?: string;
  status: MemberStatus;
  /** Date shown beside the status, e.g. when access was approved or the invite was sent. */
  date: string;
}

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  declined: 'Declined',
  locked: 'Locked',
};

export const MEMBER_STATUSES = Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[];

/** Label for the date column, by status. */
export const MEMBER_DATE_LABELS: Record<MemberStatus, string> = {
  active: 'Approved',
  invited: 'Invited',
  declined: 'Declined',
  locked: 'Locked',
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'kobus-marais',
    name: 'Kobus Marais',
    email: 'kobus.marais@standardbank.co.za',
    role: 'Admin/Owner',
    status: 'active',
    date: '07 Oct 2026',
  },
];
