import type { Metadata } from 'next';
import { ApplicationStatus } from '@/components/ApplicationStatus/ApplicationStatus';

export const metadata: Metadata = {
  title: 'Application status | SBOne',
};

export default function ApplicationPage() {
  return <ApplicationStatus />;
}
