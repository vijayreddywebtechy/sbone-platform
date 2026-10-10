// Mock application until the onboarding/applications API is available

export type SignatureStatus = 'signed' | 'pending';

export interface ApplicationDirector {
  name: string;
  role: string;
  status: SignatureStatus;
  /** Extra line under the role, e.g. what's holding a pending signature up */
  note?: string;
  /** The signed-in user */
  isYou?: boolean;
  /** When they signed */
  signedOn?: string;
}

export interface Application {
  applicant: { firstName: string; company: string };
  product: string;
  reference: string;
  submittedOn: string;
  status: string;
  directors: ApplicationDirector[];
}

export const APPLICATION: Application = {
  applicant: { firstName: 'John', company: 'ABC Consulting (Pty) Ltd' },
  product: 'MyMoBiz Account',
  reference: 'APP-2026-99084',
  submittedOn: '06 Oct 2026',
  status: 'Awaiting all director approval',
  directors: [
    { name: 'John Doe', role: 'Executive Director', status: 'signed', isYou: true, signedOn: '06 Oct 2026' },
    { name: 'Thandie Ndlovu', role: 'Chief Financial Officer', status: 'signed', signedOn: '07 Oct 2026' },
    { name: 'Riaan Botha', role: 'Managing Director', status: 'pending', note: 'Internal checks in progress' },
  ],
};
