'use client';

import { forwardRef, useState } from 'react';
import { TextField, type TextFieldProps } from '../TextField/TextField';
import styles from './PasswordField.module.scss';

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'>;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      ref={ref}
      type={visible ? 'text' : 'password'}
      autoComplete="new-password"
      {...props}
      endAdornment={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${props.label}` : `Show ${props.label}`}
          aria-pressed={visible}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
});
