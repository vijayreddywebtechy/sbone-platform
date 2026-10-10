'use client';

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/classNames';
import styles from './TextArea.module.scss';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

/** Multi-line text with a bold label above, matching the application forms. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, id, className, rows = 3, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        className={cx(styles.input, error && styles.invalid)}
        {...rest}
      />
      {message && (
        <p id={messageId} className={cx(styles.message, error && styles.error)}>
          {message}
        </p>
      )}
    </div>
  );
});
