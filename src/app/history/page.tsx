'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { FilterPills } from '@/components/filter-pills';
import { StatusBadge } from '@/components/status-badge';
import { MaterialIcon } from '@/components/material-icon';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockBorrowRequests } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';

const filterOptions = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'กำลังยืม', value: 'borrowed' },
  { label: 'รออนุมัติ', value: 'pending' },
  { label: 'คืนแล้ว', value: 'returned' },
];

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [returnModal, setReturnModal] = useState<BorrowRequest | null>(null);
  const [requests, setRequests] = useState(mockBorrowRequests);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'all') return requests;
    return requests.filter((r) => r.status === selectedFilter);
  }, [selectedFilter, requests]);

  const handleReturn = () => {
    if (!returnModal) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === returnModal.id
          ? { ...r, status: 'returned' as const, returned_at: new Date().toISOString() }
          : r
      )
    );
    setReturnModal(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="pb-24">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">
          ประวัติการยืม-คืนของฉัน
        </h1>
      </header>

      <main className="pt-16 px-margin-mobile max-w-2xl mx-auto">
        <section className="py-stack-lg sticky top-16 bg-background z-40">
          <FilterPills
            options={filterOptions}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </section>

        <section className="space-y-stack-sm">
          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <MaterialIcon icon="history" size={48} className="mb-stack-sm opacity-50" />
              <p>ไม่มีประวัติการยืม</p>
            </div>
          )}
          {filteredRequests.map((req) => {
            const isInactive = req.status === 'returned' || req.status === 'rejected' || req.status === 'cancelled';
            return (
              <div
                key={req.id}
                className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md ${
                  isInactive ? 'opacity-70' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-stack-xs">
                  <h3 className="font-title-lg text-title-lg text-on-surface">
                    {req.assets?.name}
                  </h3>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  {req.request_no} &middot; {req.assets?.asset_tag}
                </p>
                <div className="flex justify-between items-center mt-stack-sm pt-stack-sm border-t border-outline-variant">
                  <span className="text-body-sm text-on-surface-variant">
                    {req.status === 'borrowed' || req.status === 'approved'
                      ? 'กำหนดคืน'
                      : req.status === 'returned'
                      ? 'คืนเมื่อ'
                      : req.status === 'pending'
                      ? 'ส่งคำขอเมื่อ'
                      : req.status === 'rejected'
                      ? 'เหตุผล'
                      : 'วันที่'}
                  </span>
                  <span className="text-body-sm font-medium text-on-surface">
                    {req.status === 'borrowed' || req.status === 'approved'
                      ? formatDate(req.due_date || req.requested_due_date)
                      : req.status === 'returned' && req.returned_at
                      ? formatDate(req.returned_at)
                      : req.status === 'pending'
                      ? formatDate(req.created_at)
                      : req.status === 'rejected'
                      ? req.rejection_reason || '-'
                      : formatDate(req.created_at)}
                  </span>
                </div>
                {(req.status === 'borrowed' || req.status === 'approved') && (
                  <button
                    onClick={() => setReturnModal(req)}
                    className="w-full mt-stack-md bg-primary text-on-primary text-label-md font-label-md py-2.5 rounded-full flex items-center justify-center gap-stack-xs"
                  >
                    <MaterialIcon icon="assignment_return" size={16} />
                    คืนอุปกรณ์
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <ConfirmModal
        isOpen={!!returnModal}
        title="ยืนยันการคืนอุปกรณ์?"
        description={`คืนอุปกรณ์ "${returnModal?.assets?.name}" และอัปเดตสถานะเป็น "คืนแล้ว"`}
        confirmLabel="คืนอุปกรณ์"
        confirmVariant="primary"
        onConfirm={handleReturn}
        onCancel={() => setReturnModal(null)}
      />

      <BottomNav variant="user" />
    </div>
  );
}
