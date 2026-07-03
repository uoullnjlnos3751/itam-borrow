'use client';

import { ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-surface-container-lowest w-full max-w-2xl rounded-t-2xl p-margin-mobile animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-title-lg font-title-lg text-on-surface mb-stack-xs">
          {title}
        </h3>
        {description && (
          <p className="text-body-sm text-on-surface-variant mb-stack-lg">
            {description}
          </p>
        )}
        {children && <div className="mb-stack-lg">{children}</div>}
        <div className="flex gap-stack-sm">
          <button
            onClick={onCancel}
            className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl text-body-md transition-colors hover:bg-surface-container-high"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-body-md transition-colors ${
              confirmVariant === 'danger'
                ? 'bg-error text-white hover:bg-error/90'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
