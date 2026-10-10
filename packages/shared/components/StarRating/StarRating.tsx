'use client';

import { useId } from 'react';
import { cx } from '../../utils/classNames';
import styles from './StarRating.module.scss';

export interface StarRatingProps {
  /** Accessible name of the group, e.g. the question being rated. */
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
}

/** 1–N stars as a radio group: arrow keys move between stars, filled up to the chosen value. */
export function StarRating({ label, value, onChange, max = 5, className }: StarRatingProps) {
  const name = useId();

  return (
    <div role="radiogroup" aria-label={label} className={cx(styles.rating, className)}>
      {Array.from({ length: max }, (_, index) => {
        const star = index + 1;
        const filled = star <= value;
        return (
          <label key={star} className={styles.star}>
            <input
              type="radio"
              name={name}
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className={styles.input}
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
            />
            <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" className={cx(styles.icon, filled && styles.filled)}>
              <path
                d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </label>
        );
      })}
    </div>
  );
}
