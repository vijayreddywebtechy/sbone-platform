// Mock business profiles, one per company in the header's Switch Business list, until the profile API is available.

export type LinkedAccountType = 'current' | 'savings';

export interface LinkedAccount {
  number: string;
  type: LinkedAccountType;
  name: string;
  balance: number;
  available: number;
  /** ISO date the account was opened */
  opened: string;
}

export interface Director {
  name: string;
  /** Pending directors haven't approved their access yet */
  status: 'approved' | 'pending';
}

export interface BusinessDetails {
  registeredName: string;
  registrationNumber: string;
  tradingName: string;
  industry: string;
  businessType: string;
  country: string;
  countryCode: string;
  currency: string;
  currencyName: string;
  taxNumber?: string;
  kycStatus: 'verified' | 'pending';
  businessPartnerRef: string;
  legalEntityRef: string;
  profileStatus: 'APPROVED' | 'IN REVIEW';
  profileCompleteness: number;
  admin: { name: string; email: string; online: boolean };
  accounts: LinkedAccount[];
  directors: Director[];
}

/** "Today" for the mock data, so day counts match the September 2026 transactions elsewhere and don't differ between server and browser. */
export const REFERENCE_DATE = '2026-09-08';

const SOUTH_AFRICA = { country: 'South Africa', countryCode: 'ZA', currency: 'ZAR', currencyName: 'South African Rand' };

