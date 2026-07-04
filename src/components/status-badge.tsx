import { AssetStatus, RequestStatus } from '@/lib/database.types';

type StatusType = AssetStatus | RequestStatus;

const statusConfig: Record<string, { label: string; classes: string }> = {
  available: { label: 'ว่าง', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  borrowed: { label: 'กำลังยืม', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  reserved: { label: 'จองไว้', classes: 'bg-sky-50 text-sky-700 border-sky-200' },
  maintenance: { label: 'ซ่อมบำรุง', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  damaged: { label: 'ชำรุด', classes: 'bg-red-50 text-red-700 border-red-200' },
  lost: { label: 'สูญหาย', classes: 'bg-slate-100 text-slate-700 border-slate-300' },
  retired: { label: 'ปลดระวาง', classes: 'bg-slate-100 text-slate-500 border-slate-200' },
  pending: { label: 'รออนุมัติ', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'อนุมัติแล้ว', classes: 'bg-sky-50 text-sky-700 border-sky-200' },
  rejected: { label: 'ปฏิเสธ', classes: 'bg-red-50 text-red-700 border-red-200' },
  returned: { label: 'คืนแล้ว', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue: { label: 'เกินกำหนด', classes: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'ยกเลิก', classes: 'bg-slate-100 text-slate-500 border-slate-200' },
  'asset-borrowed': { label: 'ถูกยืมแล้ว', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
};

interface StatusBadgeProps {
  status: StatusType;
  variant?: 'request' | 'asset';
}

export function StatusBadge({ status, variant = 'request' }: StatusBadgeProps) {
  const key = variant === 'asset' && status === 'borrowed' ? 'asset-borrowed' : status;
  const config = statusConfig[key] || statusConfig[status] || { 
    label: status, 
    classes: 'bg-slate-100 text-slate-600 border-slate-200' 
  };

  return (
    <span
      className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
