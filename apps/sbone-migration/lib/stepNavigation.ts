'use client';

import { usePathname, useRouter } from 'next/navigation';

// Lets a step's BACK use browser history when the user arrived through the flow in this tab, and open the previous
// step's page otherwise (bookmark, pasted link, another site), so BACK never leaves the app.

const key = (path: string) => `sbone:came-through-flow:${path}`;

/** Call just before navigating forward to `nextPath`. */
export function rememberFlowStep(nextPath: string) {
  try {
    sessionStorage.setItem(key(nextPath), '1');
  } catch {
    // Storage blocked: BACK on the next step falls back to its explicit route
  }
}

/** Returns a BACK handler for the current page; `fallbackHref` is the previous step's route. */
export function useStepBack(fallbackHref: string) {
  const router = useRouter();
  const pathname = usePathname();

  return () => {
    let cameThroughFlow = false;
    try {
      cameThroughFlow = sessionStorage.getItem(key(pathname)) === '1';
    } catch {
      // Storage blocked: use the explicit route
    }
    if (cameThroughFlow) router.back();
    else router.push(fallbackHref);
  };
}
