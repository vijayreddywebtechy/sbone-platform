import type { Metadata } from 'next';
import { OneTimePin } from '@/components/OneTimePin/OneTimePin';

export const metadata: Metadata = {
  title: 'Enter one-time PIN | SBOne',
};

// Sending and checking the PIN isn't connected yet; the destination is a placeholder
export default function UseInviteOtpPage() {
  return <OneTimePin maskedDestination="******4280" nextHref="/use-invite/approval" backHref="/use-invite" />;
}
