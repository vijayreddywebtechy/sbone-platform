import { USER } from '../Dashboard/dashboardData';

// Mock profile of the signed-in user until the profile API is available

export const PROFILE = {
  name: USER.name,
  role: 'Profile Administrator',
  email: 'kobus.marais@abcarchitects.co.za',
  mobile: '+27 82 123 4567',
  country: 'South Africa',
  countryCode: 'ZA',
  currency: 'ZAR',
  currencyName: 'South African Rand',
  kycVerified: true,
  // Fixed so server and browser render the same text; comes from the session once sign-in is connected
  lastSession: USER.lastSignedIn,
  accessLevel: 'Profile Administrator',
  notifications: { email: true, sms: false },
};
