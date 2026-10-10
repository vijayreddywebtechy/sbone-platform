'use client';

import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Alert.module.scss';

export interface AlertProps {
  /** neutral = grey note with a dark rule, for non-disruptive information. */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  title?: string;
  /** Optional leading icon, e.g. an info glyph. */
  icon?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ variant = 'info', title, icon, children, onDismiss, className }: AlertProps) {
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={cx(styles.alert, styles[variant], className)}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
