import type { Metadata } from 'next';
import { VerifyIdentity } from '@/components/VerifyIdentity/VerifyIdentity';

export const metadata: Metadata = {
  title: 'Verify your identity | SBOne',
};

export default function VerifyIdentityPage() {
  return <VerifyIdentity />;
}
