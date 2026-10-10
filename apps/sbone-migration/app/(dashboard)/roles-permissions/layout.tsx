import type { ReactNode } from 'react';
import { TeamProvider } from '@/components/RolesPermissions/TeamContext';

// Shares the team between the Roles & Permissions list and the invite flow, so invited people appear in the list
export default function RolesPermissionsLayout({ children }: { children: ReactNode }) {
  return <TeamProvider>{children}</TeamProvider>;
}
