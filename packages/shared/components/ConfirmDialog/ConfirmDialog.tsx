'use client';

import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Modal, type ModalProps } from '../Modal/Modal';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  size?: ModalProps['size'];
  cancelLabel?: string;
  onConfirm: () => void;
  /** Called for the cancel button, the X, Esc and a backdrop click. */
  onCancel: () => void;
}

/** Yes/no confirmation built on Modal: dismiss action on the left, confirm action on the right. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  size,
  cancelLabel = 'Back',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <Button variant="text" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="text" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
