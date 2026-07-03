'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockPendingRequests, mockOverdueRequests, mockApprovedRequests, mockActiveBorrowRequests } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [approvedRequests, setApprovedRequests] = useState(mockApprovedRequests);
  const [activeBorrowRequests, setActiveBorrowRequests] = useState(mockActiveBorrowRequests);

  const [rejectModal, setRejectModal] = useState<BorrowRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [returnModal, setReturnModal] = useState<BorrowRequest | null>(null);
  const [returnCondition, setReturnCondition] = useState('good');
  const [returnNote, setReturnNote] = useState('');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/assets');
    }
  }, [isLoading, isAuthenticated, user, router]);

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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="pb-24 lg:pb-8 bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-mobile h-16">
        <div className="flex items-center gap-3">
          <MaterialIcon icon="admin_panel_settings" className="text-primary" />
          <h1 className="font-headline-md text-title-lg font-bold text-primary">ITSM Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <MaterialIcon icon="notifications" className="text-on-surface-variant" />
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-body-sm font-bold">
            {user?.display_name?.charAt(0) || 'A'}
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-50 justify-between items-center w-full px-8 py-4 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <h1 className="text-headline-lg font-bold text-on-surface">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาอุปกรณ์ หรือผู้ใช้..." 
              className="bg-surface-container border-none rounded-full pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary w-64 outline-none transition-all"
            />
          </div>
          <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors">
            <MaterialIcon icon="notifications" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold">
            {user?.display_name?.charAt(0) || 'A'}
          </div>
        </div>
      </header>

      <main className="pt-20 lg:pt-8 px-margin-mobile lg:px-8 max-w-2xl lg:max-w-7xl mx-auto space-y-stack-lg">
        
        {/* Welcome Section */}
        <section className="mt-4">
          <p className="text-on-surface-variant font-label-md uppercase tracking-wider">ยินดีต้อนรับ,</p>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface lg:text-display-sm">{user?.display_name}</h2>
        </section>

        {/* Stats Grid - Adapting from technician_dashboard_mobile */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-stack-md">
          {/* Pending Requests */}
          <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-primary/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MaterialIcon icon="pending_actions" size={64} />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="material-symbols-outlined text-tertiary">pending_actions</span>
              {pendingRequests.length > 0 && (
                <span className="text-tertiary font-label-md bg-tertiary-container/20 px-2 py-0.5 rounded-full">New</span>
              )}
            </div>
            <div className="relative z-10 mt-4">
              <p className="text-on-surface-variant font-label-md">คำขอรออนุมัติ</p>
              <p className="font-headline-md text-headline-md text-tertiary">{pendingRequests.length}</p>
            </div>
          </div>

          {/* Approved (Ready for pickup) */}
          <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-primary/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MaterialIcon icon="inventory_2" size={64} />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <div className="relative z-10 mt-4">
              <p className="text-on-surface-variant font-label-md">รอส่งมอบ</p>
              <p className="font-headline-md text-headline-md text-primary">{approvedRequests.length}</p>
            </div>
          </div>

          {/* Active Borrowed */}
          <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-primary/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MaterialIcon icon="devices" size={64} />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="material-symbols-outlined text-secondary">devices</span>
            </div>
            <div className="relative z-10 mt-4">
              <p className="text-on-surface-variant font-label-md">กำลังถูกยืม</p>
              <p className="font-headline-md text-headline-md text-secondary">{activeBorrowRequests.length}</p>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-error/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MaterialIcon icon="warning" size={64} />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="material-symbols-outlined text-error">warning</span>
              {mockOverdueRequests.length > 0 && (
                <span className="text-error font-label-md bg-error-container/20 px-2 py-0.5 rounded-full">High</span>
              )}
            </div>
            <div className="relative z-10 mt-4">
              <p className="text-on-surface-variant font-label-md">เกินกำหนดคืน</p>
              <p className="font-headline-md text-headline-md text-error">{mockOverdueRequests.length}</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-stack-sm lg:hidden">
          <h3 className="font-title-lg text-title-lg text-on-surface">จัดการด่วน (Quick Actions)</h3>
          <div className="grid grid-cols-2 gap-stack-md">
            <button className="bg-primary-container text-on-primary-container p-stack-lg rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-sm">
              <MaterialIcon icon="qr_code_scanner" size={32} />
              <span className="font-label-md">Scan Asset</span>
            </button>
            <button className="bg-surface-container-highest text-on-surface border border-outline-variant p-stack-lg rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all duration-200" onClick={() => router.push('/admin/assets/new')}>
              <MaterialIcon icon="add_circle" size={32} className="text-primary" />
              <span className="font-label-md">เพิ่มอุปกรณ์ใหม่</span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column for Activity */}
          <div className="space-y-8">
            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
              <section className="space-y-stack-md">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                    <MaterialIcon icon="pending_actions" className="text-tertiary" /> 
                    รออนุมัติ
                  </h3>
                  <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold px-2 py-1 rounded-full">{pendingRequests.length} รายการ</span>
                </div>
                
                <div className="space-y-stack-sm">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex flex-col gap-3 bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl transition-all duration-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant">
                          <MaterialIcon icon={req.assets?.asset_categories?.icon || 'devices'} className="text-on-surface-variant" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-title-md text-on-surface truncate font-bold">{req.assets?.name}</p>
                          <p className="text-body-sm text-on-surface-variant truncate">ผู้ขอ: {req.users?.display_name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-label-sm text-on-surface-variant uppercase">วันที่ต้องการ</p>
                          <p className="text-body-sm font-medium">{formatDate(req.requested_due_date)}</p>
                        </div>
                      </div>
                      
                      <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 text-body-sm text-on-surface-variant">
                        <span className="font-bold text-on-surface">เหตุผล:</span> {req.reason}
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setRejectModal(req)}
                          className="flex-1 bg-surface-container-highest text-on-surface text-label-md font-label-md py-2.5 rounded-lg border border-outline-variant hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors"
                        >
                          ปฏิเสธ
                        </button>
                        <button
                          onClick={() => handleApprove(req)}
                          className="flex-1 bg-primary text-on-primary text-label-md font-label-md py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          อนุมัติให้ยืม
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Approved Requests Section */}
            {approvedRequests.length > 0 && (
              <section className="space-y-stack-md">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                    <MaterialIcon icon="inventory_2" className="text-primary" /> 
                    รอส่งมอบ (Approved)
                  </h3>
                </div>
                
                <div className="space-y-stack-sm">
                  {approvedRequests.map((req) => (
                    <div key={req.id} className="flex items-center gap-4 bg-primary-container/10 border border-primary/20 p-stack-sm pr-4 rounded-xl transition-all duration-200 hover:bg-primary-container/20">
                      <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                        <MaterialIcon icon="check_circle" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <p className="font-title-md text-on-surface truncate font-bold">{req.assets?.name}</p>
                        <p className="text-body-sm text-on-surface-variant">ผู้รับ: {req.users?.display_name}</p>
                      </div>
                      <button
                        onClick={() => handleCheckOut(req)}
                        className="shrink-0 bg-primary text-on-primary text-label-md font-label-md px-4 py-2 rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
                      >
                        <MaterialIcon icon="front_hand" size={16} /> ส่งมอบ
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column for Active & Overdue */}
          <div className="space-y-8">
            {/* Active Borrowed Section */}
            {activeBorrowRequests.length > 0 && (
              <section className="space-y-stack-md">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                    <MaterialIcon icon="devices" className="text-secondary" /> 
                    กำลังถูกยืม
                  </h3>
                </div>
                
                <div className="space-y-stack-sm">
                  {activeBorrowRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-container-lowest border border-outline-variant p-stack-sm pr-4 rounded-xl transition-all duration-200 hover:shadow-md">
                      <div className="w-12 h-12 hidden sm:flex rounded-lg bg-secondary-container items-center justify-center shrink-0">
                        <MaterialIcon icon="devices" className="text-on-secondary-container" />
                      </div>
                      <div className="flex-1 min-w-0 pt-2 sm:pt-0 pl-2 sm:pl-0">
                        <p className="font-title-md text-on-surface truncate font-bold">{req.assets?.name}</p>
                        <p className="text-body-sm text-on-surface-variant">ผู้ยืม: {req.users?.display_name}</p>
                        <p className="text-xs text-secondary mt-1 font-medium">คืนภายใน: {formatDate(req.requested_due_date)}</p>
                      </div>
                      <button
                        onClick={() => { setReturnModal(req); setReturnCondition('good'); setReturnNote(''); }}
                        className="w-full sm:w-auto shrink-0 bg-surface-container-highest text-on-surface text-label-md font-label-md px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors flex items-center justify-center gap-1"
                      >
                        <MaterialIcon icon="assignment_return" size={16} /> รับคืน
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Overdue Section */}
            {mockOverdueRequests.length > 0 && (
              <section className="space-y-stack-md">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <h3 className="font-title-lg text-title-lg text-error flex items-center gap-2">
                    <MaterialIcon icon="warning" /> 
                    เกินกำหนดคืน
                  </h3>
                </div>
                
                <div className="space-y-stack-sm">
                  {mockOverdueRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-error-container/10 border border-error/30 p-stack-sm pr-4 rounded-xl transition-all duration-200">
                      <div className="w-12 h-12 hidden sm:flex rounded-lg bg-error-container items-center justify-center shrink-0">
                        <MaterialIcon icon="warning" className="text-error" />
                      </div>
                      <div className="flex-1 min-w-0 pt-2 sm:pt-0 pl-2 sm:pl-0">
                        <p className="font-title-md text-on-surface truncate font-bold">{req.asset_name}</p>
                        <p className="text-body-sm text-on-surface-variant">ผู้ยืม: {req.borrower_name}</p>
                        <p className="text-xs text-error mt-1 font-bold">กำหนดคืน: {formatDate(req.due_date)}</p>
                      </div>
                      <button
                        onClick={() => { setReturnModal(req as any); setReturnCondition('good'); setReturnNote(''); }}
                        className="w-full sm:w-auto shrink-0 bg-error text-on-error text-label-md font-label-md px-4 py-2 rounded-lg shadow-sm hover:bg-error/90 transition-colors flex items-center justify-center gap-1"
                      >
                        <MaterialIcon icon="assignment_return" size={16} /> บังคับคืน
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!rejectModal}
        title="ปฏิเสธคำขอ"
        confirmLabel="ยืนยันปฏิเสธ"
        confirmVariant="danger"
        onConfirm={handleReject}
        onCancel={() => {
          setRejectModal(null);
          setRejectReason('');
        }}
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
