// Roles and the permissions each one can have (mock rules until the permissions API is available)

export type AccessRole = 'capturer' | 'releaser' | 'dealer' | 'viewer' | 'admin';

export const ACCESS_ROLES: Array<{ value: AccessRole; title: string; description: string }> = [
  {
    value: 'capturer',
    title: 'Capturer/Initiator',
    description: 'Initiate payments and payment instructions, view account balances, documents and transactions.',
  },
  {
    value: 'releaser',
    title: 'Releaser/Approver',
    description: 'Approve and release payment instructions, view balances, documents, transactions and FX cover.',
  },
  {
    value: 'dealer',
    title: 'Dealer',
    description:
      'Initiate and execute foreign exchange (FX) cover purchases to lock in exchange rates for international payments.',
  },
  {
    value: 'viewer',
    title: 'Viewer',
    description: 'Limited to viewing account balances, documents and transactions.',
  },
  {
    value: 'admin',
    title: 'Admin/Designated Person',
    description:
      'Full account access to move money, view balances and transactions, manage team account and profile access.',
  },
];

export interface Permission {
  id: string;
  label: string;
}

export interface PermissionGroup {
  id: string;
  title: string;
  /** Laid out in columns; each column is a list of permissions. */
  columns: Permission[][];
}

export interface PermissionSection {
  id: string;
  title: string;
  groups: PermissionGroup[];
}

export const PERMISSION_SECTIONS: PermissionSection[] = [
  {
    id: 'account-access',
    title: 'Account access',
    groups: [
      {
        id: 'account',
        title: 'Account access',
        columns: [
          [
            { id: 'view-accounts', label: 'View accounts' },
            { id: 'view-reports', label: 'View reports' },
            { id: 'view-cards', label: 'View cards' },
            { id: 'view-balances', label: 'View balances and transaction history' },
            { id: 'view-documents', label: 'View, share and download account documents' },
          ],
        ],
      },
      {
        id: 'servicing',
        title: 'Platform servicing features',
        columns: [
          [
            { id: 'log-queries', label: 'Log and track their queries' },
            { id: 'view-cashflows', label: 'View account cashflows' },
            { id: 'contact-rm', label: 'Contact relationship manager' },
            { id: 'chatbot', label: 'Access ChatBot' },
          ],
        ],
      },
    ],
  },
  {
    id: 'administrative',
    title: 'Administrative permissions',
    groups: [
      {
        id: 'administration',
        title: 'Administration and management',
        columns: [
          [
            { id: 'user-management', label: 'User management' },
            { id: 'role-management', label: 'Role management' },
            { id: 'link-accounts', label: 'Link and manage accounts' },
            { id: 'system-settings', label: 'System settings' },
          ],
        ],
      },
      {
        id: 'limits',
        title: 'Limits management',
        columns: [
          [
            { id: 'user-limits', label: 'Set / manage user limits' },
            { id: 'transaction-limits', label: 'Set / manage transaction limits' },
            { id: 'beneficiary-limits', label: 'Set / manage beneficiary approval limits' },
          ],
        ],
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment permissions',
    groups: [
      {
        id: 'payment-types',
        title: 'Payment types',
        columns: [
          [
            { id: 'domestic', label: 'Domestic payments' },
            { id: 'iat', label: 'IAT - Inter-Account Transfer' },
          ],
          [
            { id: 'international', label: 'International payments' },
            { id: 'ott', label: 'OTT - Outgoing Telegraphic Transfer' },
            { id: 'itt', label: 'ITT - Incoming Telegraphic Transfer' },
          ],
        ],
      },
      {
        id: 'transactions',
        title: 'Transaction permissions',
        columns: [
          [
            { id: 'capture', label: 'Capture transactions' },
            { id: 'amend', label: 'Amend transactions' },
            { id: 'approve', label: 'Approve/Release transactions' },
          ],
        ],
      },
      {
        id: 'fx',
        title: 'FX permissions',
        columns: [
          [
            { id: 'view-fx', label: 'View FX Rates' },
            { id: 'purchase-fx', label: 'Purchase FX Cover' },
          ],
        ],
      },
      {
        id: 'beneficiaries',
        title: 'Beneficiary management',
        columns: [
          [
            { id: 'create-beneficiaries', label: 'Create beneficiaries' },
            { id: 'manage-beneficiaries', label: 'Manage beneficiaries' },
            { id: 'approve-beneficiaries', label: 'Approve beneficiaries' },
          ],
        ],
      },
    ],
  },
];

/** Groups whose permissions sit in a single row rather than a column (as in the design). */
export const INLINE_GROUPS = new Set(['transactions', 'fx', 'beneficiaries']);

export const RELEASE_LEVELS = [
  { value: '0', label: 'Level 0 - Capture and Release' },
  { value: '1', label: 'Level 1 - Single releaser' },
  { value: '2', label: 'Level 2 - Multiple releasers' },
  { value: '3', label: 'Level 3 - Multiple releasers with mandatory' },
];

const ALL_PERMISSIONS = PERMISSION_SECTIONS.flatMap((section) =>
  section.groups.flatMap((group) => group.columns.flat().map((permission) => permission.id)),
);

/**
 * Per role: which permissions can be switched on (the rest are greyed out) and which start on.
 * Release levels apply only to roles that release payments.
 */
export const ROLE_RULES: Record<AccessRole, { allowed: string[]; defaults: string[]; releaseLevels: boolean }> = {
  capturer: {
    allowed: [
      'view-accounts',
      'view-reports',
      'view-cards',
      'log-queries',
      'view-cashflows',
      'domestic',
      'iat',
      'international',
      'ott',
      'itt',
      'capture',
      'amend',
      'create-beneficiaries',
      'manage-beneficiaries',
    ],
    defaults: [
      'view-accounts',
      'view-reports',
      'view-cards',
      'log-queries',
      'view-cashflows',
      'domestic',
      'iat',
      'international',
      'ott',
      'itt',
      'capture',
      'amend',
      'create-beneficiaries',
      'manage-beneficiaries',
    ],
    releaseLevels: false,
  },
  releaser: {
    allowed: [
      'view-accounts',
      'view-reports',
      'view-cards',
      'view-balances',
      'view-documents',
      'log-queries',
      'view-cashflows',
      'contact-rm',
      'domestic',
      'iat',
      'international',
      'ott',
      'itt',
      'approve',
      'view-fx',
      'approve-beneficiaries',
    ],
    defaults: [
      'view-accounts',
      'view-balances',
      'view-documents',
      'log-queries',
      'domestic',
      'iat',
      'international',
      'ott',
      'itt',
      'approve',
      'view-fx',
      'approve-beneficiaries',
    ],
    releaseLevels: true,
  },
  dealer: {
    allowed: [
      'view-accounts',
      'view-balances',
      'view-documents',
      'log-queries',
      'international',
      'ott',
      'itt',
      'view-fx',
      'purchase-fx',
    ],
    defaults: ['view-accounts', 'view-balances', 'log-queries', 'international', 'ott', 'view-fx', 'purchase-fx'],
    releaseLevels: false,
  },
  viewer: {
    allowed: [
      'view-accounts',
      'view-reports',
      'view-cards',
      'view-balances',
      'view-documents',
      'log-queries',
      'view-cashflows',
    ],
    defaults: ['view-accounts', 'view-balances', 'view-documents', 'log-queries'],
    releaseLevels: false,
  },
  admin: {
    allowed: ALL_PERMISSIONS,
    defaults: ALL_PERMISSIONS,
    releaseLevels: true,
  },
};
