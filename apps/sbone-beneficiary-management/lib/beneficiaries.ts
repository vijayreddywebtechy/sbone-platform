// Beneficiary model, options and mock data until the beneficiaries API is available

export type PaymentType = 'international' | 'domestic' | 'wallet' | 'public';
export type BeneficiaryType = 'individual' | 'corporate';
export type BeneficiaryStatus = 'active' | 'inactive' | 'pending';

export interface BeneficiaryForm {
  beneficiaryType: BeneficiaryType;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  swift: string;
  bankCountry: string;
  bankName: string;
  bankAddress: string;
  accountNumber: string;
  routingCode: string;
  paymentCurrency: string;
  limitCurrency: string;
  monthlyLimit: string;
}

export interface Beneficiary extends BeneficiaryForm {
  id: string;
  paymentType: PaymentType;
  status: BeneficiaryStatus;
  /** Shown in the Account Number column when the account is identified by its type (e.g. Savings) */
  accountLabel?: string;
}

export const PAYMENT_TYPES: Array<{ value: PaymentType; title: string; description: string; available: boolean }> = [
  { value: 'international', title: 'International Payments', description: 'Add a beneficiary for payments to another country', available: true },
  { value: 'domestic', title: 'Domestic Payments', description: 'Add a beneficiary for payments within South Africa', available: false },
  { value: 'wallet', title: 'Wallet Payments', description: 'Add a beneficiary for payments to a digital wallet', available: false },
  { value: 'public', title: 'Public & Govt. Payments', description: 'Add a beneficiary for payments to public or government services', available: false },
];

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  international: 'International',
  domestic: 'Domestic',
  wallet: 'Wallet',
  public: 'Public & Govt.',
};

export const STATUS_LABELS: Record<BeneficiaryStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending verification',
};

export const BENEFICIARY_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporate', label: 'Corporate' },
];

export const COUNTRIES = [
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'India', label: 'India' },
  { value: 'Germany', label: 'Germany' },
  { value: 'China', label: 'China' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
];

export const BANKS = [
  { value: 'JPMorgan Chase', label: 'JPMorgan Chase' },
  { value: 'Bank of America', label: 'Bank of America' },
  { value: 'HSBC', label: 'HSBC' },
  { value: 'HDFC', label: 'HDFC' },
  { value: 'Deutsche Bank', label: 'Deutsche Bank' },
  { value: 'Standard Bank', label: 'Standard Bank' },
];

export const CURRENCIES = ['USD', 'GBP', 'EUR', 'INR', 'CNY', 'KES', 'ZAR'].map((code) => ({ value: code, label: code }));

