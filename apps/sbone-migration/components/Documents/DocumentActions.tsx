'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { Button, Modal, Toast } from '@sbone/shared';
import { EMAIL_ADDRESS, type DocumentItem } from './documentsData';
import { downloadPdf } from './pdf';
import styles from './DocumentActions.module.scss';

export type DocumentAction = 'view' | 'email' | 'download';

const Icon = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** Small document glyph for table rows; provisional statements get a tick */
export const StatementIcon = ({ provisional }: { provisional?: boolean }) => (
  <Icon size={16}>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    {provisional ? <path d="M9 8h6M9 11.5h3M12.5 16.5l1.5 1.5 3-3" /> : <path d="M9 8h6M9 11.5h6M9 15h4" />}
  </Icon>
);

/** View, email and download buttons for one document */
export function DocumentActions({ item, onAction }: { item: DocumentItem; onAction: (action: DocumentAction, item: DocumentItem) => void }) {
  return (
    <span className={styles.actions}>
      <button type="button" className={styles.action} aria-label={`View ${item.title}, ${item.period}`} onClick={() => onAction('view', item)}>
        <Icon>
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </Icon>
      </button>
      <button type="button" className={styles.action} aria-label={`Email ${item.title}, ${item.period}`} onClick={() => onAction('email', item)}>
        <Icon>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </Icon>
      </button>
      <button type="button" className={styles.action} aria-label={`Download ${item.title}, ${item.period}`} onClick={() => onAction('download', item)}>
        <Icon>
          <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15" />
        </Icon>
      </button>
    </span>
  );
}

/**
 * What the view, email and download buttons do: preview in a dialog, confirm the email, or save a PDF.
 * Render the returned `overlays` once on the page.
 */
export function useDocumentActions(accountLabel: string) {
  const [preview, setPreview] = useState<DocumentItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const onAction = (action: DocumentAction, item: DocumentItem) => {
    // Monthly statement titles already name their month
    const name = item.title.includes(item.period) ? item.title : `${item.title} (${item.period})`;
    if (action === 'view') setPreview(item);
    else if (action === 'email') setToast(`${name} was emailed to ${EMAIL_ADDRESS}`);
    else {
      downloadPdf(`${item.title} - ${item.period}`, [item.title, item.period, accountLabel, 'Standard Bank - SBOne']);
      setToast(`${name} downloaded`);
    }
  };

  const overlays = (
    <>
      <Modal
        open={preview !== null}
        title={preview?.title ?? 'Document'}
        onClose={() => setPreview(null)}
        footer={
          preview && (
            <>
              <Button variant="secondaryOutline" onClick={() => onAction('email', preview)}>
                Email
              </Button>
              <Button variant="secondary" onClick={() => onAction('download', preview)}>
                Download
              </Button>
            </>
          )
        }
      >
        {preview && (
          <dl className={styles.previewFacts}>
            <div>
              <dt>Account</dt>
              <dd>{accountLabel}</dd>
            </div>
            <div>
              <dt>Period</dt>
              <dd>{preview.period}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>PDF</dd>
            </div>
          </dl>
        )}
      </Modal>
      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </>
  );

  return { onAction, overlays };
}
