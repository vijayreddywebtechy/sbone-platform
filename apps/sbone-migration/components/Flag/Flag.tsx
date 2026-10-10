import type { ReactNode } from 'react';
import { cx } from '@sbone/shared';
import styles from './Flag.module.scss';

export type FlagCode = 'ZA' | 'US' | 'EU' | 'GB' | 'JP' | 'CN';

/** Currency code → flag, for currency pickers and FX pairs. */
export const CURRENCY_FLAGS: Record<string, FlagCode> = {
  ZAR: 'ZA',
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  JPY: 'JP',
  CNY: 'CN',
};

// Simplified 24×24 artwork, clipped to a circle by the wrapper
const ART: Record<FlagCode, ReactNode> = {
  ZA: (
    <>
      <rect width="24" height="12" fill="#E03C31" />
      <rect y="12" width="24" height="12" fill="#001489" />
      <path d="M0 0 12 12 0 24Z" fill="#000" />
      <path d="M-2 -3 13.5 9.5H26v5H13.5L-2 27" fill="none" stroke="#fff" strokeWidth="6" />
      <path d="M-2 -3 13.5 9.5H26v5H13.5L-2 27" fill="none" stroke="#007749" strokeWidth="3.6" />
      <path d="M0 4.5 9 12 0 19.5Z" fill="#FFB81C" />
      <path d="M0 7 6 12 0 17Z" fill="#000" />
    </>
  ),
  US: (
    <>
      <rect width="24" height="24" fill="#fff" />
      {[0, 2, 4, 6, 8, 10].map((row) => (
        <rect key={row} y={row * 3.7} width="24" height="1.85" fill="#B22234" />
      ))}
      <rect width="12" height="11" fill="#3C3B6E" />
      {[2.5, 6, 9.5].map((x) => [2.5, 5.5, 8.5].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#fff" />))}
    </>
  ),
  EU: (
    <>
      <rect width="24" height="24" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={12 + Math.cos(angle) * 6.5} cy={12 + Math.sin(angle) * 6.5} r="0.9" fill="#FFCC00" />;
      })}
    </>
  ),
  GB: (
    <>
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="5" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="1.8" />
      <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="7" />
      <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4" />
    </>
  ),
  JP: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <circle cx="12" cy="12" r="5.5" fill="#BC002D" />
    </>
  ),
  CN: (
    <>
      <rect width="24" height="24" fill="#DE2910" />
      <path d="m7 4 1.2 3.5H12l-3 2.2 1.1 3.5L7 11l-3.1 2.2L5 9.7 2 7.5h3.8Z" fill="#FFDE00" />
    </>
  ),
};

export interface FlagProps {
  code: FlagCode;
  size?: number;
  className?: string;
}

/** Round flag; decorative, so pair it with the currency or country name in text. */
export function Flag({ code, size = 24, className }: FlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cx(styles.flag, className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`flag-${code}`}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-${code})`}>{ART[code]}</g>
    </svg>
  );
}
