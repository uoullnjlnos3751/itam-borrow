'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

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
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl border border-slate-200 animate-slide-up sm:animate-fade-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 mb-2">
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            {description}
          </p>
        )}
        
        {/* Custom Content Children */}
        {children && <div className="mb-5">{children}</div>}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] cursor-pointer shadow-sm ${
              confirmVariant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/10'
                : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/10'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
