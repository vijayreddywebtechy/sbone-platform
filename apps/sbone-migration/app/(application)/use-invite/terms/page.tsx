import type { Metadata } from 'next';
import { TermsConsent } from '@/components/TermsConsent/TermsConsent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | SBOne',
};

export default function TermsPage() {
  return <TermsConsent />;
}
