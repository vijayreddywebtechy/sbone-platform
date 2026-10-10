'use client';

import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Accordion.module.scss';

export interface AccordionSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

/** One collapsible section: a full-width heading button with a chevron, and its panel. */
export function AccordionSection({ title, open, onToggle, children, className }: AccordionSectionProps) {
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <section className={cx(styles.section, open && styles.open, className)}>
      <h2 className={styles.heading}>
        <button
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{title}</span>
          <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
