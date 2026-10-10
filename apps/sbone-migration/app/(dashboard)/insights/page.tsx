import type { Metadata } from 'next';
import { Insights } from '@/components/Insights/Insights';

export const metadata: Metadata = {
  title: 'Insights | SBOne',
};

export default function InsightsPage() {
  return <Insights />;
}
