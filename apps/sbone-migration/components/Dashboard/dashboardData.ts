// Mock dashboard data until the accounts, cashflow and FX APIs are available

export const USER = {
  name: 'Kobus Marais',
  role: 'Administrator',
  business: 'ABC Architects',
  // Fixed so server and browser render the same text; comes from the session once sign-in is connected
  lastSignedIn: '27 Oct 2025, 12:35 PM',
};

export type AccountType = 'current' | 'savings' | 'notice' | 'foreign';

// Display order matches the validated colour order in _variables.scss
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  current: 'Business current',
  notice: 'Notice deposit',
  savings: 'Savings',
  foreign: 'Foreign currency',
};

export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[];

export type Currency = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  number: string;
  currency: Currency;
  /** In the account's own currency; negative when overdrawn. */
  balance: number;
}

export const ACCOUNTS: Account[] = [
  { id: '1', name: 'Business Current Account', type: 'current', number: '10 00 123 456 7', currency: 'ZAR', balance: 412_350.2 },
  { id: '2', name: 'Business Savings', type: 'savings', number: '10 00 234 567 8', currency: 'ZAR', balance: 158_900 },
  { id: '3', name: '32-Day Notice Deposit', type: 'notice', number: '10 00 345 678 9', currency: 'ZAR', balance: 58_749.8 },
  { id: '4', name: 'Foreign Currency (USD)', type: 'foreign', number: '10 00 456 789 0', currency: 'USD', balance: 5_628.4 },
  { id: '5', name: 'Payroll Account', type: 'current', number: '10 00 567 890 1', currency: 'ZAR', balance: 34_120 },
  { id: '6', name: 'Tax Reserve', type: 'savings', number: '10 00 678 901 2', currency: 'ZAR', balance: 21_005.75 },
  { id: '7', name: 'Supplier Payments', type: 'current', number: '10 00 789 012 3', currency: 'ZAR', balance: 76_480.1 },
  { id: '8', name: '7-Day Notice Deposit', type: 'notice', number: '10 00 890 123 4', currency: 'ZAR', balance: 120_000 },
  { id: '9', name: 'Foreign Currency (EUR)', type: 'foreign', number: '10 00 901 234 5', currency: 'EUR', balance: 2_701.15 },
  { id: '10', name: 'Petty Cash', type: 'current', number: '10 00 012 345 6', currency: 'ZAR', balance: -226.93 },
  { id: '11', name: 'Capital Expenditure Reserve', type: 'savings', number: '10 00 123 987 6', currency: 'ZAR', balance: 250_000 },
];

export interface CashflowMonth {
  month: string;
  moneyIn: number;
  moneyOut: number;
}

export const CASHFLOW: CashflowMonth[] = [
  { month: 'Jan', moneyIn: 128_000, moneyOut: 104_000 },
  { month: 'Feb', moneyIn: 142_500, moneyOut: 131_200 },
  { month: 'Mar', moneyIn: 119_800, moneyOut: 126_400 },
  { month: 'Apr', moneyIn: 176_300, moneyOut: 138_900 },
  { month: 'May', moneyIn: 161_200, moneyOut: 149_700 },
  { month: 'Jun', moneyIn: 133_900, moneyOut: 117_600 },
  { month: 'Jul', moneyIn: 158_850, moneyOut: 140_300 },
  { month: 'Aug', moneyIn: 149_400, moneyOut: 152_800 },
  { month: 'Sep', moneyIn: 171_600, moneyOut: 143_100 },
  { month: 'Oct', moneyIn: 139_700, moneyOut: 128_500 },
  { month: 'Nov', moneyIn: 194_200, moneyOut: 161_900 },
  { month: 'Dec', moneyIn: 182_400, moneyOut: 170_200 },
];

// Rand value of one unit of each currency
export const FX_RATES: Record<Currency, number> = {
  ZAR: 1,
  USD: 16.42,
  EUR: 17.86,
  GBP: 20.93,
  JPY: 0.1098,
  CNY: 2.29,
};

export interface FxPair {
  base: Currency;
  quote: Currency;
  bid: number;
  ask: number;
  change: number;
}

export const FX_PAIRS: FxPair[] = [
  { base: 'USD', quote: 'ZAR', bid: 16.4075, ask: 16.4315, change: 0.0371 },
  { base: 'EUR', quote: 'ZAR', bid: 17.8462, ask: 17.8791, change: -0.0214 },
  { base: 'GBP', quote: 'ZAR', bid: 20.9118, ask: 20.9502, change: 0.0563 },
  { base: 'JPY', quote: 'ZAR', bid: 0.1096, ask: 0.1101, change: 0.0004 },
  { base: 'USD', quote: 'GBP', bid: 0.7838, ask: 0.7851, change: -0.0012 },
  { base: 'USD', quote: 'EUR', bid: 0.9189, ask: 0.9203, change: 0.0021 },
  { base: 'USD', quote: 'JPY', bid: 149.42, ask: 149.66, change: -0.31 },
];

