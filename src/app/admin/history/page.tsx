'use client';

import { useState, useMemo } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { mockBorrowRequests } from '@/lib/mock-data';
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
  Inbox
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
        {/* Search & Filter pills */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาชื่ออุปกรณ์, รหัสรายการ, หรือชื่อผู้ยืม..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Options */}
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
        </section>

        {/* Desktop Table View */}
        <section className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="px-6 py-4">รหัสรายการ</th>
                <th className="px-6 py-4">อุปกรณ์ที่ยืม</th>
                <th className="px-6 py-4">ผู้ยืม</th>
                <th className="px-6 py-4">วันที่ทำรายการ</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">ไม่พบประวัติการทำรายการในระบบ</td>
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        {/* Mobile Cards View */}
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
                    <div className="text-[10px] text-slate-400 font-medium text-right shrink-0">
                      {formatDate(req.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <BottomNav variant="admin" />
    </div>
  );
}
