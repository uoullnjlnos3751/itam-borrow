'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockDashboardSummary, mockPendingRequests, mockOverdueRequests } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [rejectModal, setRejectModal] = useState<BorrowRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleApprove = (request: BorrowRequest) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
    // In real app: update borrow_requests status to 'approved' then 'borrowed'
  };

  const handleReject = () => {
    if (!rejectModal) return;
    setPendingRequests((prev) => prev.filter((r) => r.id !== rejectModal.id));
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div className="pb-24">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
        <h1 className="font-headline-md text-title-lg font-bold text-primary">
          แดชบอร์ดแอดมิน IT
        </h1>
        <MaterialIcon icon="account_circle" className="text-on-surface-variant" />
      </header>

      <main className="pt-20 px-margin-mobile max-w-2xl mx-auto space-y-stack-lg">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-stack-sm">
          <div className="rounded-xl bg-secondary-container p-stack-md">
            <p className="text-headline-md text-secondary font-bold">{mockDashboardSummary.pending_count}</p>
            <p className="text-body-sm text-on-surface-variant mt-0.5">รออนุมัติ</p>
          </div>
          <div className="rounded-xl bg-primary-container p-stack-md">
            <p className="text-headline-md text-primary font-bold">{mockDashboardSummary.active_borrow_count}</p>
            <p className="text-body-sm text-on-surface-variant mt-0.5">กำลังยืม</p>
          </div>
          <div className="rounded-xl bg-error/10 p-stack-md">
            <p className="text-headline-md text-error font-bold">{mockDashboardSummary.overdue_count}</p>
            <p className="text-body-sm text-on-surface-variant mt-0.5">เกินกำหนด</p>
          </div>
        </div>

        {/* Pending Requests */}
        <section>
          <h2 className="text-title-lg font-title-lg text-on-surface mb-stack-md">คำขอรออนุมัติ</h2>
          <div className="space-y-stack-sm">
            {pendingRequests.length === 0 && (
              <div className="text-center py-8 text-on-surface-variant">
                <MaterialIcon icon="check_circle" size={40} className="mb-stack-sm opacity-50" />
                <p>ไม่มีคำขอรออนุมัติ</p>
              </div>
            )}
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface">{req.assets?.name}</h3>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                      ผู้ขอ: {req.users?.display_name} &middot; {req.users?.department}
                    </p>
                  </div>
                  <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                    {formatDate(req.created_at)}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant mt-stack-sm bg-surface-container-low rounded-lg p-stack-sm">
                  &ldquo;{req.reason}&rdquo; &middot; คืนภายใน {formatDate(req.requested_due_date)}
                </p>
                <div className="flex gap-stack-sm mt-stack-md">
                  <button
                    onClick={() => { setRejectModal(req); setRejectReason(''); }}
                    className="flex-1 bg-error/10 text-error text-label-md font-label-md py-2.5 rounded-full flex items-center justify-center gap-1"
                  >
                    <MaterialIcon icon="close" size={16} /> ปฏิเสธ
                  </button>
                  <button
                    onClick={() => handleApprove(req)}
                    className="flex-1 bg-primary text-on-primary text-label-md font-label-md py-2.5 rounded-full flex items-center justify-center gap-1"
                  >
                    <MaterialIcon icon="check" size={16} /> อนุมัติ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Overdue */}
        {mockOverdueRequests.length > 0 && (
          <section>
            <h2 className="text-title-lg font-title-lg text-error mb-stack-md flex items-center gap-1">
              <MaterialIcon icon="warning" size={20} /> เกินกำหนดคืน
            </h2>
            {mockOverdueRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-error/30 bg-error/5 p-stack-md flex items-center justify-between">
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface">{req.asset_name}</h3>
                  <p className="text-body-sm text-error mt-0.5">
                    เกินกำหนด {req.days_overdue} วัน &middot; ผู้ยืม: {req.borrower_name}
                  </p>
                </div>
                <button className="text-primary text-label-md font-label-md whitespace-nowrap">
                  ทวงถาม
                </button>
              </div>
            ))}
          </section>
        )}
      </main>

      <ConfirmModal
        isOpen={!!rejectModal}
        title="ปฏิเสธคำขอยืม?"
        confirmLabel="ปฏิเสธ"
        confirmVariant="danger"
        onConfirm={handleReject}
        onCancel={() => setRejectModal(null)}
      >
        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">
            เหตุผลการปฏิเสธ
          </label>
          <textarea
            rows={3}
            placeholder="เช่น อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md resize-none"
          />
        </div>
      </ConfirmModal>

      <BottomNav variant="admin" />
    </div>
  );
}
