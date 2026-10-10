'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Modal.module.scss';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  /** md = confirmations (576px), lg = forms (944px). */
  size?: 'md' | 'lg';
  /** Scroll the body inside the dialog for content taller than the screen (header and footer stay put). */
  scrollable?: boolean;
}

/** Dialog with a navy title bar, white body and grey footer. Closes on Esc, the X button or a backdrop click. */
export function Modal({ open, title, onClose, children, footer, size = 'md', scrollable = false }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cx(styles.modal, styles[size], scrollable && styles.scrollable)}
      aria-labelledby={titleId}
      // Esc: let the parent decide (it closes via `open`), rather than the browser closing the dialog by itself.
      // Programmatic close() also fires 'close', so that event isn't used to report closing.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) closes the modal
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </dialog>
  );
}
