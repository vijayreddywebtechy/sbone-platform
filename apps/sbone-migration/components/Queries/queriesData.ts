// Mock query tracker cases until the case-management API is available.

export type QueryStatus = 'open' | 'inProgress' | 'resolved' | 'closed';

export interface Query {
  caseNumber: string;
  subject: string;
  description: string;
  loggedBy: { name: string; email: string };
  caseOwner: string;
  /** ISO date-times, local */
  opened: string;
  due: string;
  closed?: string;
  status: QueryStatus;
}

export const STATUS_ORDER: QueryStatus[] = ['open', 'inProgress', 'resolved', 'closed'];

export const STATUS_LABELS: Record<QueryStatus, string> = {
  open: 'Open',
  inProgress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const QUERIES: Query[] = [
  {
    caseNumber: 'C-0029836811',
    subject: 'Client unable to view recent in-coming transactions',
    description: 'Client unable to view recent in-coming transactions. Statements requested from CDS and shared via email. TCF was applied.',
    loggedBy: { name: 'Tasmin Reilly', email: 'tasminreilly@abcachitectects.co.za' },
    caseOwner: 'Thando Khumalo - BCB SA Enterprise Direct Ops Support',
    opened: '2026-02-08T00:00',
    due: '2026-02-24T00:00',
    status: 'inProgress',
  },
  {
    caseNumber: 'C-0031836833',
    subject: 'Request for statements',
    description: 'Client requested stamped bank statements for the last three months for a tender submission.',
    loggedBy: { name: 'Kobus Marais', email: 'kobusmarais@abcachitectects.co.za' },
    caseOwner: 'Lindiwe Zulu - BCB SA Enterprise Direct Ops Support',
    opened: '2026-01-03T13:14',
    due: '2026-01-04T00:00',
    status: 'open',
  },
  {
    caseNumber: 'C-0031836834',
    subject: 'Request for statements',
    description: 'Statements for the business current account requested and emailed to the client.',
    loggedBy: { name: 'Tasmin Reilly', email: 'tasminreilly@abcachitectects.co.za' },
    caseOwner: 'Thando Khumalo - BCB SA Enterprise Direct Ops Support',
    opened: '2026-01-03T13:14',
    due: '2026-01-04T00:00',
    closed: '2026-01-04T09:30',
    status: 'resolved',
  },
  {
    caseNumber: 'C-0031836835',
    subject: 'Request for statements',
    description: 'Duplicate of an earlier statements request; closed after the client confirmed receipt.',
    loggedBy: { name: 'Tasmin Reilly', email: 'tasminreilly@abcachitectects.co.za' },
    caseOwner: 'Thando Khumalo - BCB SA Enterprise Direct Ops Support',
    opened: '2026-01-03T13:14',
    due: '2026-01-04T00:00',
    closed: '2026-01-05T11:02',
    status: 'closed',
  },
];

/** "08/02/2026, 00:00" */
export const formatDateTime = (iso: string) => {
  const [date, time] = iso.split('T');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}, ${time}`;
};
