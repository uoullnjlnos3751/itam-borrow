'use client';

import { useState, useMemo } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockBorrowRequests, mockAssetAuditLogs } from '@/lib/mock-data';
import { 
  History, 
  Search, 
  Calendar, 
  User, 
  Package, 
  Clock, 
  FileText,
  HelpCircle,
  TrendingUp,
  Inbox,
  Download,
  Printer,
  X
} from 'lucide-react';

const filterOptions = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'กำลังยืม', value: 'borrowed' },
  { label: 'รออนุมัติ', value: 'pending' },
  { label: 'คืนแล้ว', value: 'returned' },
];

export default function AdminHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [printSlip, setPrintSlip] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'audit'>('history');

  const filteredAuditLogs = useMemo(() => {
    let result = mockAssetAuditLogs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(log =>
        log.changed_by.toLowerCase().includes(q) ||
        log.change_summary.toLowerCase().includes(q) ||
        (log.asset_tag_snapshot && log.asset_tag_snapshot.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search]);

  const filteredRequests = useMemo(() => {
    let result = mockBorrowRequests;
    if (selectedFilter !== 'all') {
      result = result.filter((r) => r.status === selectedFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => 
        (r.assets?.name && r.assets.name.toLowerCase().includes(q)) ||
        (r.assets?.asset_tag && r.assets.asset_tag.toLowerCase().includes(q)) ||
        (r.users?.display_name && r.users.display_name.toLowerCase().includes(q)) ||
        r.request_no.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedFilter, search]);

  const handleExportCSV = () => {
    if (activeTab === 'history') {
      const header = ['รหัสรายการ', 'เลขที่อุปกรณ์ (Tag ID)', 'ชื่ออุปกรณ์', 'ผู้ยืม', 'แผนกผู้ยืม', 'บริษัทสังกัด', 'วันที่เริ่มยืม', 'กำหนดส่งคืน', 'วันที่คืนจริง', 'สถานะ', 'เหตุผลการยืม'];
      const rows = filteredRequests.map(r => [
        r.request_no,
        r.assets?.asset_tag || '',
        r.assets?.name || '',
        r.users?.display_name || '',
        r.users?.department || '',
        r.users?.subsidiary || '',
        r.borrowed_at ? r.borrowed_at.slice(0,10) : '',
        r.due_date ? r.due_date.slice(0,10) : r.requested_due_date.slice(0,10),
        r.returned_at ? r.returned_at.slice(0,10) : '',
        r.status,
        r.reason || ''
      ]);
      
      const csvContent = "\uFEFF" + [header.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ITAM_Borrow_History_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const header = ['วันเวลา', 'ผู้ดำเนินการ', 'รหัสอุปกรณ์', 'กิจกรรม', 'รายละเอียด'];
      const rows = filteredAuditLogs.map(log => [
        log.created_at,
        log.changed_by,
        log.asset_tag_snapshot || '',
        log.action,
        log.change_summary
      ]);
      
      const csvContent = "\uFEFF" + [header.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ITAM_Security_Audit_Logs_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            รออนุมัติ
          </span>
        );
      case 'approved':
        return (
          <span className="bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            อนุมัติแล้ว
          </span>
        );
      case 'borrowed':
        return (
          <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            กำลังยืม
          </span>
        );
      case 'returned':
        return (
          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            คืนแล้ว
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ปฏิเสธ
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-sky-500/20">
            <History size={20} />
          </div>
          <h1 className="text-lg font-bold text-slate-800">ประวัติการทำรายการยืม-คืนทั้งหมด</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        
        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-sky-500 text-sky-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            📋 ประวัติการยืม-คืนอุปกรณ์
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'border-sky-500 text-sky-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            🛡️ บันทึกกิจกรรมระบบ (Audit Logs)
          </button>
        </div>

        {/* Search & Filter pills */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6">
          {/* Search bar & Export */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={activeTab === 'history' ? "ค้นหาชื่ออุปกรณ์, รหัสรายการ, หรือชื่อผู้ยืม..." : "ค้นหากิจกรรม, ผู้ดำเนินการ, รหัสพัสดุ..."}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 hover:bg-sky-100 text-sky-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer shrink-0"
              title="ส่งออกประวัติเป็น CSV"
            >
              <Download size={16} />
              <span className="hidden sm:inline">ส่งออก CSV</span>
            </button>
          </div>

          {/* Filter Options */}
          {activeTab === 'history' && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFilter(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    selectedFilter === opt.value
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Desktop Table View */}
        {activeTab === 'history' ? (
          <section className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="px-6 py-4">รหัสรายการ</th>
                  <th className="px-6 py-4">อุปกรณ์ที่ยืม</th>
                  <th className="px-6 py-4">ผู้ยืม</th>
                  <th className="px-6 py-4">วันที่ทำรายการ</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4 text-center">ใบเสร็จ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">ไม่พบประวัติการทำรายการในระบบ</td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const initials = req.users?.display_name
                      ? req.users.display_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'U';
                    
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-sky-600">
                          {req.request_no}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{req.assets?.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{req.assets?.asset_tag}</div>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2 mt-1 border-none">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden">
                            {req.users?.profile_image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={req.users.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-700">{req.users?.display_name || 'ไม่ทราบชื่อ'}</div>
                            <div className="text-[10px] text-slate-400">{req.users?.department || ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {formatDate(req.created_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => setPrintSlip(req)}
                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-sky-600 transition-colors cursor-pointer"
                            title="พิมพ์ใบรับมอบ/รับคืน"
                          >
                            <Printer size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        ) : (
          <section className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="px-6 py-4">วันเวลา</th>
                  <th className="px-6 py-4">ผู้ดำเนินการ</th>
                  <th className="px-6 py-4 text-center">รหัสพัสดุ</th>
                  <th className="px-6 py-4">กิจกรรม</th>
                  <th className="px-6 py-4">รายละเอียดกิจกรรม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">ไม่พบบันทึกกิจกรรมระบบ</td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                        {formatDate(log.created_at)} <span className="text-[10px] text-slate-400 block mt-0.5">{log.created_at.slice(11, 19)}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {log.changed_by}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {log.asset_tag_snapshot ? (
                          <span className="bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded font-bold text-xs">
                            {log.asset_tag_snapshot}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.action === 'CREATE_ASSET' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          log.action === 'DELETE_ASSET' ? 'bg-red-100 text-red-700 border border-red-200' :
                          log.action === 'APPROVE_REQUEST' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">
                        {log.change_summary}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Mobile Cards View */}
        {activeTab === 'history' ? (
          <section className="lg:hidden space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                ไม่มีประวัติทำรายการ
              </div>
            ) : (
              filteredRequests.map((req) => {
                const initials = req.users?.display_name
                  ? req.users.display_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'U';

                return (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-sky-600">{req.request_no}</span>
                      {getStatusBadge(req.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">{req.assets?.name}</h3>
                      <p className="text-xs text-slate-400">Tag ID: {req.assets?.asset_tag}</p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 mt-1">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold border border-slate-200 overflow-hidden shrink-0">
                        {req.users?.profile_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={req.users.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-700 truncate">{req.users?.display_name}</div>
                        <div className="text-[10px] text-slate-400">{req.users?.department || 'ไม่มีข้อมูลแผนก'}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="text-[10px] text-slate-400 font-medium">
                          {formatDate(req.created_at)}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPrintSlip(req)}
                          className="text-[10px] text-slate-500 hover:text-sky-600 flex items-center gap-1 border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                        >
                          <Printer size={10} /> ใบเสร็จ
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        ) : (
          <section className="lg:hidden space-y-4">
            {filteredAuditLogs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                ไม่มีบันทึกกิจกรรมระบบ
              </div>
            ) : (
              filteredAuditLogs.map((log) => (
                <div key={log.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.action === 'CREATE_ASSET' ? 'bg-emerald-100 text-emerald-700' :
                      log.action === 'DELETE_ASSET' ? 'bg-red-100 text-red-700' :
                      log.action === 'APPROVE_REQUEST' ? 'bg-sky-100 text-sky-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{formatDate(log.created_at)} {log.created_at.slice(11, 16)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium"><span className="font-bold text-slate-400">ผู้ดำเนินการ:</span> {log.changed_by}</p>
                    {log.asset_tag_snapshot && (
                      <p className="text-[11px] text-slate-500 font-medium"><span className="font-bold text-slate-400">รหัสอุปกรณ์:</span> <span className="text-sky-600 font-bold bg-sky-50 px-1 py-0.2 rounded text-[10px]">{log.asset_tag_snapshot}</span></p>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-1 text-xs text-slate-700 font-semibold leading-relaxed">
                    {log.change_summary}
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      {/* Printable Receipt Modal (Feature 5) */}
      {printSlip && (
        <ConfirmModal
          isOpen={!!printSlip}
          title="ใบส่งมอบ / รับคืนอุปกรณ์ไอทีดิจิทัล"
          confirmLabel="พิมพ์เอกสาร / บันทึก PDF"
          confirmVariant="primary"
          onConfirm={() => {
            if (typeof window !== 'undefined') {
              window.print();
            }
          }}
          onCancel={() => setPrintSlip(null)}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500 no-print">
              กดปุ่มด้านล่างเพื่อสั่งพิมพ์หรือบันทึกหน้าเอกสารนี้เป็นไฟล์ PDF ลงเครื่องคอมพิวเตอร์ของคุณ
            </p>
            
            {/* Skeuomorphic Digital Slip Container */}
            <div 
              id="print-receipt-slip"
              className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 font-mono text-slate-800 relative shadow-inner"
            >
              {/* CSS Print Styles */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #print-receipt-slip, #print-receipt-slip * {
                    visibility: visible !important;
                  }
                  #print-receipt-slip {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                }
              `}</style>

              {/* Watermark Logo */}
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none no-print">
                <FileText size={120} />
              </div>

              {/* Header */}
              <div className="text-center border-b border-slate-200 pb-4 mb-4">
                <h3 className="text-sm font-bold tracking-widest text-slate-700 uppercase">TRR GROUP ITAM SYSTEM</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">IT Asset Management & Logistics Slip</p>
                <div className="text-[11px] font-bold text-sky-600 bg-sky-50 border border-sky-100 rounded px-2 py-0.5 inline-block mt-2">
                  เลขใบงาน: {printSlip.request_no}
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">ประเภทเอกสาร</span>
                  <span className="font-bold text-slate-700">
                    {printSlip.status === 'returned' ? 'ใบรับคืนอุปกรณ์ (Check In Slip)' : 'ใบส่งมอบอุปกรณ์ (Hand Over Slip)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">สถานะใบงาน</span>
                  <span className="font-bold text-slate-700">
                    {printSlip.status === 'returned' ? 'คืนแล้ว (Returned)' : printSlip.status === 'borrowed' ? 'กำลังยืม (Borrowed)' : 'อนุมัติแล้ว (Approved)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">วันที่ทำรายการ</span>
                  <span className="font-semibold text-slate-600">{formatDate(printSlip.created_at)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">กำหนดคืนอุปกรณ์</span>
                  <span className="font-semibold text-slate-600">
                    {formatDate(printSlip.due_date || printSlip.requested_due_date)}
                  </span>
                </div>
              </div>

              {/* Borrower Section */}
              <div className="space-y-1 text-xs border-b border-slate-100 pb-4 mb-4">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">ข้อมูลผู้ยืม (Borrower Profile)</span>
                <div className="font-bold text-slate-700">{printSlip.users?.display_name}</div>
                <div className="text-slate-500 text-[11px]">
                  แผนก: {printSlip.users?.department || 'IT'} &middot; สังกัดบริษัท: <span className="font-bold text-sky-600">{printSlip.users?.subsidiary || 'PS'}</span>
                </div>
                <div className="text-slate-400 text-[10px]">อีเมล: {printSlip.users?.email}</div>
              </div>

              {/* Asset Section */}
              <div className="space-y-2 text-xs border-b border-slate-100 pb-4 mb-4">
                <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">รายละเอียดพัสดุไอที (Asset Inventory)</span>
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-[13px]">{printSlip.assets?.name}</span>
                    <span className="bg-sky-100 text-sky-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                      {printSlip.assets?.asset_tag}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-500">
                    <div>ยี่ห้อ: {printSlip.assets?.brand || '-'}</div>
                    <div>รุ่น: {printSlip.assets?.model || '-'}</div>
                    <div className="col-span-2">Serial No: <span className="font-bold text-slate-700">{printSlip.assets?.serial_number || '-'}</span></div>
                    <div>สภาพตอนรับมอบ: <span className="font-bold text-slate-700">{printSlip.assets?.condition === 'new' ? 'ใหม่' : 'ดี'}</span></div>
                    {printSlip.returned_at && (
                      <div className="col-span-2 text-emerald-600 font-bold border-t border-slate-200/60 pt-1.5 mt-1">
                        สภาพตอนรับคืน: {printSlip.return_condition_note || 'ปกติ'} (คืนเมื่อ {formatDate(printSlip.returned_at)})
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1 text-xs border-b border-slate-100 pb-4 mb-5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">วัตถุประสงค์การยืม</span>
                <p className="text-slate-600 italic">"{printSlip.reason || 'ไม่มีระบุ'}"</p>
              </div>

              {/* Sign-off Fields */}
              <div className="grid grid-cols-2 gap-4 text-center text-[10px] pt-4">
                <div className="space-y-10">
                  <div className="text-slate-400">ลงชื่อผู้ยืม / รับมอบของ</div>
                  <div className="border-b border-slate-300 w-3/4 mx-auto" />
                  <div className="text-slate-500">({printSlip.users?.display_name})</div>
                  <div className="text-slate-400 text-[9px]">วันที่: ____/____/____</div>
                </div>
                <div className="space-y-10">
                  <div className="text-slate-400">ลงชื่อเจ้าหน้าที่ไอที / ผู้ส่งมอบ</div>
                  <div className="border-b border-slate-300 w-3/4 mx-auto" />
                  <div className="text-slate-500">(IT Administrator)</div>
                  <div className="text-slate-400 text-[9px]">วันที่: ____/____/____</div>
                </div>
              </div>

              {/* Footer barcode decoration */}
              <div className="text-center mt-6 pt-4 border-t border-slate-100">
                <div className="inline-block tracking-widest font-mono text-[9px] text-slate-300 select-none">
                  ||||| | ||||| | ||| |||| | | ||| | ||| | |||
                </div>
                <p className="text-[9px] text-slate-300 mt-1 uppercase">Generated via ITAM System &middot; Secure Handover</p>
              </div>
            </div>
          </div>
        </ConfirmModal>
      )}

      <BottomNav variant="admin" />
    </div>
  );
}
