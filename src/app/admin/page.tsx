'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockPendingRequests, mockOverdueRequests, mockApprovedRequests, mockActiveBorrowRequests } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';
import { 
  LayoutDashboard, Boxes, ShoppingCart, Wrench, Shield, CheckCircle2, 
  Clock, AlertTriangle, Zap, RotateCcw, ClipboardList, ChevronRight, X
} from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  const pendingExtensions = activeBorrowRequests.filter(req => req.extension_status === 'pending');

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

  const handleApproveExtension = (request: BorrowRequest) => {
    setActiveBorrowRequests((prev) => prev.map((r) => 
      r.id === request.id 
        ? { ...r, extension_status: 'approved', due_date: r.extension_requested_date } 
        : r
    ));
  };

  const handleRejectExtension = (request: BorrowRequest) => {
    setActiveBorrowRequests((prev) => prev.map((r) => 
      r.id === request.id 
        ? { ...r, extension_status: 'rejected' } 
        : r
    ));
  };

  // Dummy Chart Data
  const chartData = [
    { name: 'ม.ค.', ยืม: 12, อนุมัติ: 10, คืน: 8 },
    { name: 'ก.พ.', ยืม: 19, อนุมัติ: 18, คืน: 15 },
    { name: 'มี.ค.', ยืม: 15, อนุมัติ: 12, คืน: 10 },
    { name: 'เม.ย.', ยืม: 22, อนุมัติ: 20, คืน: 18 },
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" /></div>;
  }

  const alertCount = mockOverdueRequests.length + pendingRequests.length + pendingExtensions.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-12 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-sky-500" size={24} />
          <h1 className="text-lg font-bold text-slate-800">Dashboard ภาพรวมระบบ</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Live
          </div>
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 overflow-hidden">
            {user?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.display_name?.charAt(0) || 'A'
            )}
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 max-w-7xl mx-auto mt-6 space-y-6">
        
        {/* Proactive Alerts Bar */}
        {alertCount > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mockOverdueRequests.length > 0 && (
              <div className="min-w-[280px] shrink-0 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <Clock className="text-red-500" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ยืมเกินกำหนด {mockOverdueRequests.length} รายการ</h4>
                  <p className="text-xs text-slate-500">กรุณาติดตามผู้ยืม</p>
                </div>
              </div>
            )}
            {pendingRequests.length > 0 && (
              <div className="min-w-[280px] shrink-0 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <ClipboardList className="text-amber-600" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">รออนุมัติ {pendingRequests.length} รายการ</h4>
                  <p className="text-xs text-slate-500">คำขอยืมรอการตรวจสอบ</p>
                </div>
              </div>
            )}
            {pendingExtensions.length > 0 && (
              <div className="min-w-[280px] shrink-0 bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                  <RotateCcw className="text-sky-500" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ขอต่อเวลา {pendingExtensions.length} รายการ</h4>
                  <p className="text-xs text-slate-500">พิจารณาขยายเวลา</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-sky-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <Boxes className="text-sky-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">124</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">ทรัพย์สิน IT ทั้งหมด</p>
            <p className="text-xs text-slate-400 mt-0.5">พร้อมใช้ 98 · ซ่อม 5</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-amber-400 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <ShoppingCart className="text-amber-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{activeBorrowRequests.length}</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">กำลังยืม / รออนุมัติ</p>
            <p className="text-xs text-slate-400 mt-0.5">รออนุมัติ {pendingRequests.length} · เกินกำหนด {mockOverdueRequests.length}</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-red-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Wrench className="text-red-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">5</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">งานซ่อมเปิดอยู่</p>
            <p className="text-xs text-slate-400 mt-0.5">อุปกรณ์ระหว่างซ่อมบำรุง</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="text-emerald-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">85%</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">PM เสร็จแล้ว</p>
            <p className="text-xs text-slate-400 mt-0.5">34/40 แผนงาน</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left / Center Column (Action Items) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Quick Actions (Mobile mainly, or Admin helpers) */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-5 text-white shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} />
                <h3 className="font-bold text-sm">ทางลัด (Quick Actions)</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center">
                  <CheckCircle2 size={20} />
                  <span className="text-xs font-medium">สแกนรับของ</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center">
                  <RotateCcw size={20} />
                  <span className="text-xs font-medium">รับคืนอุปกรณ์</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center">
                  <LayoutDashboard size={20} />
                  <span className="text-xs font-medium">เพิ่มทรัพย์สิน</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center">
                  <Shield size={20} />
                  <span className="text-xs font-medium">จัดการ PM</span>
                </button>
              </div>
            </div>

            {/* Approvals Queue */}
            {(pendingRequests.length > 0 || pendingExtensions.length > 0) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-sky-500" />
                    <h3 className="font-bold text-sm text-slate-800">คิวงานรออนุมัติ (Approval Queue)</h3>
                  </div>
                  <div className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">{pendingRequests.length + pendingExtensions.length} งาน</div>
                </div>

                <div className="space-y-3">
                  {/* Extension Requests */}
                  {pendingExtensions.map((req) => (
                    <div key={req.id} className="group flex flex-col sm:flex-row gap-4 bg-sky-50/50 border border-sky-100 p-4 rounded-xl hover:border-sky-200 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-500 flex items-center justify-center shrink-0">
                        <RotateCcw size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{req.assets?.name}</h4>
                          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider bg-sky-100 px-2 py-0.5 rounded-full shrink-0">ขอต่อเวลา</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">ผู้ยืม: {req.users?.display_name}</p>
                        <div className="bg-white/60 p-2.5 rounded-lg border border-sky-50 text-xs text-slate-600">
                          <span className="font-bold">เหตุผล:</span> {req.extension_reason} <br/>
                          <span className="font-bold">ขอขยายถึง:</span> {req.extension_requested_date ? formatDate(req.extension_requested_date) : '-'}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button onClick={() => handleApproveExtension(req)} className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                          อนุมัติ
                        </button>
                        <button onClick={() => handleRejectExtension(req)} className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                          ไม่อนุมัติ
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New Borrow Requests */}
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="group flex flex-col sm:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-xl hover:border-sky-200 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center shrink-0">
                        <ShoppingCart size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{req.assets?.name}</h4>
                          <span className="text-xs font-bold text-slate-500">{formatDate(req.requested_due_date)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">ผู้ขอ: {req.users?.display_name}</p>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                          <span className="font-bold">เหตุผล:</span> {req.reason}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button onClick={() => handleApprove(req)} className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                          อนุมัติให้ยืม
                        </button>
                        <button onClick={() => setRejectModal(req)} className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trend Chart (Dummy) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-[320px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <LayoutDashboard size={18} className="text-sky-500" />
                <h3 className="font-bold text-sm text-slate-800">แนวโน้มการยืม-คืน ปี {new Date().getFullYear()}</h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="ยืม" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="อนุมัติ" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="คืน" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column (Tracking / Lists) */}
          <div className="space-y-6">
            
            {/* Ready to Deliver */}
            {approvedRequests.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-800">รอส่งมอบ (Approved)</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{approvedRequests.length}</span>
                </div>
                <div className="space-y-3">
                  {approvedRequests.map(req => (
                    <div key={req.id} className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{req.assets?.name}</h4>
                        <p className="text-xs text-slate-500 truncate">ผู้รับ: {req.users?.display_name}</p>
                      </div>
                      <button onClick={() => handleCheckOut(req)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors shrink-0">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overdue */}
            {mockOverdueRequests.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h3 className="font-bold text-sm text-slate-800">เกินกำหนดคืน (Overdue)</h3>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">{mockOverdueRequests.length}</span>
                </div>
                <div className="space-y-3">
                  {mockOverdueRequests.map(req => (
                    <div key={req.id} className="flex flex-col gap-2 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{req.asset_name}</h4>
                          <p className="text-xs text-slate-500 truncate">ผู้ยืม: {req.borrower_name}</p>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">-{req.days_overdue} วัน</span>
                      </div>
                      <button onClick={() => { setReturnModal(req as any); setReturnCondition('good'); setReturnNote(''); }} className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg transition-colors mt-1">
                        บังคับคืนระบบ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Borrowed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Boxes size={18} className="text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-800">กำลังยืม (Active)</h3>
                </div>
              </div>
              <div className="space-y-3">
                {activeBorrowRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center justify-between gap-3 p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{req.assets?.name}</h4>
                      <p className="text-xs text-slate-500 truncate">ผู้ยืม: {req.users?.display_name}</p>
                    </div>
                    <button onClick={() => { setReturnModal(req); setReturnCondition('good'); setReturnNote(''); }} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shrink-0 transition-colors">
                      รับคืน
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Reject Modal */}
      <ConfirmModal
        isOpen={!!rejectModal}
        title="ปฏิเสธคำขอ"
        confirmLabel="ยืนยันปฏิเสธ"
        confirmVariant="danger"
        onConfirm={handleReject}
        onCancel={() => { setRejectModal(null); setRejectReason(''); }}
      >
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">เหตุผลการปฏิเสธ</label>
          <textarea
            rows={3}
            placeholder="เช่น อุปกรณ์ไม่ว่างในช่วงเวลาที่ขอ"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm resize-none"
          />
        </div>
      </ConfirmModal>

      {/* Return Modal */}
      <ConfirmModal
        isOpen={!!returnModal}
        title="บันทึกการรับคืนอุปกรณ์"
        confirmLabel="ยืนยันการรับคืน"
        confirmVariant="primary"
        onConfirm={handleReturn}
        onCancel={() => setReturnModal(null)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            ตรวจเช็คสภาพอุปกรณ์: <span className="font-bold text-slate-800">{returnModal?.assets?.name || (returnModal as any)?.asset_name}</span>
          </p>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">สภาพอุปกรณ์ที่รับคืน</label>
            <div className="flex gap-2">
              <button
                onClick={() => setReturnCondition('good')}
                className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                  returnCondition === 'good' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ดี (ปกติ)
              </button>
              <button
                onClick={() => setReturnCondition('damaged')}
                className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                  returnCondition === 'damaged' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ชำรุด / เสียหาย
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">หมายเหตุเพิ่มเติม (ถ้ามี)</label>
            <textarea
              rows={2}
              placeholder="เช่น มีรอยขีดข่วน, สายชาร์จขาด"
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm resize-none"
            />
          </div>
        </div>
      </ConfirmModal>

      <BottomNav variant="admin" />
    </div>
  );
}
