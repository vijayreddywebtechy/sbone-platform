'use client';

import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './RadioGroup.module.scss';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: ReactNode;
  /** Supporting text under the question. */
  description?: string;
  name: string;
  options: RadioOption[];
  /** card = bordered option tiles, plain = bare radio buttons (yes/no questions). */
  appearance?: 'card' | 'plain';
  value?: string;
  onChange?: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  required?: boolean;
  error?: string;
  className?: string;
}

export function RadioGroup({
  label,
  description,
  name,
  options,
  value,
  onChange,
  appearance = 'card',
  direction = 'vertical',
  required,
  error,
  className,
}: RadioGroupProps) {
  const messageId = `${useId()}-message`;

  return (
    <fieldset
      className={cx(styles.group, styles[appearance], className)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? messageId : undefined}
    >
      <legend className={styles.legend}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </legend>
      {description && <p className={styles.groupDescription}>{description}</p>}
      <div className={cx(styles.options, styles[direction])}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cx(styles.option, value === option.value && styles.selected, option.disabled && styles.disabled)}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              // Controlled whenever the parent handles changes, so an unanswered question shows nothing selected
              checked={onChange ? value === option.value : undefined}
              disabled={option.disabled}
              required={required}
              onChange={() => onChange?.(option.value)}
              className={styles.input}
            />
            <span>
              <span className={styles.optionLabel}>{option.label}</span>
              {option.description && <span className={styles.description}>{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={messageId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
