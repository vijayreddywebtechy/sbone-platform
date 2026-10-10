import { NextResponse, type NextRequest } from 'next/server';

/**
 * Multi-zone routing: /beneficiaries/* is served by the separately deployed Beneficiary Management micro frontend.
 * Its address comes from BENEFICIARY_APP_URL at runtime (not baked in at build), so the same image works in every
 * environment. The beneficiary app uses basePath "/beneficiaries", so paths are forwarded unchanged, including its
 * /beneficiaries/_next assets.
 */
export function proxy(request: NextRequest) {
  const zoneUrl = process.env.BENEFICIARY_APP_URL;
  if (!zoneUrl) {
    return new NextResponse('Beneficiary Management is not configured (BENEFICIARY_APP_URL).', { status: 503 });
  }
  const { pathname, search } = request.nextUrl;
  return NextResponse.rewrite(new URL(`${pathname}${search}`, zoneUrl));
}

export const config = {
  matcher: ['/beneficiaries', '/beneficiaries/:path*'],
};
