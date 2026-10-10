import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/classNames';
import styles from './SelectableCard.module.scss';

export interface SelectableCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role'> {
  selected: boolean;
  /** center = stacked and centred (business tiles), start = left aligned (option lists). */
  align?: 'center' | 'start';
}

/**
 * One option in a single-choice group of cards: tinted background, blue border and a tick when selected.
 * Render inside an element with role="radiogroup".
 */
export function SelectableCard({ selected, align = 'center', className, children, type = 'button', ...rest }: SelectableCardProps) {
  return (
    <button
      type={type}
      role="radio"
      aria-checked={selected}
      className={cx(styles.card, styles[align], selected && styles.selected, className)}
      {...rest}
    >
      {selected && (
        <span className={styles.check} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}
