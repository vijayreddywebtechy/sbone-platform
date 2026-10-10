import type { Metadata } from 'next';
import { Dashboard } from '@/components/Dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | SBOne',
};

export default function DashboardPage() {
  return <Dashboard />;
}
