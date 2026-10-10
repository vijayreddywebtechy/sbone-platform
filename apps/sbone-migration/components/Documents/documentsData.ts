// Mock documents and statements until the documents API is available.

export type DocumentGroup = 'letters' | 'stamped' | 'unstamped';

export interface DocumentItem {
  id: string;
  title: string;
  /** "9 Nov 2025 - 7 Feb 2026" for letters and stamped statements; "August 2025" for monthly statements */
  period: string;
  /** Monthly statements: provisional statements still to be finalised show a different icon */
  provisional?: boolean;
}

export const GROUP_LABELS: Record<DocumentGroup, string> = {
  letters: 'Letters & Documents',
  stamped: 'Stamped Statements',
  unstamped: 'Unstamped Statements',
};

/** Where emailed documents go: the signed-in user's address */
export const EMAIL_ADDRESS = 'kobus.marais@standardbank.co.za';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Latest month with a monthly statement */
const LATEST = { year: 2025, month: 7 }; // August 2025
const STATEMENT_MONTHS = 24;

export function documentsFor(accountId: string): Record<DocumentGroup, DocumentItem[]> {
  const letters: DocumentItem[] = [
    { id: `${accountId}-l1`, title: 'Bank Confirmation Letter', period: '9 Nov 2025 - 7 Feb 2026' },
    { id: `${accountId}-l2`, title: 'Proof of Account Letter', period: '9 Nov 2025 - 7 Feb 2026' },
  ];
  const stamped: DocumentItem[] = [
    { id: `${accountId}-s1`, title: 'Stamped Statement for last 3 months', period: '9 Nov 2025 - 7 Feb 2026' },
    { id: `${accountId}-s2`, title: 'Stamped Statement for last 6 months', period: '9 Aug 2025 - 7 Feb 2026' },
  ];
  const unstamped: DocumentItem[] = Array.from({ length: STATEMENT_MONTHS }, (_, i) => {
    const index = LATEST.year * 12 + LATEST.month - i;
    const label = `${MONTHS[index % 12]} ${Math.floor(index / 12)}`;
    // Mock: every third month is a provisional statement
    return { id: `${accountId}-u${i}`, title: `Statement for the month of ${label}`, period: label, provisional: i % 3 === 2 };
  });
  return { letters, stamped, unstamped };
}
