import type { Metadata } from 'next';
import { MyProfile } from '@/components/MyProfile/MyProfile';

export const metadata: Metadata = {
  title: 'My Profile | SBOne',
};

export default function MyProfilePage() {
  return <MyProfile />;
}
