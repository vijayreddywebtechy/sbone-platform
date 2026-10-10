// Mock accounts and limits for the invite flow until the accounts API is available

export type LimitField = 'domesticDaily' | 'domesticMonthly' | 'internationalMonthly';

export const LIMIT_LABELS: Record<LimitField, string> = {
  domesticDaily: 'Domestic daily limit',
  domesticMonthly: 'Domestic monthly limit',
  internationalMonthly: 'International monthly limit',
};

/** Fixed column for each limit, so fields line up across account types. */
export const LIMIT_COLUMNS: LimitField[] = ['domesticDaily', 'domesticMonthly', 'internationalMonthly'];

export type AccountKind = 'current' | 'savings' | 'cfc';

export interface InviteAccount {
  id: string;
  name: string;
  number: string;
  kind: AccountKind;
  /** Overall limit on the account. */
  accountLimit: number;
  isDefault?: boolean;
  /** Not available to give access to (e.g. restricted); shown greyed out. */
  unavailable?: boolean;
  /** Limits this account type supports, with suggested starting values. */
  limits: Partial<Record<LimitField, number>>;
}

export const ACCOUNT_GROUPS: Array<{ kind: AccountKind; title: string }> = [
  { kind: 'current', title: 'Current Accounts' },
  { kind: 'savings', title: 'Savings Accounts' },
  { kind: 'cfc', title: 'CFC Accounts' },
];

export const INVITE_ACCOUNTS: InviteAccount[] = [
  {
    id: 'bca-7632',
    name: 'Business Current Account',
    number: '6785 0454 7632',
    kind: 'current',
    accountLimit: 3_000_000,
    isDefault: true,
    limits: { domesticDaily: 100_000, domesticMonthly: 300_000, internationalMonthly: 300_000 },
  },
  {
    id: 'mymobiz',
    name: 'MyMoBiz Account',
    number: '4988 0454 7632',
    kind: 'current',
    accountLimit: 300_000,
    limits: { domesticDaily: 30_000, domesticMonthly: 100_000, internationalMonthly: 100_000 },
  },
  {
    id: 'abc-expense',
    name: 'ABC Expense Account',
    number: '3821 0454 7632',
    kind: 'current',
    accountLimit: 3_000_000,
    limits: { domesticDaily: 30_000, domesticMonthly: 150_000, internationalMonthly: 300_000 },
  },
  {
    id: 'bca-4656',
    name: 'Business Current Account',
    number: '4656 0454 7632',
    kind: 'current',
    accountLimit: 3_000_000,
    unavailable: true,
    limits: { domesticDaily: 30_000, domesticMonthly: 300_000, internationalMonthly: 300_000 },
  },
  {
    id: 'marketlink',
    name: 'Business MarketLink',
    number: '3822 0454 7690',
    kind: 'savings',
    accountLimit: 3_000_000,
    limits: { domesticDaily: 10_000, domesticMonthly: 300_000 },
  },
  {
    id: 'puresave',
    name: 'Business PureSave Account',
    number: '4722 0454 7685',
    kind: 'savings',
    accountLimit: 3_000_000,
    limits: { domesticDaily: 10_000, domesticMonthly: 300_000 },
  },
  {
    id: 'international',
    name: 'Business International',
    number: '4722 0454 7685',
    kind: 'cfc',
    accountLimit: 3_000_000,
    limits: { domesticDaily: 100_000, domesticMonthly: 300_000, internationalMonthly: 300_000 },
  },
];

/** "100 000.00" */
export const formatLimit = (value: number) => {
  const [whole, cents] = value.toFixed(2).split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}.${cents}`;
};

/** Parses "100 000.00" / "100000" back to a number; NaN when empty or invalid. */
export const parseLimit = (text: string) => (text.trim() === '' ? NaN : Number(text.replace(/[\s,]/g, '')));

export interface AccountState {
  on: boolean;
  limits: Partial<Record<LimitField, string>>;
}

/** Starting point: every available account on, with its suggested limits. */
export const initialAccountStates = (accounts: InviteAccount[]) =>
  Object.fromEntries(
    accounts.map((account) => [
      account.id,
      {
        on: !account.unavailable,
        limits: Object.fromEntries(
          Object.entries(account.limits).map(([field, value]) => [field, formatLimit(value as number)]),
        ),
      },
    ]),
  ) as Record<string, AccountState>;
