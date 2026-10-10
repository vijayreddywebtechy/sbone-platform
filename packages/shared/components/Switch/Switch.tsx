'use client';

import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Switch.module.scss';

export interface SwitchProps {
  label: ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** On/off toggle with its label to the right (e.g. a permission). */
export function Switch({ label, checked, onChange, disabled = false, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cx(styles.switch, checked && styles.on, className)}
      onClick={() => onChange?.(!checked)}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