export const FX_TIMESTAMP = '23:59 UTC · Wednesday, 7 October 2026';

export const DIGITAL_HUB_LINKS = [
  { label: 'Online Banking for Business', href: 'https://www.standardbank.co.za/' },
  { label: 'Trade Suite', href: 'https://www.standardbank.co.za/' },
  { label: 'Business Online', href: 'https://www.standardbank.co.za/' },
];

export const BANKER = {
  initials: 'ED',
  name: 'Enterprise Direct',
  team: 'Your business banking team',
  email: 'jane.khumalo@standardbank.co.za',
  phone: '+27 27 718 2728',
};

export const WHATS_NEW = [
  { title: 'Digital Hub', text: 'Sign in to all your digital banking platforms from one place, without extra passwords.' },
  { title: 'Documents', text: 'Get official stamped bank statements, account confirmation letters and more.' },
  { title: 'Cashflow', text: 'See money in and money out across your accounts at a glance.' },
  { title: 'Roles & Permissions', text: 'More control over who can do what, with access management for admins/owners.' },
];

/** "630 000.00" — space-grouped thousands and a decimal point, as shown across SBOne. */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '0.00';
  const [whole, cents] = Math.abs(value).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${value < 0 ? '-' : ''}${grouped}.${cents}`;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥' };

/** "R 630 000.00", "$ 2 400.00", "-R 226.93" */
export function formatMoney(value: number, currency: Currency = 'ZAR'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return value < 0 ? `-${symbol} ${formatAmount(-value)}` : `${symbol} ${formatAmount(value)}`;
}

/** "R 630 000.00" — Standard Bank's display format for rand amounts. */
export function formatRand(value: number): string {
  return formatMoney(value, 'ZAR');
}

/** Account balance converted to rand, for totals across currencies. */
export const toRand = (account: Account) => account.balance * FX_RATES[account.currency];

/** Masked account number, e.g. "•••• •••• 4567". */
export const maskAccountNumber = (number: string) => `•••• •••• ${number.replace(/\s/g, '').slice(-4)}`;

export type CashflowPeriod = 3 | 6 | 12;

/** Monthly cashflow for one account (or all accounts), scaled from the business total. */
export function cashflowFor(accountId: string | 'all', months: CashflowPeriod = 12): CashflowMonth[] {
  const recent = CASHFLOW.slice(-months);
  if (accountId === 'all') return recent;
  const account = ACCOUNTS.find((item) => item.id === accountId);
  const share = account ? Math.max(0.05, Math.abs(toRand(account)) / ACCOUNTS.reduce((sum, a) => sum + Math.abs(toRand(a)), 0)) : 1;
  const wobble = (index: number) => 0.85 + ((Number(accountId) * 7 + index * 13) % 30) / 100;
  return recent.map((month, index) => ({
    month: month.month,
    moneyIn: Math.round(month.moneyIn * share * wobble(index) * 100) / 100,
    moneyOut: Math.round(month.moneyOut * share * wobble(index + 3) * 100) / 100,
  }));
}

export interface Campaign {
  id: string;
  title: string;
  text: string;
  action: string;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'simplyblu',
    title: 'SimplyBLU',
    text: 'Whether you’re trading on the go, selling online or running a fully-fledged store, get the tools you need with SimplyBLU’s all-in-one merchant platform.',
    action: 'Apply now',
  },
  {
    id: 'bca',
    title: 'Business Current Account',
    text: 'Run your business with an account that lets you manage your money and transact 24/7 from the Banking App or Internet Banking.',
    action: 'Apply now',
  },
  {
    id: 'fx',
    title: 'Trade across borders',
    text: 'Pay suppliers and receive payments in more than 30 currencies, with competitive rates and same-day settlement.',
    action: 'Find out more',
  },
];

export interface Company {
  id: string;
  name: string;
  /** The signed-in user's role in this company. */
  role: 'Admin' | 'Viewer';
}

/** Companies the signed-in user can switch between (mock). */
export const COMPANIES: Company[] = [
  { id: 'xyz', name: 'XYZ Company', role: 'Admin' },
  { id: 'abc', name: 'ABC Company', role: 'Admin' },
  { id: 'thermo', name: 'Thermo LLP', role: 'Viewer' },
  { id: 'npo', name: 'NPO Proprietors', role: 'Admin' },
];

export const DEFAULT_COMPANY_ID = 'abc';
