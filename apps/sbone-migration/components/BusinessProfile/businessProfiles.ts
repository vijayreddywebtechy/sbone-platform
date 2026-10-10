// Mock data until the business profile API is available

export interface BusinessProfileSummary {
  id: string;
  name: string;
  registrationNumber: string;
  /** linked = already linked to this user's SBOne profile; unlinked = can be linked now */
  status: 'linked' | 'unlinked';
}

export const BUSINESS_PROFILES: BusinessProfileSummary[] = [
  { id: 'abc-architects', name: 'ABC Architects', registrationNumber: '2024/123456/07', status: 'unlinked' },
  { id: 'newwave-transport', name: 'NewWave Transport', registrationNumber: '2022/481516/07', status: 'linked' },
  { id: 'mmp-removals', name: 'MMP Removals', registrationNumber: '1998/234267/07', status: 'linked' },
  { id: 'zm-consulting', name: 'ZM Consulting', registrationNumber: '2019/772031/07', status: 'linked' },
  { id: 'lowmar-farm', name: 'Lowmar Farm', registrationNumber: '2011/092118/07', status: 'unlinked' },
];

export interface Approver {
  name: string;
  email: string;
  phone: string;
  role: string;
}

/** Directors/members who must approve an admin's access, per business (mock). */
export const APPROVERS: Record<string, Approver[]> = {
  'abc-architects': [
    { name: 'Tasmin Reilly', email: 'tasminreilly@abcarchitects.co.za', phone: '079 120 5680', role: 'Director, Signatory' },
    { name: 'Jonathan Khumalo', email: 'jonathankhumalo@abcarchitects.co.za', phone: '082 670 1234', role: 'Director, Signatory' },
  ],
  'newwave-transport': [
    { name: 'Thandie Ndlovu', email: 'thandie.ndlovu@newwave.co.za', phone: '083 455 0192', role: 'Director, Signatory' },
  ],
  'mmp-removals': [
    { name: 'Riaan Botha', email: 'riaan@mmpremovals.co.za', phone: '071 288 4410', role: 'Member, Signatory' },
    { name: 'Sipho Mokoena', email: 'sipho@mmpremovals.co.za', phone: '072 930 1155', role: 'Member' },
  ],
  'zm-consulting': [
    { name: 'Zanele Mthembu', email: 'zanele@zmconsulting.co.za', phone: '084 612 7730', role: 'Director, Signatory' },
  ],
  'lowmar-farm': [
    { name: 'Anika Pillay', email: 'anika.pillay@lowmarfarm.co.za', phone: '076 501 2244', role: 'Director, Signatory' },
    { name: 'Pieter Lourens', email: 'pieter@lowmarfarm.co.za', phone: '082 114 9087', role: 'Director' },
  ],
};
