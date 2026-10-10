import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './ActionCard.module.scss';

export interface ActionCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: string;
  description?: string;
  icon?: ReactNode;
}

/** Full-width clickable card with an icon, title, description and chevron — used for choosing a path. */
export function ActionCard({ title, description, icon, className, type = 'button', ...rest }: ActionCardProps) {
  return (
    <button type={type} className={cx(styles.card, className)} {...rest}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      <svg className={styles.chevron} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
