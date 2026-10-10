'use client';

import { useId, useState, type ReactNode } from 'react';
import { Collapse, cx } from '@sbone/shared';
import styles from './Block.module.scss';

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={cx(styles.chevron, !open && styles.chevronClosed)}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="m6 15 6-6 6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Collapsible block: header with title, a summary on the right and a chevron; content animates open/closed. */
export function Block({
  title,
  summary,
  variant = 'card',
  children,
}: {
  title: string;
  summary: ReactNode;
  variant?: 'card' | 'group';
  /** Without content the block is just a header (e.g. a section that doesn't apply). */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();
  const headerClass = variant === 'card' ? styles.cardHeader : styles.groupHeader;

  if (!children) {
    return (
      <section className={cx(variant === 'card' ? styles.card : styles.group, styles.headerOnly)}>
        <h3 className={styles.blockHeading}>
          <span className={cx(headerClass, styles.staticHeader)}>
            <span className={styles.blockTitle}>{title}</span>
            <span className={styles.summary}>{summary}</span>
          </span>
        </h3>
      </section>
    );
  }

  return (
    <section className={variant === 'card' ? styles.card : styles.group}>
      <h3 className={styles.blockHeading}>
        <button
          type="button"
          className={headerClass}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.blockTitle}>{title}</span>
          <span className={styles.summary}>{summary}</span>
          <Chevron open={open} />
        </button>
      </h3>
      <div id={bodyId}>
        <Collapse open={open}>{children}</Collapse>
      </div>
    </section>
  );
}
