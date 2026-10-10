'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '@sbone/shared';
import styles from './SignInPanel.module.scss';

interface PanelLink {
  label: string;
  href: string;
}

// Destinations are placeholders until the sign-in and platform URLs are confirmed.
// Enroll goes through Ping registration (app/enroll/route.ts) and on to identity verification.
const SBONE_ACTIONS: PanelLink[] = [
  { label: 'Sign in to SBOne', href: '/dashboard' },
  // Straight to identity verification unless Ping registration is configured (then via the /enroll redirect)
  { label: 'Enroll to SBOne', href: process.env.NEXT_PUBLIC_PING_REGISTRATION_URL ? '/enroll' : '/verify-identity' },
  { label: 'Use invite', href: '/use-invite' },
];

const BUSINESS_ACTIONS: PanelLink[] = [
  { label: 'Internet Banking', href: '#internet-banking' },
  { label: 'Online Banking for Business', href: '#online-banking-for-business' },
  { label: 'Business Online', href: '#business-online' },
];

const BUSINESS_LINKS: PanelLink[] = [
  { label: 'API Market Place', href: '#api-market-place' },
  { label: 'Foreign Exchange Rates', href: '#foreign-exchange-rates' },
  { label: 'Market Data', href: '#market-data' },
  { label: 'Merchant Online', href: '#merchant-online' },
  { label: 'TradeOnline', href: '#tradeonline' },
  { label: 'TradeSuite', href: '#tradesuite' },
  { label: 'Fleet 360', href: '#fleet-360' },
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const contentId = useId();

  return (
    <section className={styles.group}>
      <h2 className={styles.groupHeading}>
        <button
          type="button"
          className={styles.groupToggle}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <svg className={cx(styles.caret, !open && styles.caretClosed)} width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 17h18L12 6Z" fill="currentColor" />
          </svg>
        </button>
      </h2>
      <div id={contentId} className={styles.groupBody} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

const ActionList = ({ items }: { items: PanelLink[] }) => (
  <ul className={styles.actions}>
    {items.map((item) => (
      <li key={item.label}>
        {/* In-app pages swap in without reloading; the /enroll redirect to Ping needs a full navigation */}
        {item.href.startsWith('/') && item.href !== '/enroll' ? (
          <Link href={item.href} className={styles.action}>
            {item.label}
          </Link>
        ) : (
          <a href={item.href} className={styles.action}>
            {item.label}
          </a>
        )}
      </li>
    ))}
  </ul>
);

export interface SignInPanelProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

/** Sign-in options sliding in from the right, below the site header. */
export function SignInPanel({ id, open, onClose }: SignInPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // While open: focus moves into the panel, Escape closes it, and the page behind stops scrolling
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return (
    <>
      {/* Both stay rendered so they can fade/slide out; CSS visibility hides them when closed */}
      <div className={cx(styles.backdrop, open && styles.backdropVisible)} onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        ref={panelRef}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(styles.panel, open && styles.open)}
      >
        <h2 id={titleId} className={styles.srOnly}>
          Sign in options
        </h2>
        <button type="button" className={styles.close} aria-label="Close sign in options" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <Group title="SBOne">
          <ActionList items={SBONE_ACTIONS} />
        </Group>

        <Group title="Business">
          <ActionList items={BUSINESS_ACTIONS} />
          <ul className={styles.links}>
            {BUSINESS_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Group>
      </div>
    </>
  );
}
