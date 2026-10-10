import type { ShellCompany } from '@sbone/shared';

// Signed-in user and businesses for the shared SBOne shell (mock until sign-in is connected; same as sbone-migration)
export const USER = { name: 'Kobus Marais' };

export const COMPANIES: ShellCompany[] = [
  { id: 'xyz', name: 'XYZ Company', role: 'Admin' },
  { id: 'abc', name: 'ABC Company', role: 'Admin' },
  { id: 'thermo', name: 'Thermo LLP', role: 'Viewer' },
  { id: 'npo', name: 'NPO Proprietors', role: 'Admin' },
];

export const DEFAULT_COMPANY_ID = 'abc';
