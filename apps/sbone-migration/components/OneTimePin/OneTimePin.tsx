'use client';

import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Collapse, cx } from '@sbone/shared';
import styles from './OneTimePin.module.scss';

const LENGTH = 5;
const RESEND_SECONDS = 30;

export interface OneTimePinProps {
  /** Where the PIN was sent, already masked (e.g. "******4280"). */
  maskedDestination: string;
  /** Page to open once a complete PIN is submitted (verification isn't connected yet). */
  nextHref?: string;
  onSubmit?: (pin: string) => void;
  onResend?: () => void;
  /** Page for the Back link above the card */
  backHref?: string;
}

/** Five-digit one-time PIN entry with a resend countdown. */
export function OneTimePin({ maskedDestination, nextHref, onSubmit, onResend, backHref }: OneTimePinProps) {
  const id = useId();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const focus = (index: number) => inputs.current[Math.max(0, Math.min(LENGTH - 1, index))]?.focus();

  // Typing a digit fills the box and moves on; typing into a full box replaces its digit
  const change = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => current.map((d, i) => (i === index ? digit : d)));
    if (digit) focus(index + 1);
  };

  const keyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index]) {
      event.preventDefault();
      setDigits((current) => current.map((d, i) => (i === index - 1 ? '' : d)));
      focus(index - 1);
    }
    if (event.key === 'ArrowLeft') focus(index - 1);
    if (event.key === 'ArrowRight') focus(index + 1);
  };

  // Pasting the whole PIN (e.g. from an SMS) fills every box
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;
    event.preventDefault();
    setDigits(Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? ''));
    focus(pasted.length);
  };

  const pin = digits.join('');
  const complete = pin.length === LENGTH;

  const resend = () => {
    setDigits(Array(LENGTH).fill(''));
    setSecondsLeft(RESEND_SECONDS);
    setResent(true);
    focus(0);
    onResend?.();
  };

  // "0:26"
  const countdown = `0:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <div className={styles.page}>
      {backHref && (
        <Link href={backHref} className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back
        </Link>
      )}

      <form
        className={styles.card}
        noValidate
        aria-labelledby={`${id}-title`}
        onSubmit={(event) => {
          event.preventDefault();
          if (!complete) return;
          onSubmit?.(pin);
          if (nextHref) router.push(nextHref);
        }}
      >
        <span className={styles.icon} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
            <path d="M10.5 18.5h3M9.5 10.5h5v3.5h-5zM10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5" />
          </svg>
        </span>
        <h1 id={`${id}-title`} className={styles.title}>
          Enter one-time PIN
        </h1>
        <p className={styles.sentTo} id={`${id}-sent`}>
          We sent a {LENGTH}-digit PIN to <span className={styles.destination}>{maskedDestination}</span>
        </p>

        <fieldset className={styles.boxes} aria-describedby={`${id}-sent`}>
          <legend className={styles.srOnly}>One-time PIN, {LENGTH} digits</legend>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              className={cx(styles.box, digit && styles.boxFilled)}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={2}
              aria-label={`Digit ${index + 1} of ${LENGTH}`}
              value={digit}
              onChange={(event) => change(index, event.target.value)}
              onKeyDown={(event) => keyDown(index, event)}
              onPaste={paste}
              onFocus={(event) => event.target.select()}
            />
          ))}
        </fieldset>

        <p className={styles.resend} aria-live="polite">
          {secondsLeft > 0 ? (
            <>
              {resent ? 'New PIN sent. ' : ''}You can resend the PIN in <span className={styles.timer}>{countdown}</span>
            </>
          ) : (
            <>
              Didn’t get a PIN?{' '}
              <button type="button" className={styles.link} onClick={resend}>
                Resend PIN
              </button>
            </>
          )}
        </p>

        <Button variant="secondary" type="submit" fullWidth disabled={!complete}>
          Submit
        </Button>

        <div className={styles.help}>
          <span>
            Having trouble?{' '}
            <button type="button" className={styles.link} aria-expanded={helpOpen} aria-controls={`${id}-help`} onClick={() => setHelpOpen((open) => !open)}>
              Get help
            </button>
          </span>
          <Collapse open={helpOpen}>
            <p id={`${id}-help`} className={styles.helpText}>
              The PIN can take up to a minute to arrive. Check that your phone has signal, then resend the PIN. If the
              number above isn’t yours, contact your business administrator or call 0860 123 000.
            </p>
          </Collapse>
        </div>
      </form>
    </div>
  );
}
