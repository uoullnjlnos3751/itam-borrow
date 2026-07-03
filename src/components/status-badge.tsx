import { AssetStatus, RequestStatus } from '@/lib/database.types';

type StatusType = AssetStatus | RequestStatus;

const statusConfig: Record<string, { label: string; classes: string }> = {
  available: { label: 'ว่าง', classes: 'bg-tertiary-container text-tertiary' },
  borrowed: { label: 'กำลังยืม', classes: 'bg-tertiary-container text-tertiary' },
  reserved: { label: 'จองไว้', classes: 'bg-primary-container text-primary' },
  maintenance: { label: 'ซ่อมบำรุง', classes: 'bg-surface-container text-on-surface-variant' },
  damaged: { label: 'ชำรุด', classes: 'bg-error/15 text-error' },
  lost: { label: 'สูญหาย', classes: 'bg-error/10 text-error' },
  retired: { label: 'ปลดระวาง', classes: 'bg-surface-container text-on-surface-variant' },
  pending: { label: 'รออนุมัติ', classes: 'bg-secondary-container text-secondary' },
  approved: { label: 'อนุมัติแล้ว', classes: 'bg-primary-container text-primary' },
  rejected: { label: 'ปฏิเสธ', classes: 'bg-error/10 text-error' },
  returned: { label: 'คืนแล้ว', classes: 'bg-surface-container text-on-surface-variant' },
  overdue: { label: 'เกินกำหนด', classes: 'bg-error/10 text-error' },
  cancelled: { label: 'ยกเลิก', classes: 'bg-surface-container text-on-surface-variant' },
  // Asset-specific "borrowed" label for borrow list
  'asset-borrowed': { label: 'ถูกยืมแล้ว', classes: 'bg-error/10 text-error' },
};

interface StatusBadgeProps {
  status: StatusType;
  variant?: 'request' | 'asset';
}

export function StatusBadge({ status, variant = 'request' }: StatusBadgeProps) {
  // For asset status 'borrowed', use different label
  const key = variant === 'asset' && status === 'borrowed' ? 'asset-borrowed' : status;
  const config = statusConfig[key] || statusConfig[status] || { label: status, classes: 'bg-surface-container text-on-surface-variant' };

  return (
    <span
      className={`shrink-0 px-2 py-0.5 rounded-full text-label-md font-label-md whitespace-nowrap ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
