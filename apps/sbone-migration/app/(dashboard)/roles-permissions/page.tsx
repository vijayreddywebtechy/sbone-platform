import type { Metadata } from 'next';
import { RolesPermissions } from '@/components/RolesPermissions/RolesPermissions';

export const metadata: Metadata = {
  title: 'Roles & Permissions | SBOne',
};

export default function RolesPermissionsPage() {
  return <RolesPermissions />;
}
