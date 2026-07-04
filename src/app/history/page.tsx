'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { FilterPills } from '@/components/filter-pills';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockBorrowRequests, mockWaitlist } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';
import { 
  Search, Bell, Hourglass, CheckCircle2, History, Clock, 
  AlertTriangle, RotateCcw, Info, X, ShieldCheck, ListOrdered
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'borrow' | 'waitlist'>('borrow');
  const [waitlists, setWaitlists] = useState(mockWaitlist);

  // Extension states
  const [extendModal, setExtendModal] = useState<BorrowRequest | null>(null);
  const [extendDate, setExtendDate] = useState('');
  const [extendReason, setExtendReason] = useState('');

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

  const handleExtend = () => {
    if (!extendModal || !extendDate || !extendReason) return;
    
    setRequests((prev) =>
      prev.map((r) =>
        r.id === extendModal.id
          ? { 
              ...r, 
              extension_status: 'pending', 
              extension_requested_date: extendDate, 
              extension_reason: extendReason 
            }
          : r
      )
    );
    if (selectedRequest?.id === extendModal.id) {
      setSelectedRequest((prev) => prev ? { 
        ...prev, 
        extension_status: 'pending', 
        extension_requested_date: extendDate, 
        extension_reason: extendReason 
      } : null);
    }
    setExtendModal(null);
    setExtendDate('');
    setExtendReason('');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">กำลังยืม</span>;
      case 'approved':
        return <span className="bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">รอรับของ</span>;
      case 'pending':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">รออนุมัติ</span>;
      case 'returned':
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">คืนแล้ว</span>;
      case 'overdue':
        return <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">เกินกำหนด</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-12 text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-4 h-16">
        <h1 className="text-lg font-bold text-slate-800">ประวัติการยืม</h1>
        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-sm font-bold border border-sky-200 overflow-hidden">
          {user?.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user?.display_name?.charAt(0) || 'U'
          )}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 h-16 items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">คำขอของฉัน</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหารายการ..." 
              className="bg-slate-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 w-64 outline-none transition-all"
            />
          </div>
          <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 overflow-hidden">
            {user?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.display_name?.charAt(0) || 'U'
            )}
          </div>
        </div>
      </header>

      <main className="pt-20 lg:pt-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'borrow' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            การยืมของฉัน
            {activeTab === 'borrow' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`pb-3 text-sm font-bold transition-colors relative flex items-center gap-2 ${
              activeTab === 'waitlist' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            การต่อคิว (Waitlist)
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{waitlists.length}</span>
            {activeTab === 'waitlist' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 rounded-t-full" />
            )}
          </button>
        </div>

        {activeTab === 'borrow' ? (
          <>
            {/* Desktop Bento Grid */}
            <section className="hidden lg:grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                <Hourglass size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats.active}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">กำลังดำเนินการ/กำลังใช้งาน</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-sky-50 rounded-xl text-sky-500">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats.approved}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">ได้รับอนุมัติ (รอรับของ)</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500">
                <History size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats.completed}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">ส่งคืนเรียบร้อยแล้ว</div>
            </div>
          </div>
        </section>

        {/* Mobile Filter Pills */}
        <section className="lg:hidden sticky top-16 bg-slate-50 z-40 py-2">
          <FilterPills options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
        </section>

        {/* Split View Container for Desktop / Standard List for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (Table on Desktop, Cards on Mobile) */}
          <div className="lg:col-span-2">
            
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-800">รายการคำขอทั้งหมด</h2>
                <FilterPills options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                    <th className="px-5 py-3 font-bold">ID คำขอ</th>
                    <th className="px-5 py-3 font-bold">ชื่อรายการ</th>
                    <th className="px-5 py-3 font-bold">วันที่ขอ</th>
                    <th className="px-5 py-3 font-bold">กำหนดคืน</th>
                    <th className="px-5 py-3 font-bold">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        ไม่มีประวัติการยืม
                      </td>
                    </tr>
                  )}
                  {filteredRequests.map((req) => (
                    <tr 
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedRequest?.id === req.id ? 'bg-sky-50/50' : ''}`}
                    >
                      <td className="px-5 py-4 text-sm font-bold text-sky-600">{req.request_no}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">{req.assets?.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{formatDate(req.created_at)}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{req.due_date ? formatDate(req.due_date) : '-'}</td>
                      <td className="px-5 py-4">{renderStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-4">
              {filteredRequests.length === 0 && (
                <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                  <History size={48} className="mb-3 opacity-20" />
                  <p className="font-medium">ไม่มีประวัติการยืม</p>
                </div>
              )}
              {filteredRequests.map((req) => {
                const isInactive = req.status === 'returned' || req.status === 'rejected' || req.status === 'cancelled';
                return (
                  <div
                    key={req.id}
                    className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all ${
                      isInactive ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-sm pr-4">{req.assets?.name}</h3>
                      {renderStatusBadge(req.status)}
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-4">
                      {req.request_no} &middot; {req.assets?.asset_tag}
                    </p>
                    <div className="flex justify-between items-center py-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {req.status === 'borrowed' || req.status === 'approved' ? 'กำหนดคืน' : req.status === 'returned' ? 'คืนเมื่อ' : 'วันที่ส่งคำขอ'}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {req.status === 'borrowed' || req.status === 'approved'
                          ? formatDate(req.due_date || req.requested_due_date)
                          : req.status === 'returned' && req.returned_at
                          ? formatDate(req.returned_at)
                          : formatDate(req.created_at)}
                      </span>
                    </div>
                    {(req.status === 'borrowed' || req.status === 'overdue') && !req.extension_status && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setExtendModal(req); }}
                        className="w-full mt-2 bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-amber-200"
                      >
                        <Clock size={16} /> ขอต่อเวลา
                      </button>
                    )}
                    {(req.status === 'borrowed' || req.status === 'approved') && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setReturnModal(req); }}
                        className="w-full mt-2 bg-sky-500 text-white hover:bg-sky-600 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <RotateCcw size={16} /> แจ้งคืนอุปกรณ์
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
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-sm font-bold text-sky-600 mb-1">{selectedRequest.request_no}</h2>
                    <p className="text-base font-bold text-slate-800 leading-tight">{selectedRequest.assets?.name}</p>
                  </div>
                  {renderStatusBadge(selectedRequest.status)}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                      <Info size={14} /> รายละเอียดคำขอ
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">รหัสอ้างอิง (Tag)</span>
                        <span className="font-bold text-slate-700">{selectedRequest.assets?.asset_tag}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">วันที่ขอ</span>
                        <span className="font-bold text-slate-700">{formatDate(selectedRequest.created_at)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">กำหนดส่งคืน</span>
                        <span className="font-bold text-slate-700">{formatDate(selectedRequest.due_date || selectedRequest.requested_due_date)}</span>
                      </div>
                      {selectedRequest.returned_at && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">วันที่คืนจริง</span>
                          <span className="font-bold text-slate-700">{formatDate(selectedRequest.returned_at)}</span>
                        </div>
                      )}
                      {selectedRequest.extension_status && (
                        <div className="flex justify-between text-sm items-center mt-3 p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                          <span className="text-slate-600 flex items-center gap-1.5 text-xs font-bold"><Clock size={14}/> สถานะต่อเวลา</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedRequest.extension_status === 'pending' ? 'bg-amber-100 text-amber-700' : selectedRequest.extension_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {selectedRequest.extension_status === 'pending' ? 'รออนุมัติ' : selectedRequest.extension_status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">เหตุผลการยืม</h3>
                    <p className="text-sm text-slate-700">{selectedRequest.reason}</p>
                    {selectedRequest.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs font-bold text-red-600 mb-1">เหตุผลที่ถูกปฏิเสธ:</p>
                        <p className="text-sm text-slate-700">{selectedRequest.rejection_reason}</p>
                      </div>
                    )}
                  </div>

                  {(selectedRequest.status === 'borrowed' || selectedRequest.status === 'approved' || selectedRequest.status === 'overdue') && (
                    <div className="pt-2 flex flex-col gap-2">
                      {(selectedRequest.status === 'borrowed' || selectedRequest.status === 'overdue') && !selectedRequest.extension_status && (
                        <button
                          onClick={() => setExtendModal(selectedRequest)}
                          className="w-full py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <Clock size={18} /> ขอต่อเวลายืม
                        </button>
                      )}
                      <button
                        onClick={() => setReturnModal(selectedRequest)}
                        className="w-full py-2.5 bg-sky-500 text-white hover:bg-sky-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <RotateCcw size={18} /> แจ้งคืนอุปกรณ์
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-1">การคืนอุปกรณ์ต้องได้รับการตรวจสอบจากฝ่ายไอทีภายใน 24 ชม.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-64 sticky top-24">
                <ShieldCheck size={40} className="mb-3 opacity-20" />
                <p className="font-medium text-sm">เลือกรายการคำขอเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
        </>
        ) : (
          /* Waitlist UI */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <ListOrdered size={18} className="text-sky-500" />
                คิวของฉัน
              </h2>
            </div>
            
            <div className="p-5">
              {waitlists.length === 0 ? (
                <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                  <ListOrdered size={48} className="mb-3 opacity-20" />
                  <p className="font-medium">ไม่มีรายการต่อคิว</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {waitlists.map((wl) => (
                    <div key={wl.id} className="border border-slate-200 rounded-xl p-4 flex flex-col hover:border-sky-300 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{wl.assets?.name}</h3>
                        {wl.status === 'waiting' && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">กำลังรอคิว</span>}
                        {wl.status === 'notified' && <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">แจ้งเตือนแล้ว (ว่าง)</span>}
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Tag: {wl.assets?.asset_tag}</p>
                      
                      <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">ลงชื่อเมื่อ: {formatDate(wl.created_at)}</span>
                        <button 
                          className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                          onClick={() => {
                            if (confirm('คุณต้องการยกเลิกการต่อคิวนี้หรือไม่?')) {
                              setWaitlists(prev => prev.filter(item => item.id !== wl.id));
                            }
                          }}
                        >
                          ยกเลิกคิว
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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

      {/* Extension Modal */}
      {extendModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => { setExtendModal(null); setExtendDate(''); setExtendReason(''); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 mb-2">ขอต่อเวลายืม</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">คุณสามารถขอขยายเวลาได้สูงสุด 7 วันนับจากวันครบกำหนดเดิม <br/><strong className="text-slate-700">({extendModal.due_date ? formatDate(extendModal.due_date) : '-'})</strong></p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">วันที่ต้องการคืนใหม่</label>
                <input 
                  type="date" 
                  value={extendDate}
                  onChange={(e) => setExtendDate(e.target.value)}
                  min={extendModal.due_date ? new Date(extendModal.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  max={extendModal.due_date ? new Date(new Date(extendModal.due_date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">เหตุผลที่ขอต่อเวลา</label>
                <textarea 
                  rows={3}
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  placeholder="ระบุเหตุผลความจำเป็น..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => { setExtendModal(null); setExtendDate(''); setExtendReason(''); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleExtend}
                disabled={!extendDate || !extendReason}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ส่งคำขอต่อเวลา
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav variant="user" />
    </div>
  );
}
