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
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [returnModal, setReturnModal] = useState<BorrowRequest | null>(null);
  const [requests, setRequests] = useState(mockBorrowRequests);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'all') return requests;
    return requests.filter((r) => r.status === selectedFilter);
  }, [selectedFilter, requests]);

  const stats = useMemo(() => {
    return {
      active: requests.filter((r) => r.status === 'borrowed').length,
      approved: requests.filter((r) => r.status === 'approved').length,
      completed: requests.filter((r) => r.status === 'returned').length,
    };
  }, [requests]);

  const handleReturn = () => {
    if (!returnModal) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === returnModal.id
          ? { ...r, status: 'returned' as const, returned_at: new Date().toISOString() }
          : r
      )
    );
    if (selectedRequest?.id === returnModal.id) {
      setSelectedRequest((prev) => prev ? { ...prev, status: 'returned' as const, returned_at: new Date().toISOString() } : null);
    }
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
    <div className="pb-24 lg:pb-8">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-mobile h-16">
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">ประวัติการยืม</h1>
        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-body-sm font-bold">
          {user?.display_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-50 justify-between items-center w-full px-8 py-4 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <h1 className="text-headline-lg font-bold text-on-surface">คำขอของฉัน</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหารายการ..." 
              className="bg-surface-container border-none rounded-full pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary w-64 outline-none transition-all"
            />
          </div>
          <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors">
            <MaterialIcon icon="notifications" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold">
            {user?.display_name?.charAt(0)}
          </div>
        </div>
      </header>

      <main className="pt-20 lg:pt-8 px-margin-mobile lg:px-8 max-w-2xl lg:max-w-7xl mx-auto space-y-stack-lg">
        
        {/* Desktop Bento Grid */}
        <section className="hidden lg:grid grid-cols-3 gap-6 mb-10">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
                <MaterialIcon icon="hourglass_empty" />
              </div>
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Active</span>
            </div>
            <div>
              <div className="text-display-sm font-bold text-on-surface">{stats.active}</div>
              <div className="text-body-md text-on-surface-variant">กำลังดำเนินการ/กำลังใช้งาน</div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-container rounded-lg text-on-primary-container">
                <MaterialIcon icon="check_circle" />
              </div>
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Approved</span>
            </div>
            <div>
              <div className="text-display-sm font-bold text-on-surface">{stats.approved}</div>
              <div className="text-body-md text-on-surface-variant">ได้รับอนุมัติ (รอรับของ)</div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-surface-container-highest rounded-lg text-on-surface-variant">
                <MaterialIcon icon="history" />
              </div>
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Completed</span>
            </div>
            <div>
              <div className="text-display-sm font-bold text-on-surface">{stats.completed}</div>
              <div className="text-body-md text-on-surface-variant">ส่งคืนเรียบร้อยแล้ว</div>
            </div>
          </div>
        </section>

        {/* Mobile Filter Pills */}
        <section className="lg:hidden sticky top-16 bg-background z-40 py-2">
          <FilterPills options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
        </section>

        {/* Split View Container for Desktop / Standard List for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Table on Desktop, Cards on Mobile) */}
          <div className="lg:col-span-2">
            
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h2 className="font-semibold text-title-md">รายการคำขอทั้งหมด</h2>
                <FilterPills options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-label-md uppercase text-on-surface-variant border-b border-outline-variant">
                    <th className="px-6 py-4 font-semibold">ID คำขอ</th>
                    <th className="px-6 py-4 font-semibold">ชื่อรายการ</th>
                    <th className="px-6 py-4 font-semibold">วันที่ขอ</th>
                    <th className="px-6 py-4 font-semibold">กำหนดคืน</th>
                    <th className="px-6 py-4 font-semibold">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-on-surface-variant">
                        ไม่มีประวัติการยืม
                      </td>
                    </tr>
                  )}
                  {filteredRequests.map((req) => (
                    <tr 
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`hover:bg-surface-container-low transition-colors cursor-pointer ${selectedRequest?.id === req.id ? 'bg-primary-container/10' : ''}`}
                    >
                      <td className="px-6 py-4 text-body-md font-medium text-primary">{req.request_no}</td>
                      <td className="px-6 py-4 text-body-md">{req.assets?.name}</td>
                      <td className="px-6 py-4 text-body-md">{formatDate(req.created_at)}</td>
                      <td className="px-6 py-4 text-body-md">{req.due_date ? formatDate(req.due_date) : '-'}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-stack-sm">
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
                    className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md shadow-sm ${
                      isInactive ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-stack-xs">
                      <h3 className="font-title-lg text-title-lg text-on-surface">{req.assets?.name}</h3>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      {req.request_no} &middot; {req.assets?.asset_tag}
                    </p>
                    <div className="flex justify-between items-center mt-stack-sm pt-stack-sm border-t border-outline-variant">
                      <span className="text-body-sm text-on-surface-variant">
                        {req.status === 'borrowed' || req.status === 'approved' ? 'กำหนดคืน' : req.status === 'returned' ? 'คืนเมื่อ' : 'วันที่ส่งคำขอ'}
                      </span>
                      <span className="text-body-sm font-medium text-on-surface">
                        {req.status === 'borrowed' || req.status === 'approved'
                          ? formatDate(req.due_date || req.requested_due_date)
                          : req.status === 'returned' && req.returned_at
                          ? formatDate(req.returned_at)
                          : formatDate(req.created_at)}
                      </span>
                    </div>
                    {(req.status === 'borrowed' || req.status === 'approved') && (
                      <button
                        onClick={() => setReturnModal(req)}
                        className="w-full mt-stack-md bg-primary text-on-primary text-label-md font-label-md py-2.5 rounded-full flex items-center justify-center gap-stack-xs active:scale-95 transition-transform"
                      >
                        <MaterialIcon icon="assignment_return" size={18} />
                        แจ้งคืนอุปกรณ์
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column (Details Panel on Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            {selectedRequest ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-md sticky top-28 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-headline-sm font-bold text-primary">{selectedRequest.request_no}</h2>
                    <p className="text-title-lg font-medium text-on-surface mt-1">{selectedRequest.assets?.name}</p>
                  </div>
                  <StatusBadge status={selectedRequest.status} />
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <h3 className="text-label-md font-semibold text-on-surface-variant mb-3 uppercase tracking-wider flex items-center gap-2">
                      <MaterialIcon icon="info" size={16} /> รายละเอียดคำขอ
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-body-md">
                        <span className="text-on-surface-variant">รหัสอ้างอิง (Tag)</span>
                        <span className="font-medium text-on-surface">{selectedRequest.assets?.asset_tag}</span>
                      </div>
                      <div className="flex justify-between text-body-md">
                        <span className="text-on-surface-variant">วันที่ขอ</span>
                        <span className="font-medium text-on-surface">{formatDate(selectedRequest.created_at)}</span>
                      </div>
                      <div className="flex justify-between text-body-md">
                        <span className="text-on-surface-variant">กำหนดส่งคืน</span>
                        <span className="font-medium text-on-surface">{formatDate(selectedRequest.due_date || selectedRequest.requested_due_date)}</span>
                      </div>
                      {selectedRequest.returned_at && (
                        <div className="flex justify-between text-body-md">
                          <span className="text-on-surface-variant">วันที่คืนจริง</span>
                          <span className="font-medium text-on-surface">{formatDate(selectedRequest.returned_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <h3 className="text-label-md font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">เหตุผลการยืม</h3>
                    <p className="text-body-md text-on-surface">{selectedRequest.reason}</p>
                    {selectedRequest.rejection_reason && (
                      <div className="mt-3 p-3 bg-error-container/20 rounded-lg border border-error/20">
                        <p className="text-label-sm font-bold text-error mb-1">เหตุผลที่ถูกปฏิเสธ:</p>
                        <p className="text-body-sm text-on-surface-variant">{selectedRequest.rejection_reason}</p>
                      </div>
                    )}
                  </div>

                  {(selectedRequest.status === 'borrowed' || selectedRequest.status === 'approved') && (
                    <div className="pt-4">
                      <button
                        onClick={() => setReturnModal(selectedRequest)}
                        className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/20"
                      >
                        <MaterialIcon icon="replay" size={20} />
                        แจ้งคืนอุปกรณ์
                      </button>
                      <p className="text-center text-xs text-on-surface-variant mt-3">การคืนอุปกรณ์ต้องได้รับการตรวจสอบจากฝ่ายไอทีภายใน 24 ชม.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low border border-outline-variant border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-on-surface-variant h-64 sticky top-28">
                <MaterialIcon icon="touch_app" size={48} className="mb-4 opacity-50" />
                <p className="font-medium">เลือกรายการคำขอเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!returnModal}
        title="ยืนยันการคืนอุปกรณ์?"
        description={`แจ้งคืนอุปกรณ์ "${returnModal?.assets?.name}" แอดมินไอทีจะทำการตรวจสอบสภาพก่อนปรับสถานะเป็น "คืนแล้ว" โดยสมบูรณ์`}
        confirmLabel="แจ้งคืนอุปกรณ์"
        confirmVariant="primary"
        onConfirm={handleReturn}
        onCancel={() => setReturnModal(null)}
      />

      <BottomNav variant="user" />
    </div>
  );
}
