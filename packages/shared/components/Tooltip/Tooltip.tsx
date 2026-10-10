'use client';

import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  /** Text shown in the bubble. */
  content: ReactNode;
  /** Accessible name for the trigger, e.g. "More information about related persons". */
  label: string;
  className?: string;
}

/** Blue (i) button that shows a dark bubble on hover or keyboard focus (Esc hides it). */
export function Tooltip({ content, label, className }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={cx(styles.wrapper, className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label={label}
        aria-describedby={visible ? id : undefined}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((shown) => !shown)}
        onKeyDown={(event) => event.key === 'Escape' && setVisible(false)}
      >
        i
      </button>
      {visible && (
        <span id={id} role="tooltip" className={styles.bubble}>
          {content}
        </span>
      )}
    </span>
  );
}
