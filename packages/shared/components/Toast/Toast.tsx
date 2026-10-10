'use client';

import { useEffect } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Toast.module.scss';

export interface ToastProps {
  message: string;
  onDismiss: () => void;
  variant?: 'success' | 'error';
  /** Hides itself after this many ms; 0 keeps it until dismissed. */
  autoHideMs?: number;
  className?: string;
}

/** Short confirmation pinned to the top-right of the page, below the app header. */
export function Toast({ message, onDismiss, variant = 'success', autoHideMs = 5000, className }: ToastProps) {
  useEffect(() => {
    if (!autoHideMs) return;
    const timer = window.setTimeout(onDismiss, autoHideMs);
    return () => window.clearTimeout(timer);
  }, [autoHideMs, onDismiss, message]);

  return (
    <div className={cx(styles.toast, styles[variant], className)} role="status" aria-live="polite">
      <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m8 12.5 2.6 2.6L16 9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.dismiss} onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
