'use client';

import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Collapse.module.scss';

export interface CollapseProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Shows or hides content by smoothly animating its height and opacity, so the content below slides instead of
 * jumping. Closed content stays rendered (so it can animate out) but is inert: not focusable or read out.
 */
export function Collapse({ open, children, className }: CollapseProps) {
  return (
    <div className={cx(styles.collapse, open && styles.open, className)} inert={!open}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
