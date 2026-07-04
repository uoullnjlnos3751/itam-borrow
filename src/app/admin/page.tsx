'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockPendingRequests, mockOverdueRequests, mockApprovedRequests, mockActiveBorrowRequests, mockAssets } from '@/lib/mock-data';
import { BorrowRequest } from '@/lib/database.types';
import { 
  LayoutDashboard, Boxes, ShoppingCart, Wrench, Shield, CheckCircle2, 
  Clock, AlertTriangle, Zap, RotateCcw, ClipboardList, ChevronRight, X,
  Mail, MessageSquare, Scan, Lightbulb, CalendarDays, Check, AlertCircle
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

  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<'checkout' | 'return'>('checkout');
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'email' | 'teams';
    recipient: string;
    subject: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        setNotification(prev => prev ? { ...prev, show: false } : null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
    setNotification({
      show: true,
      type: 'email',
      recipient: request.users?.email || 'jakkrit@trrgroup.com',
      subject: `[AssetHub] คำขอยืมอุปกรณ์ ${request.request_no} ได้รับการอนุมัติ`,
      body: `เรียนคุณ ${request.users?.display_name || 'พนักงาน'},\n\nคำขอยืมอุปกรณ์ ${request.assets?.name} (Tag: ${request.assets?.asset_tag}) ได้รับการอนุมัติแล้ว คุณสามารถติดต่อรับของได้ที่คลัง IT\n\nผู้จัดการฝ่ายไอทีกลาง (IT Admin)`
    });
  };

  const handleReject = () => {
    if (!rejectModal) return;
    setPendingRequests((prev) => prev.filter((r) => r.id !== rejectModal.id));
    setRejectModal(null);
    setNotification({
      show: true,
      type: 'teams',
      recipient: rejectModal.users?.display_name || 'พนักงาน',
      subject: 'คำขอยืมอุปกรณ์ถูกปฏิเสธ',
      body: `คำขอยืมอุปกรณ์ ${rejectModal.assets?.name} (${rejectModal.request_no}) ถูกปฏิเสธ\nเหตุผล: "${rejectReason || 'อุปกรณ์ไม่ว่างในช่วงเวลาดังกล่าว'}"`
    });
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
    setNotification({
      show: true,
      type: 'teams',
      recipient: request.users?.display_name || 'พนักงาน',
      subject: 'อนุมัติการขอต่อเวลายุการยืม',
      body: `คำขอต่ออายุของ ${request.assets?.name} ได้รับการอนุมัติแล้ว วันส่งคืนใหม่คือ ${request.extension_requested_date ? formatDate(request.extension_requested_date) : '-'}`
    });
  };

  const handleRejectExtension = (request: BorrowRequest) => {
    setActiveBorrowRequests((prev) => prev.map((r) => 
      r.id === request.id 
        ? { ...r, extension_status: 'rejected' } 
        : r
    ));
    setNotification({
      show: true,
      type: 'teams',
      recipient: request.users?.display_name || 'พนักงาน',
      subject: 'ปฏิเสธการขอต่ออายุการยืม',
      body: `คำขอต่ออายุของ ${request.assets?.name} ถูกปฏิเสธ กรุณาส่งมอบอุปกรณ์คืนตามกำหนดเดิม`
    });
  };

  // Dynamic statistics calculations based on selected subsidiary
  const displayedPending = pendingRequests.filter(req => selectedSubsidiary === 'all' || req.assets?.subsidiary === selectedSubsidiary);
  const displayedApproved = approvedRequests.filter(req => selectedSubsidiary === 'all' || req.assets?.subsidiary === selectedSubsidiary);
  const displayedActive = activeBorrowRequests.filter(req => selectedSubsidiary === 'all' || req.assets?.subsidiary === selectedSubsidiary);
  
  const displayedOverdue = mockOverdueRequests.filter(req => {
    const asset = mockAssets.find(a => a.asset_tag === req.asset_tag);
    return selectedSubsidiary === 'all' || asset?.subsidiary === selectedSubsidiary;
  });

  const displayedExtensions = displayedActive.filter(req => req.extension_status === 'pending');

  const totalAssets = mockAssets.filter(a => !a.deleted_at && (selectedSubsidiary === 'all' || a.subsidiary === selectedSubsidiary));
  const totalAssetsCount = totalAssets.length;
  const availableAssetsCount = totalAssets.filter(a => a.status === 'available').length;
  const maintenanceAssetsCount = totalAssets.filter(a => a.status === 'maintenance' || a.status === 'damaged').length;

  const pmProgressMap: Record<string, string> = { all: '85%', PS: '88%', 'TRR Corp': '82%', SSEC: '79%', TRRP: '90%' };
  const pmProgress = pmProgressMap[selectedSubsidiary] || '80%';

  const getChartData = () => {
    const chartData = [
      { name: 'ม.ค.', ยืม: 12, อนุมัติ: 10, คืน: 8 },
      { name: 'ก.พ.', ยืม: 19, อนุมัติ: 18, คืน: 15 },
      { name: 'มี.ค.', ยืม: 15, อนุมัติ: 12, คืน: 10 },
      { name: 'เม.ย.', ยืม: 22, อนุมัติ: 20, คืน: 18 },
    ];
    const scale = selectedSubsidiary === 'all' ? 1 : selectedSubsidiary === 'PS' ? 0.6 : selectedSubsidiary === 'TRR Corp' ? 0.35 : 0.15;
    return chartData.map(d => ({
      name: d.name,
      ยืม: Math.round(d.ยืม * scale),
      อนุมัติ: Math.round(d.อนุมัติ * scale),
      คืน: Math.round(d.คืน * scale),
    }));
  };

  const getSmartInsights = () => {
    const insights = [];
    if (selectedSubsidiary === 'all' || selectedSubsidiary === 'PS') {
      insights.push({
        type: 'warning',
        title: 'Notebook (PS) - คลังวิกฤต',
        desc: 'เหลืออุปกรณ์พร้อมยืมเพียง 1 เครื่อง แต่อัตราการยืมเฉลี่ยต่อสัปดาห์คือ 2 เครื่อง แนะนำให้จัดซื้อเพิ่มหรือเปิด PM คืน',
      });
    }
    if (selectedSubsidiary === 'all' || selectedSubsidiary === 'TRR Corp') {
      insights.push({
        type: 'info',
        title: 'Projector (TRR Corp) - การใช้งานต่ำ',
        desc: 'อัตราการยืมต่ำกว่า 10% ใน 30 วัน แนะนำให้โอนย้ายไปยังบริษัทในเครืออื่นที่ต้องการใช้งานสูงกว่า (เช่น PS)',
      });
    }
    if (selectedSubsidiary === 'all' || selectedSubsidiary === 'PS') {
      insights.push({
        type: 'warning',
        title: 'Adapter/Cable (PS) - อัตราชำรุดสูง',
        desc: 'อัตราการบันทึกสภาพชำรุดของ Adapter เพิ่มขึ้น 15% ในเดือนนี้ แนะนำให้แอดมินสุ่มตรวจคุณภาพสายสัญญาณ',
      });
    }
    if (selectedSubsidiary === 'SSEC' || selectedSubsidiary === 'TRRP') {
      insights.push({
        type: 'success',
        title: 'คลังสินค้าสุขภาพดี',
        desc: 'อัตราการยืมและคืนอยู่ในสัดส่วนที่สมดุล และอุปกรณ์ทั้งหมดพร้อมใช้งานครบถ้วน',
      });
    }
    return insights;
  };

  const weeklyBookingTimeline = [
    {
      assetName: 'MacBook Pro 16" (TAG-88291-LX)',
      subsidiary: 'PS',
      bookings: [
        { dayIndex: 0, length: 3, label: 'จักรกฤษณ์ (PS) - ยืมพรีเซนต์งานลูกค้า', color: 'bg-sky-500 text-white border-sky-600' }, // Mon-Wed
      ]
    },
    {
      assetName: 'Projector Epson EB-X06 (TAG-51022-PJ)',
      subsidiary: 'PS',
      bookings: [
        { dayIndex: 2, length: 1, label: 'วิภา (PS) - ประชุมย่อย', color: 'bg-indigo-500 text-white border-indigo-600' }, // Wed
        { dayIndex: 4, length: 2, label: 'มานะ (PS) - สัมมนาใหญ่', color: 'bg-emerald-500 text-white border-emerald-600' }, // Fri-Sat
      ]
    },
    {
      assetName: 'Dell UltraSharp 27" (TAG-77621-MN)',
      subsidiary: 'PS',
      bookings: [
        { dayIndex: 1, length: 4, label: 'วิภา (PS) - ส่งซ่อมบำรุง', color: 'bg-amber-500 text-white border-amber-600' }, // Tue-Fri
      ]
    },
    {
      assetName: 'iPad Air 5 (TAG-90981-IP)',
      subsidiary: 'TRR Corp',
      bookings: [
        { dayIndex: 1, length: 2, label: 'สมชาย (TRR Corp) - ตรวจไซต์งาน', color: 'bg-sky-500 text-white border-sky-600' }, // Tue-Wed
        { dayIndex: 4, length: 1, label: 'สมชาย (TRR Corp) - ออกบูธนิทรรศการ', color: 'bg-emerald-500 text-white border-emerald-600' }, // Fri
      ]
    },
    {
      assetName: 'Logitech Presenter R500 (TAG-12290-CK)',
      subsidiary: 'TRR Corp',
      bookings: [
        { dayIndex: 3, length: 2, label: 'สมชาย (TRR Corp) - ประกันบอร์ดบริหาร', color: 'bg-indigo-500 text-white border-indigo-600' }, // Thu-Fri
      ]
    }
  ];

  const displayedTimeline = weeklyBookingTimeline.filter(t => selectedSubsidiary === 'all' || t.subsidiary === selectedSubsidiary);

  const alertCount = displayedOverdue.length + displayedPending.length + displayedExtensions.length;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" /></div>;
  }

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
        
        {/* Subsidiary Selection Filter (Option 2) */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">สังกัดบริษัท:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'ทุกบริษัท (All)', value: 'all' },
                { label: 'PS', value: 'PS' },
                { label: 'TRR Corp', value: 'TRR Corp' },
                { label: 'SSEC', value: 'SSEC' },
                { label: 'TRRP', value: 'TRRP' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedSubsidiary(opt.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedSubsidiary === opt.value
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/10'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-bold text-sky-600 bg-sky-50 border border-sky-100 rounded-lg px-3 py-1 sm:self-center">
            กำลังแสดงข้อมูลสำหรับ: {selectedSubsidiary === 'all' ? 'ทุกบริษัทในเครือ' : selectedSubsidiary}
          </div>
        </section>

        {/* Smart Inventory Insights (Feature 4) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getSmartInsights().map((insight, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex gap-3 transition-all ${
                insight.type === 'warning'
                  ? 'bg-red-50/40 border-red-100 text-red-800'
                  : insight.type === 'success'
                  ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800'
                  : 'bg-blue-50/40 border-blue-100 text-blue-800'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  insight.type === 'warning'
                    ? 'bg-red-100/80 text-red-600'
                    : insight.type === 'success'
                    ? 'bg-emerald-100/80 text-emerald-600'
                    : 'bg-blue-100/80 text-blue-600'
                }`}
              >
                {insight.type === 'warning' ? (
                  <AlertCircle size={18} />
                ) : insight.type === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Lightbulb size={18} />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  {insight.title}
                  {insight.type === 'warning' && (
                    <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">วิกฤต</span>
                  )}
                  {insight.type === 'info' && (
                    <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">แนะนำ</span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {insight.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Proactive Alerts Bar */}
        {alertCount > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {displayedOverdue.length > 0 && (
              <div className="min-w-[280px] shrink-0 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <Clock className="text-red-500" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ยืมเกินกำหนด {displayedOverdue.length} รายการ</h4>
                  <p className="text-xs text-slate-500">กรุณาติดตามผู้ยืม</p>
                </div>
              </div>
            )}
            {displayedPending.length > 0 && (
              <div className="min-w-[280px] shrink-0 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <ClipboardList className="text-amber-600" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">รออนุมัติ {displayedPending.length} รายการ</h4>
                  <p className="text-xs text-slate-500">คำขอยืมรอการตรวจสอบ</p>
                </div>
              </div>
            )}
            {displayedExtensions.length > 0 && (
              <div className="min-w-[280px] shrink-0 bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                  <RotateCcw className="text-sky-500" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ขอต่อเวลา {displayedExtensions.length} รายการ</h4>
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
            <h3 className="text-2xl font-bold text-slate-800">{totalAssetsCount}</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">ทรัพย์สิน IT ทั้งหมด</p>
            <p className="text-xs text-slate-400 mt-0.5">พร้อมใช้ {availableAssetsCount} · ซ่อม/ชำรุด {maintenanceAssetsCount}</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-amber-400 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <ShoppingCart className="text-amber-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{displayedActive.length}</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">กำลังยืม / รออนุมัติ</p>
            <p className="text-xs text-slate-400 mt-0.5">รออนุมัติ {displayedPending.length} · เกินกำหนด {displayedOverdue.length}</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-red-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Wrench className="text-red-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{maintenanceAssetsCount}</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">งานซ่อมเปิดอยู่</p>
            <p className="text-xs text-slate-400 mt-0.5">อุปกรณ์ระหว่างซ่อมบำรุง</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="text-emerald-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{pmProgress}</h3>
            <p className="text-sm font-medium text-slate-600 mt-1">PM เสร็จแล้ว</p>
            <p className="text-xs text-slate-400 mt-0.5">{selectedSubsidiary === 'all' ? '34/40 แผนงาน' : selectedSubsidiary === 'PS' ? '20/22 แผนงาน' : selectedSubsidiary === 'TRR Corp' ? '10/12 แผนงาน' : '4/6 แผนงาน'}</p>
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
                <button
                  type="button"
                  onClick={() => { setScannerMode('checkout'); setScannerOpen(true); }}
                  className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center cursor-pointer"
                >
                  <Scan size={20} />
                  <span className="text-xs font-medium">สแกนส่งมอบ</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setScannerMode('return'); setScannerOpen(true); }}
                  className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center cursor-pointer"
                >
                  <RotateCcw size={20} />
                  <span className="text-xs font-medium">สแกนรับคืน</span>
                </button>
                <button onClick={() => router.push('/admin/assets')} className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center cursor-pointer">
                  <Boxes size={20} />
                  <span className="text-xs font-medium">คลังทรัพย์สิน</span>
                </button>
                <button onClick={() => router.push('/admin/settings')} className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl flex flex-col gap-2 items-center text-center cursor-pointer">
                  <Wrench size={20} />
                  <span className="text-xs font-medium">ตั้งค่าระบบ</span>
                </button>
              </div>
            </div>

            {/* Approvals Queue */}
            {(displayedPending.length > 0 || displayedExtensions.length > 0) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-sky-500" />
                    <h3 className="font-bold text-sm text-slate-800">คิวงานรออนุมัติ (Approval Queue)</h3>
                  </div>
                  <div className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">{displayedPending.length + displayedExtensions.length} งาน</div>
                </div>

                <div className="space-y-3">
                  {/* Extension Requests */}
                  {displayedExtensions.map((req) => (
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
                        <button onClick={() => handleApproveExtension(req)} className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          อนุมัติ
                        </button>
                        <button onClick={() => handleRejectExtension(req)} className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          ไม่อนุมัติ
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New Borrow Requests */}
                  {displayedPending.map((req) => (
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
                  <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

            {/* Weekly Booking Timeline (Feature 3) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="text-sky-500" size={18} />
                  <h3 className="font-bold text-sm text-slate-800">ตารางจองยืมรายสัปดาห์ (Weekly Timeline)</h3>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center w-48 shrink-0">
                  {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((day, idx) => (
                    <div key={idx} className="text-[10px] font-bold text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {displayedTimeline.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  ไม่มีตารางการจองในบริษัทนี้ในสัปดาห์นี้
                </div>
              ) : (
                <div className="space-y-3.5">
                  {displayedTimeline.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/60 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-700 truncate">
                            {item.assetName}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded shrink-0">
                            {item.subsidiary}
                          </span>
                        </div>
                      </div>
                      
                      {/* CSS Grid Gantt Bar */}
                      <div className="grid grid-cols-7 gap-1 h-7 bg-slate-100/60 rounded-lg relative border border-slate-200/60 w-48 shrink-0 overflow-hidden">
                        {item.bookings.map((b, bIdx) => (
                          <div
                            key={bIdx}
                            style={{
                              gridColumn: `${b.dayIndex + 1} / span ${b.length}`
                            }}
                            className={`h-full rounded-md px-1 text-[8px] font-bold border flex items-center justify-center truncate shadow-sm transition-all hover:brightness-95 ${b.color}`}
                            title={b.label}
                          >
                            {b.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-4 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-sky-500 border border-sky-600" />
                  <span>จองใช้งาน</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-500 border border-indigo-600" />
                  <span>ใช้งานด่วน</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-600" />
                  <span>ส่งซ่อม/PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Tracking / Lists) */}
          <div className="space-y-6">
            
            {/* Ready to Deliver */}
            {displayedApproved.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-800">รอส่งมอบ (Approved)</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{displayedApproved.length}</span>
                </div>
                <div className="space-y-3">
                  {displayedApproved.map(req => (
                    <div key={req.id} className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{req.assets?.name}</h4>
                        <p className="text-xs text-slate-500 truncate">ผู้รับ: {req.users?.display_name}</p>
                      </div>
                      <button onClick={() => handleCheckOut(req)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors shrink-0 cursor-pointer">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overdue */}
            {displayedOverdue.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h3 className="font-bold text-sm text-slate-800">เกินกำหนดคืน (Overdue)</h3>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">{displayedOverdue.length}</span>
                </div>
                <div className="space-y-3">
                  {displayedOverdue.map(req => (
                    <div key={req.id} className="flex flex-col gap-2 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{req.asset_name}</h4>
                          <p className="text-xs text-slate-500 truncate">ผู้ยืม: {req.borrower_name}</p>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">-{req.days_overdue} วัน</span>
                      </div>
                      <button onClick={() => { setReturnModal(req as any); setReturnCondition('good'); setReturnNote(''); }} className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg transition-colors mt-1 cursor-pointer">
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
                {displayedActive.slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center justify-between gap-3 p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{req.assets?.name}</h4>
                      <p className="text-xs text-slate-500 truncate">ผู้ยืม: {req.users?.display_name}</p>
                    </div>
                    <button onClick={() => { setReturnModal(req); setReturnCondition('good'); setReturnNote(''); }} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer">
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

      {/* Scanner Simulation Modal (Feature 2) */}
      <ConfirmModal
        isOpen={scannerOpen}
        title={scannerMode === 'checkout' ? 'สแกนส่งมอบอุปกรณ์ (Hand Over)' : 'สแกนรับคืนอุปกรณ์ (Check In)'}
        confirmLabel="ปิดกล้องสแกน"
        confirmVariant="primary"
        onConfirm={() => setScannerOpen(false)}
        onCancel={() => setScannerOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            ระบบใช้กล้องเว็บแคมหรือกล้องโทรศัพท์สแกน QR Code/Barcode บนตัวทรัพย์สินไอทีเพื่อระบุรายละเอียด
          </p>
          
          {/* Simulated Camera Viewport */}
          <div className="relative w-full aspect-video rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center overflow-hidden">
            <style>{`
              @keyframes scan {
                0%, 100% { top: 10%; }
                50% { top: 90%; }
              }
              .animate-scan-line {
                animation: scan 2.5s infinite ease-in-out;
              }
            `}</style>
            
            {/* Pulsing scanning red line */}
            <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-md shadow-red-500/80 animate-scan-line z-10" />
            
            {/* Viewfinder borders */}
            <div className="absolute w-32 h-32 border-2 border-sky-400/40 rounded-xl flex items-center justify-center z-0">
              <Scan className="text-sky-400/20 animate-pulse" size={36} />
            </div>

            <span className="absolute bottom-3 text-[10px] text-white/50 bg-black/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5 z-20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> Camera Live View
            </span>
          </div>

          {/* Quick Demo Scan Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">ปุ่มจำลองการสแกนรหัส (Demo Scan)</label>
            {scannerMode === 'checkout' ? (
              <div className="grid grid-cols-1 gap-2">
                {displayedApproved.length > 0 ? (
                  displayedApproved.map(req => (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => {
                        handleCheckOut(req);
                        setScannerOpen(false);
                        setNotification({
                          show: true,
                          type: 'email',
                          recipient: req.users?.display_name || 'พนักงาน',
                          subject: 'ส่งมอบอุปกรณ์เรียบร้อยแล้ว',
                          body: `ใบงานยืมเลขที่ ${req.request_no} ได้รับการส่งมอบอุปกรณ์ ${req.assets?.name} เรียบร้อยแล้ว\nสถานะอุปกรณ์: กำลังยืม\nวันกำหนดส่งคืน: ${formatDate(req.requested_due_date)}`
                        });
                      }}
                      className="w-full text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300 rounded-xl p-3 text-xs font-bold flex justify-between items-center transition-colors cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div>สแกน {req.assets?.name}</div>
                        <div className="text-[10px] text-emerald-600 mt-0.5">Tag ID: {req.assets?.asset_tag} &middot; ผู้รับ: {req.users?.display_name}</div>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 bg-slate-50 text-slate-400 text-xs rounded-xl border border-slate-200">
                    ไม่มีรายการ "รอส่งมอบ" ของบริษัทนี้ในระบบที่สแกนได้ในขณะนี้
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {displayedActive.length > 0 ? (
                  displayedActive.slice(0, 3).map(req => (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => {
                        setScannerOpen(false);
                        setReturnModal(req);
                        setReturnCondition('good');
                        setReturnNote('');
                      }}
                      className="w-full text-left bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-xl p-3 text-xs font-bold flex justify-between items-center transition-colors cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div>สแกน {req.assets?.name}</div>
                        <div className="text-[10px] text-indigo-600 mt-0.5">Tag ID: {req.assets?.asset_tag} &middot; ผู้ยืม: {req.users?.display_name}</div>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 bg-slate-50 text-slate-400 text-xs rounded-xl border border-slate-200">
                    ไม่มีอุปกรณ์ "กำลังถูกยืม" ของบริษัทนี้ในขณะนี้
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ConfirmModal>

      {/* Simulated Outlook / Teams Toast Notifications (Option 4) */}
      {notification && notification.show && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 animate-slide-up z-[70] font-sans text-slate-800">
          <div className="flex justify-between items-start mb-3">
            {notification.type === 'email' ? (
              <div className="flex items-center gap-2 text-sky-600">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outlook Email Log</h5>
                  <p className="text-xs font-bold text-slate-800">ส่งอีเมลแจ้งเตือนสำเร็จ</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Microsoft Teams Bot</h5>
                  <p className="text-xs font-bold text-slate-800">ส่งข้อความแจ้งเตือนสำเร็จ</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setNotification(prev => prev ? { ...prev, show: false } : null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
            <div>
              <span className="font-semibold text-slate-400">ผู้รับ:</span>{' '}
              <span className="font-bold text-slate-700">{notification.recipient}</span>
            </div>
            {notification.type === 'email' && (
              <div>
                <span className="font-semibold text-slate-400">หัวข้อ:</span>{' '}
                <span className="font-bold text-slate-700">{notification.subject}</span>
              </div>
            )}
            <div className="border-t border-slate-200/60 pt-2 whitespace-pre-line text-slate-600 leading-normal">
              {notification.body}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-semibold">
            <span>ส่งโดย: ITAM Notification Engine</span>
            <span className="text-sky-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" /> จำลองสถานะส่งจริง
            </span>
          </div>
        </div>
      )}

      <BottomNav variant="admin" />
    </div>
  );
}
