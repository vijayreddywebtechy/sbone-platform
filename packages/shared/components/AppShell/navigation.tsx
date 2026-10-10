import type { ReactNode } from 'react';

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** Which micro frontend (multi-zone) serves a path: the migration app ("main") or a separately deployed zone */
export type Zone = 'main' | 'beneficiaries';

/** Path prefix (Next.js basePath) of each zone on the shared domain */
export const ZONE_BASE_PATHS: Record<Zone, string> = {
  main: '',
  beneficiaries: '/beneficiaries',
};

export interface NavItem {
  label: string;
  /** Set for pages that exist; the rest are placeholders until those screens are built */
  href?: string;
  /** Zone serving the page; defaults to "main" */
  zone?: Zone;
  icon: ReactNode;
}

/** SBOne side navigation, shared by every zone so the rail looks and works the same everywhere */
export const SBONE_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <Icon>
        <path d="M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10" />
      </Icon>
    ),
  },
  {
    label: 'Queries',
    href: '/queries',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01" />
      </Icon>
    ),
  },
  {
    label: 'Insights',
    href: '/insights',
    icon: (
      <Icon>
        <path d="M12 3v9l6.4 6.4A9 9 0 1 1 12 3Z" />
        <path d="M15 3.5A9 9 0 0 1 20.5 9H15Z" />
      </Icon>
    ),
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: (
      <Icon>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </Icon>
    ),
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: (
      <Icon>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </Icon>
    ),
  },
  {
    label: 'Business Profile',
    href: '/business-details',
    icon: (
      <Icon>
        <path d="M4 21V5h10v16M14 10h6v11M2 21h20M7 9h1M10 9h1M7 13h1M10 13h1M7 17h1M10 17h1" />
      </Icon>
    ),
  },
  {
    label: 'Roles & Permissions',
    href: '/roles-permissions',
    icon: (
      <Icon>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.7-5 6-5 1.2 0 2.3.3 3.2.8M17 13l3 1.2v2.6c0 1.8-1.3 3.4-3 4-1.7-.6-3-2.2-3-4v-2.6Z" />
      </Icon>
    ),
  },
  {
    label: 'International Payments',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </Icon>
    ),
  },
  {
    label: 'Beneficiaries',
    href: '/beneficiaries',
    zone: 'beneficiaries',
    icon: (
      <Icon>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5" />
      </Icon>
    ),
  },
];
