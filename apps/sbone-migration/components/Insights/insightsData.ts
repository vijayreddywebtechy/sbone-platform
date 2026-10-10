// Mock transactions for Insights until the transactions API is available.
// Generated from the account and month so each combination has its own, stable history.

export interface InsightTransaction {
  id: string;
  /** Day of the month, 1–31. */
  day: number;
  description: string;
  /** Who was paid, for money out (groups the Top Payees). */
  payee?: string;
  /** Positive = money in, negative = money out. */
  amount: number;
}

export interface MonthRef {
  year: number;
  /** 0 = January */
  month: number;
}

/** Latest month with complete data; the calendar can't go past it. */
export const LATEST_MONTH: MonthRef = { year: 2026, month: 8 };
/** How far back the calendar goes. */
export const MONTHS_OF_HISTORY = 12;

const IN_DESCRIPTIONS = [
  'IB PAYMENT FROM Jlia',
  'IB TRANSFER FROM crdIAT00120260908090131012',
  'IB TRANSFER FROM crdIAT03620260908090335677',
  'CREDIT TRANSFER TIPIT PAYMENT 20260908-140000',
  'IB PAYMENT FROM Growth',
  'PAYSHAP PAYMENT FROM test',
  'IB FUTURE-DATED PAYMENT FROM S&R FROM 10006351547',
];

const PAYEES = ['IB TRANSFER TO dbtIAT002202609', 'IB TRANSFER TO dbtIAT005202609', 'IB FUTURE-DATED PAYMENT TO S&R', 'DEBIT ORDER TELKOM'];

// Small deterministic pseudo-random generator (mulberry32)
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const daysInMonth = ({ year, month }: MonthRef) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

/** 0 = Monday … 6 = Sunday */
export const weekdayOf = ({ year, month }: MonthRef, day: number) => (new Date(Date.UTC(year, month, day)).getUTCDay() + 6) % 7;

export function transactionsFor(accountId: string, ref: MonthRef): InsightTransaction[] {
  const next = random(Number(accountId) * 7919 + ref.year * 12 + ref.month);
  const days = daysInMonth(ref);
  const count = 30 + Math.floor(next() * 30);
  const list: InsightTransaction[] = [];

  for (let i = 0; i < count; i++) {
    // Weekdays are busier than weekends
    let day = 1 + Math.floor(next() * days);
    if (weekdayOf(ref, day) >= 5 && next() < 0.8) day = Math.max(1, day - 2);
    const isIn = next() < 0.6;
    const cents = Math.round((isIn ? 1 + next() * 300 : 5 + next() * 500) * 100) / 100;
    if (isIn) {
      list.push({ id: `${accountId}-${i}`, day, description: IN_DESCRIPTIONS[Math.floor(next() * IN_DESCRIPTIONS.length)], amount: cents });
    } else {
      // Skewed so one payee dominates, as top-payee lists usually do
      const payee = PAYEES[Math.min(PAYEES.length - 1, Math.floor(next() ** 2 * PAYEES.length))];
      const reference = `${ref.year}${String(ref.month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}090${Math.floor(100000 + next() * 900000)}`;
      list.push({ id: `${accountId}-${i}`, day, description: `${payee}${reference.slice(6)}`, payee, amount: -cents });
    }
  }

  return list.sort((a, b) => a.day - b.day);
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const monthLabel = ({ year, month }: MonthRef) => `${MONTH_NAMES[month]} ${year}`;
/** "04 Sept" */
export const shortDay = (ref: MonthRef, day: number) => `${String(day).padStart(2, '0')} ${SHORT_MONTHS[ref.month]}`;
/** "Friday, 04 Sept" */
export const longDay = (ref: MonthRef, day: number) => `${WEEKDAYS[weekdayOf(ref, day)]}, ${shortDay(ref, day)}`;

export const addMonths = ({ year, month }: MonthRef, delta: number): MonthRef => {
  const index = year * 12 + month + delta;
  return { year: Math.floor(index / 12), month: index % 12 };
};

export const monthIndex = ({ year, month }: MonthRef) => year * 12 + month;
