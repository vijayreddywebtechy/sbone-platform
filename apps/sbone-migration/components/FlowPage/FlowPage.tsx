import type { ReactNode } from 'react';
import { cx } from '@sbone/shared';
import styles from './FlowPage.module.scss';

export interface FlowPageProps {
  title: string;
  subtitle?: ReactNode;
  /** Buttons for the bar under the content, left to right */
  actions?: ReactNode;
  /** Centres a narrow column, e.g. for a one-time PIN */
  narrow?: boolean;
  children: ReactNode;
}

/** Frame for the application flow screens (use invite, approvals): title and subtitle, the content in panels, then the action bar. */
export function FlowPage({ title, subtitle, actions, narrow = false, children }: FlowPageProps) {
  return (
    <div className={cx(styles.page, narrow && styles.narrow)}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>
      {children}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
