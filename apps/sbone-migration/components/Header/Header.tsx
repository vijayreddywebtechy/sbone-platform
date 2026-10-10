'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { Logo, cx } from '@sbone/shared';
import { SignInPanel } from '../SignInPanel/SignInPanel';
import styles from './Header.module.scss';

const SEGMENTS = [
  { label: 'SBOne', href: '#', active: true },
  { label: 'Personal', href: '#' },
  { label: 'Corporate', href: '#' },
];

const NAV_LINKS = [
  { label: 'Foundational Features', href: '#features' },
  { label: 'Get Started', href: '#get-started' },
  { label: 'App Download', href: '#app-download' },
  { label: 'Success Stories', href: '#success-stories' },
  { label: 'Help & Support', href: '#support' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const signInRef = useRef<HTMLButtonElement>(null);

  // Return focus to SIGN IN when the panel closes, so keyboard users keep their place
  const closeSignIn = useCallback(() => {
    setSignInOpen(false);
    signInRef.current?.focus();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.utilityBar}>
        <div className={styles.utilityInner}>
          <nav aria-label="Segments">
            <ul className={styles.segments}>
              {SEGMENTS.map((segment) => (
                <li key={segment.label}>
                  <a
                    href={segment.href}
                    className={cx(styles.segment, segment.active && styles.segmentActive)}
                    aria-current={segment.active ? 'page' : undefined}
                  >
                    {segment.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span className={styles.country}>
            <Image src="/images/flags/za.svg" alt="" width={16} height={16} className={styles.flag} />
            South Africa
            <svg width="10" height="10" viewBox="0 0 24 24" className={styles.caret} aria-hidden="true">
              <path d="M3 7h18l-9 11Z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <div className={styles.nav}>
        <div className={styles.navInner}>
          <a href="#top" className={styles.brand}>
            <Logo size={32} />
          </a>

          <nav id="main-nav" aria-label="Main" className={cx(styles.menu, menuOpen && styles.menuOpen)}>
            <ul className={styles.links}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.link} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <button type="button" className={styles.iconButton} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              ref={signInRef}
              type="button"
              className={cx(styles.signIn, signInOpen && styles.signInActive)}
              aria-expanded={signInOpen}
              aria-controls="sign-in-panel"
              aria-label="Sign in"
              onClick={() => {
                setMenuOpen(false);
                if (signInOpen) closeSignIn();
                else setSignInOpen(true);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <span className={styles.signInLabel} aria-hidden="true">
                Sign in
              </span>
            </button>
            <button
              type="button"
              className={cx(styles.iconButton, styles.menuToggle)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              onClick={() => {
                setSignInOpen(false);
                setMenuOpen((open) => !open);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d={menuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <SignInPanel id="sign-in-panel" open={signInOpen} onClose={closeSignIn} />
    </header>
  );
}
