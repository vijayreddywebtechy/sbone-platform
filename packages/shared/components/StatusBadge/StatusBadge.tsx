import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './StatusBadge.module.scss';

export interface StatusBadgeProps {
  /** success = green, info = blue, warning = amber, error = red, neutral = grey. */
  tone?: 'success' | 'info' | 'warning' | 'error' | 'neutral';
  /** Show the leading status dot. */
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

/** Small pill describing a status, e.g. "CIPC | In business" or "5 found". */
export function StatusBadge({ tone = 'neutral', dot = true, children, className }: StatusBadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
