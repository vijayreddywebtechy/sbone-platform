import { NextResponse, type NextRequest } from 'next/server';

// Where the customer lands once enrolment is done. Ping's registration flow must be configured to return here.
const AFTER_REGISTRATION_PATH = '/verify-identity';

/**
 * "Enroll to SBOne": sends the customer to Ping registration, which returns them to identity verification.
 * Without PING_REGISTRATION_URL (local development) Ping is skipped and the customer goes straight there.
 */
export function GET(request: NextRequest) {
  // Set NEXT_PUBLIC_PING_REGISTRATION_URL too, so the Enroll link knows to come through here
  const registrationUrl = process.env.PING_REGISTRATION_URL || process.env.NEXT_PUBLIC_PING_REGISTRATION_URL;
  return NextResponse.redirect(registrationUrl || new URL(AFTER_REGISTRATION_PATH, request.url));
}