export const BUSINESS_DETAILS: Record<string, BusinessDetails> = {
  abc: {
    ...SOUTH_AFRICA,
    registeredName: 'ATHITHI OBB DATA',
    registrationNumber: '2023/110988/23',
    tradingName: 'ATHITHI OBB DATA',
    industry: 'ENTERPRISE',
    businessType: 'ENTERPRISE DIRECT',
    kycStatus: 'verified',
    businessPartnerRef: 'BP enc_v1_••••d307',
    legalEntityRef: 'enc_v1_••••52b7',
    profileStatus: 'APPROVED',
    profileCompleteness: 88,
    admin: { name: 'Monica Geller', email: 'marinda.fokker@standardbank.co.za', online: true },
    accounts: [
      { number: '10006353477', type: 'savings', name: 'BUSINESS MONEYMARKET CALL', balance: 5_859.64, available: 5_859.64, opened: '2019-11-14' },
      { number: '10006354182', type: 'current', name: 'BUSINESS CURRENT ACCOUNT', balance: 2_846_006.87, available: 2_883_006.87, opened: '2019-08-29' },
      { number: '10006353379', type: 'current', name: 'MYMOBIZ CURRENT ACCOUNT', balance: 17_572.47, available: 17_572.47, opened: '2024-01-25' },
      { number: '10006353170', type: 'savings', name: 'BUSINESS MONEYMARKET CALL', balance: 8_965_949.2, available: 8_965_949.2, opened: '2019-11-14' },
      { number: '10006353189', type: 'current', name: 'BUSINESS CALL', balance: 124_951.09, available: 124_951.09, opened: '2019-11-15' },
      { number: '10006350054', type: 'current', name: 'BUSINESS NOTICE DEP', balance: 0, available: 0, opened: '2024-07-20' },
      { number: '10006351571', type: 'current', name: 'BUSINESS NOTICE DEP', balance: 0, available: 0, opened: '2024-07-20' },
      { number: '10006359392', type: 'current', name: 'BUSINESS CURRENT ACCOUNT', balance: -515.3, available: -515.3, opened: '2026-03-16' },
    ],
    directors: [
      { name: 'JAMES SMITH', status: 'pending' },
      { name: 'HENSON SOLOMON', status: 'pending' },
      { name: 'KUMAR SS', status: 'pending' },
      { name: 'RAMAN KT', status: 'pending' },
      { name: 'GOVENDER NICKY', status: 'pending' },
      { name: 'NAIDU HANSIKA', status: 'pending' },
      { name: 'TEBOGO MOLOI', status: 'approved' },
      { name: 'CRIS FRANK', status: 'approved' },
      { name: 'BENJAMIN EIZENBERG', status: 'approved' },
      { name: 'PRECIOUS THANDO', status: 'approved' },
    ],
  },
  xyz: {
    ...SOUTH_AFRICA,
    registeredName: 'XYZ COMPANY (PTY) LTD',
    registrationNumber: '2015/004512/07',
    tradingName: 'XYZ TRADING',
    industry: 'WHOLESALE & RETAIL',
    businessType: 'PRIVATE COMPANY',
    taxNumber: '9123456789',
    kycStatus: 'verified',
    businessPartnerRef: 'BP enc_v1_••••a914',
    legalEntityRef: 'enc_v1_••••7c10',
    profileStatus: 'APPROVED',
    profileCompleteness: 100,
    admin: { name: 'Kobus Marais', email: 'kobus.marais@xyzcompany.co.za', online: true },
    accounts: [
      { number: '20001234567', type: 'current', name: 'BUSINESS CURRENT ACCOUNT', balance: 412_350.2, available: 450_350.2, opened: '2015-03-02' },
      { number: '20002345678', type: 'savings', name: 'BUSINESS MONEYMARKET CALL', balance: 1_158_900, available: 1_158_900, opened: '2016-06-17' },
      { number: '20005678901', type: 'current', name: 'PAYROLL ACCOUNT', balance: 34_120, available: 34_120, opened: '2018-01-09' },
      { number: '20007890123', type: 'current', name: 'SUPPLIER PAYMENTS', balance: 76_480.1, available: 76_480.1, opened: '2025-11-21' },
    ],
    directors: [
      { name: 'KOBUS MARAIS', status: 'approved' },
      { name: 'LERATO KHUMALO', status: 'approved' },
      { name: 'PIETER VAN WYK', status: 'pending' },
    ],
  },
  thermo: {
    ...SOUTH_AFRICA,
    registeredName: 'THERMO LLP',
    registrationNumber: '2020/556301/21',
    tradingName: 'THERMO ENGINEERING',
    industry: 'MANUFACTURING',
    businessType: 'PARTNERSHIP',
    kycStatus: 'pending',
    businessPartnerRef: 'BP enc_v1_••••0f22',
    legalEntityRef: 'enc_v1_••••e4a1',
    profileStatus: 'IN REVIEW',
    profileCompleteness: 64,
    admin: { name: 'Ayesha Patel', email: 'ayesha.patel@thermo.co.za', online: false },
    accounts: [
      { number: '30001112223', type: 'current', name: 'BUSINESS CURRENT ACCOUNT', balance: 88_210.55, available: 98_210.55, opened: '2020-09-14' },
      { number: '30003334445', type: 'savings', name: 'BUSINESS NOTICE DEP', balance: 0, available: 0, opened: '2026-05-04' },
    ],
    directors: [
      { name: 'AYESHA PATEL', status: 'approved' },
      { name: 'DAVID NKOSI', status: 'pending' },
    ],
  },
  npo: {
    ...SOUTH_AFRICA,
    registeredName: 'NPO PROPRIETORS NPC',
    registrationNumber: '2011/120044/08',
    tradingName: 'NPO PROPRIETORS',
    industry: 'NON-PROFIT',
    businessType: 'NON-PROFIT COMPANY',
    taxNumber: '9988776655',
    kycStatus: 'verified',
    businessPartnerRef: 'BP enc_v1_••••61bd',
    legalEntityRef: 'enc_v1_••••90f3',
    profileStatus: 'APPROVED',
    profileCompleteness: 94,
    admin: { name: 'Thandi Mokoena', email: 'thandi@npoproprietors.org.za', online: true },
    accounts: [
      { number: '40009876543', type: 'current', name: 'BUSINESS CURRENT ACCOUNT', balance: 63_400, available: 63_400, opened: '2011-07-01' },
      { number: '40008765432', type: 'savings', name: 'BUSINESS MONEYMARKET CALL', balance: 245_000, available: 245_000, opened: '2012-02-15' },
      { number: '40007654321', type: 'savings', name: 'DONOR RESERVE', balance: 1_250_000, available: 1_250_000, opened: '2019-04-30' },
    ],
    directors: [
      { name: 'THANDI MOKOENA', status: 'approved' },
      { name: 'SIPHO DLAMINI', status: 'approved' },
      { name: 'MARY JACOBS', status: 'approved' },
      { name: 'JOHAN BOTHA', status: 'pending' },
    ],
  },
};

const DAY = 24 * 60 * 60 * 1000;
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const daysSince = (iso: string) => Math.round((Date.parse(REFERENCE_DATE) - Date.parse(iso)) / DAY);
export const yearsSince = (iso: string) => daysSince(iso) / 365.25;

/** "14 Nov 2019" */
export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${SHORT_MONTHS[month - 1]} ${year}`;
};

/** "Aug 2019" */
export const formatMonthYear = (iso: string) => {
  const [year, month] = iso.split('-').map(Number);
  return `${SHORT_MONTHS[month - 1]} ${year}`;
};

/** "**** **** 3477" */
export const maskNumber = (number: string) => `**** **** ${number.slice(-4)}`;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

/** "R 11,996,823.97" — the profile writes amounts with comma grouping */
export const formatAmount = (value: number) =>
  `R ${value < 0 ? '-' : ''}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
