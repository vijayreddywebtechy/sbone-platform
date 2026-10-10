import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Card.module.scss';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}

export function Card({ title, description, footer, className, children, ...rest }: CardProps) {
  return (
    <section className={cx(styles.card, className)} {...rest}>
      {(title || description) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </header>
      )}
      {children}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
