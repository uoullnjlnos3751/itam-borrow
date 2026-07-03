'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockDashboardSummary, mockPendingRequests, mockOverdueRequests, mockApprovedRequests, mockActiveBorrowRequests } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [approvedRequests, setApprovedRequests] = useState(mockApprovedRequests);
  const [activeBorrowRequests, setActiveBorrowRequests] = useState(mockActiveBorrowRequests);

  const [rejectModal, setRejectModal] = useState<BorrowRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [returnModal, setReturnModal] = useState<BorrowRequest | null>(null);
  const [returnCondition, setReturnCondition] = useState('good');
  const [returnNote, setReturnNote] = useState('');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleApprove = (request: BorrowRequest) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
    setApprovedRequests((prev) => [request, ...prev]);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    setPendingRequests((prev) => prev.filter((r) => r.id !== rejectModal.id));
    setRejectModal(null);
    setRejectReason('');
  };

  const handleCheckOut = (request: BorrowRequest) => {
    setApprovedRequests((prev) => prev.filter((r) => r.id !== request.id));
    setActiveBorrowRequests((prev) => [request, ...prev]);
  };

  const handleReturn = () => {
    if (!returnModal) return;
    setActiveBorrowRequests((prev) => prev.filter((r) => r.id !== returnModal.id));
    setReturnModal(null);
    setReturnCondition('good');
    setReturnNote('');
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

        {/* Approved Requests (Ready for Pickup) */}
        {approvedRequests.length > 0 && (
          <section>
            <h2 className="text-title-lg font-title-lg text-primary mb-stack-md flex items-center gap-2">
              <MaterialIcon icon="inventory_2" size={20} /> รอส่งมอบ
            </h2>
            <div className="space-y-stack-sm">
              {approvedRequests.map((req) => (
                <div key={req.id} className="rounded-xl border border-primary/30 bg-primary-container/10 p-stack-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface">{req.assets?.name}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        ผู้มารับ: {req.users?.display_name}
                      </p>
                    </div>
                    <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                      อนุมัติแล้ว
                    </span>
                  </div>
                  <div className="mt-stack-md">
                    <button
                      onClick={() => handleCheckOut(req)}
                      className="w-full bg-primary text-on-primary text-label-md font-label-md py-2.5 rounded-full flex items-center justify-center gap-1"
                    >
                      <MaterialIcon icon="front_hand" size={16} /> ส่งมอบอุปกรณ์ (Check-out)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Borrowed Requests */}
        {activeBorrowRequests.length > 0 && (
          <section>
            <h2 className="text-title-lg font-title-lg text-on-surface mb-stack-md flex items-center gap-2">
              <MaterialIcon icon="devices" size={20} /> กำลังถูกยืม
            </h2>
            <div className="space-y-stack-sm">
              {activeBorrowRequests.map((req) => (
                <div key={req.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface">{req.assets?.name}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        ผู้ยืม: {req.users?.display_name}
                      </p>
                    </div>
                    <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                      คืนภายใน {formatDate(req.requested_due_date)}
                    </span>
                  </div>
                  <div className="mt-stack-md">
                    <button
                      onClick={() => { setReturnModal(req); setReturnCondition('good'); setReturnNote(''); }}
                      className="w-full bg-surface-container text-on-surface text-label-md font-label-md py-2.5 rounded-full flex items-center justify-center gap-1 border border-outline-variant"
                    >
                      <MaterialIcon icon="assignment_return" size={16} /> รับคืนอุปกรณ์ (Return)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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

      <ConfirmModal
        isOpen={!!returnModal}
        title="บันทึกการรับคืนอุปกรณ์"
        confirmLabel="ยืนยันการรับคืน"
        confirmVariant="primary"
        onConfirm={handleReturn}
        onCancel={() => setReturnModal(null)}
      >
        <div className="space-y-stack-md">
          <p className="text-body-md text-on-surface">
            ตรวจเช็คสภาพอุปกรณ์: <span className="font-bold">{returnModal?.assets?.name}</span>
          </p>
          
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">
              สภาพอุปกรณ์ที่รับคืน
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setReturnCondition('good')}
                className={`flex-1 py-2 rounded-lg border text-label-md font-medium ${
                  returnCondition === 'good' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest border-outline-variant text-on-surface'
                }`}
              >
                ดี (ปกติ)
              </button>
              <button
                onClick={() => setReturnCondition('damaged')}
                className={`flex-1 py-2 rounded-lg border text-label-md font-medium ${
                  returnCondition === 'damaged' ? 'bg-error text-on-error border-error' : 'bg-surface-container-lowest border-outline-variant text-on-surface'
                }`}
              >
                ชำรุด / เสียหาย
              </button>
            </div>
          </div>

          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">
              หมายเหตุเพิ่มเติม (ถ้ามี)
            </label>
            <textarea
              rows={2}
              placeholder="เช่น มีรอยขีดข่วน, สายชาร์จขาด"
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md resize-none"
            />
          </div>
        </div>
      </ConfirmModal>

      <BottomNav variant="admin" />
    </div>
  );
}