export const EMPTY_FORM: BeneficiaryForm = {
  beneficiaryType: 'individual',
  name: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  swift: '',
  bankCountry: '',
  bankName: '',
  bankAddress: '',
  accountNumber: '',
  routingCode: '',
  paymentCurrency: 'USD',
  limitCurrency: 'ZAR',
  monthlyLimit: '',
};

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'global-manufacture-intl',
    paymentType: 'international',
    status: 'active',
    beneficiaryType: 'corporate',
    name: 'Global Manufacture LTD',
    addressLine1: '12 Rivonia Road',
    addressLine2: 'Sandton',
    addressLine3: 'Johannesburg, 2196, South Africa',
    swift: '13987378WHIEIUUI',
    bankCountry: 'India',
    bankName: 'HDFC',
    bankAddress: 'Mumbai, India',
    accountNumber: '367247819974724',
    routingCode: 'HDFC0001234',
    paymentCurrency: 'USD',
    limitCurrency: 'ZAR',
    monthlyLimit: '520000',
  },
  {
    id: 'hitachi-djk',
    paymentType: 'international',
    status: 'inactive',
    beneficiaryType: 'corporate',
    name: 'Hitachi djk Services LTD',
    addressLine1: '4-6 Ohtemachi',
    addressLine2: 'Chiyoda-ku',
    addressLine3: 'Tokyo, Japan',
    swift: 'HDFCINBBXXX',
    bankCountry: 'India',
    bankName: 'HDFC',
    bankAddress: 'Mumbai, India',
    accountNumber: '50100234567812',
    accountLabel: 'Savings',
    routingCode: 'HDFC0005678',
    paymentCurrency: 'USD',
    limitCurrency: 'ZAR',
    monthlyLimit: '1500000',
  },
  {
    id: 'global-manufacture-wallet',
    paymentType: 'wallet',
    status: 'active',
    beneficiaryType: 'corporate',
    name: 'Global Manufacture LTD',
    addressLine1: '12 Rivonia Road',
    addressLine2: 'Sandton',
    addressLine3: 'Johannesburg, 2196, South Africa',
    swift: 'ABSAZAJJ',
    bankCountry: 'South Africa',
    bankName: 'ABSA',
    bankAddress: 'Johannesburg, South Africa',
    accountNumber: '4087654321',
    accountLabel: 'Cheque/Current',
    routingCode: '632005',
    paymentCurrency: 'ZAR',
    limitCurrency: 'ZAR',
    monthlyLimit: '2180000',
  },
  {
    id: 'salesforce',
    paymentType: 'domestic',
    status: 'active',
    beneficiaryType: 'individual',
    name: 'Salesforce and Co',
    addressLine1: '1 Bree Street',
    addressLine2: 'Cape Town City Centre',
    addressLine3: 'Cape Town, 8001',
    swift: 'FIRNZAJJ',
    bankCountry: 'South Africa',
    bankName: 'FNB',
    bankAddress: 'Johannesburg, South Africa',
    accountNumber: '62812345678',
    accountLabel: 'Cheque/Current',
    routingCode: '250655',
    paymentCurrency: 'ZAR',
    limitCurrency: 'ZAR',
    monthlyLimit: '3000000',
  },
];

/** "R 520 000" */
export const formatLimit = (value: string, currency = 'ZAR') => {
  const amount = Number(value.replace(/[^\d.]/g, ''));
  if (!amount) return '—';
  const symbol = currency === 'ZAR' ? 'R' : currency;
  return `${symbol} ${Math.round(amount).toLocaleString('en-US').replace(/,/g, ' ')}`;
};

/** "R 7.2M" */
export const formatCompact = (value: number) =>
  value >= 1_000_000 ? `R ${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `R ${Math.round(value / 1_000)}K` : `R ${value}`;

/** Problems with the form, by field; empty when it can be saved */
export function validate(form: BeneficiaryForm): Partial<Record<keyof BeneficiaryForm, string>> {
  const errors: Partial<Record<keyof BeneficiaryForm, string>> = {};
  const required: Array<[keyof BeneficiaryForm, string]> = [
    ['name', 'Enter the beneficiary’s full legal name'],
    ['addressLine1', 'Enter the first address line'],
    ['addressLine2', 'Enter the second address line'],
    ['swift', 'Enter the SWIFT/BIC code'],
    ['bankCountry', 'Choose the bank’s country'],
    ['accountNumber', 'Enter the account number or IBAN'],
    ['routingCode', 'Enter the routing code'],
  ];
  for (const [field, message] of required) if (!form[field].trim()) errors[field] = message;

  const lines: Array<keyof BeneficiaryForm> = ['addressLine1', 'addressLine2', 'addressLine3'];
  for (const line of lines) if (form[line].length > 70) errors[line] = 'Maximum 70 characters';
  const seen = new Set<string>();
  for (const line of lines) {
    const value = form[line].trim().toLowerCase();
    if (!value) continue;
    if (seen.has(value)) errors[line] = 'Each address line must be unique';
    seen.add(value);
  }

  if (form.swift.trim() && !/^[A-Za-z0-9]{8}([A-Za-z0-9]{3})?$/.test(form.swift.trim())) {
    errors.swift = 'SWIFT/BIC codes are 8 or 11 letters and numbers';
  }
  if (form.monthlyLimit && !(Number(form.monthlyLimit.replace(/[^\d.]/g, '')) > 0)) errors.monthlyLimit = 'Enter an amount above 0';
  return errors;
}
