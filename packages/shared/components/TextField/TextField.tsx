'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './TextField.module.scss';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  /** outlined = boxed input, underline = bottom border only, floating = label on the top border. */
  variant?: 'outlined' | 'underline' | 'floating';
  /** Content rendered inside the field on the left, e.g. a currency symbol. */
  startAdornment?: ReactNode;
  /** Content rendered inside the field on the right, e.g. a SHOW/HIDE toggle. */
  endAdornment?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, variant = 'outlined', startAdornment, endAdornment, id, className, required, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={cx(styles.field, styles[variant], className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && variant === 'outlined' && <span className={styles.required}> *</span>}
      </label>
      <div className={cx(styles.control, error && styles.invalid, rest.disabled && styles.disabled)}>
        {startAdornment && <div className={styles.startAdornment}>{startAdornment}</div>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
          className={styles.input}
          {...rest}
        />
        {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
      </div>
      {message && (
        <p id={messageId} className={cx(styles.message, error && styles.errorMessage)} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
});
