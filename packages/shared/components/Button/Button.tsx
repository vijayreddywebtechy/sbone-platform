import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * primary = navy, secondary = bright blue (main action, e.g. NEXT), outline = blue border,
   * secondaryOutline = bright blue border, text = plain bright-blue label (secondary action, e.g. CANCEL/BACK), gold = highlight, inverse = white button on brand-coloured backgrounds,
   * danger = red, for destructive actions (e.g. DECLINE REQUEST).
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'secondaryOutline' | 'text' | 'gold' | 'inverse' | 'danger';
  size?: 'sm' | 'md';
  /** soft = 8px corners (default, SBOne buttons), rounded = 4px corners, pill = fully rounded. */
  shape?: 'rounded' | 'soft' | 'pill';
  fullWidth?: boolean;
  loading?: boolean;
  endIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'soft',
  fullWidth = false,
  loading = false,
  endIcon,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    styles[shape],
    fullWidth && styles.fullWidth,
    className,
  );

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span>{children}</span>
      {endIcon && (
        <span className={styles.endIcon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}
