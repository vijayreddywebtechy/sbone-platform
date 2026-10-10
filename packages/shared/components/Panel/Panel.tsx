'use client';

import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Panel.module.scss';

export interface PanelProps {
  title: string;
  icon?: ReactNode;
  /** Controls shown in the header row, e.g. a view toggle. */
  actions?: ReactNode;
  /** Adds a chevron that collapses the body. */
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
}

/** White dashboard card with a title row; optionally collapsible. */
export function Panel({ title, icon, actions, collapsible = false, children, className }: PanelProps) {
  const [open, setOpen] = useState(true);
  const id = useId();
  const titleId = `${id}-title`;
  const bodyId = `${id}-body`;

  return (
    <section className={cx(styles.panel, className)} aria-labelledby={titleId}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {icon && (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          )}
          {title}
        </h2>
        <div className={styles.actions}>
          {open && actions}
          {collapsible && (
            <button
              type="button"
              className={cx(styles.toggle, open && styles.toggleOpen)}
              aria-expanded={open}
              aria-controls={bodyId}
              aria-label={`${open ? 'Collapse' : 'Expand'} ${title}`}
              onClick={() => setOpen((value) => !value)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div id={bodyId} className={styles.body} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
