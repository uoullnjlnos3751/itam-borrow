'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockAssets } from '@/lib/mock-data';
import { Asset } from '@/lib/database.types';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Laptop, 
  Monitor, 
  Printer, 
  Video, 
  Wifi, 
  Smartphone, 
  Mouse, 
  Cable, 
  Package, 
  Layers
} from 'lucide-react';

const statusFilters = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'ว่าง', value: 'available' },
  { label: 'ถูกยืม', value: 'borrowed' },
  { label: 'ซ่อมบำรุง', value: 'maintenance' },
  { label: 'ชำรุด', value: 'damaged' },
  { label: 'สูญหาย', value: 'lost' },
  { label: 'ปลดระวาง', value: 'retired' },
];

const conditionLabels: Record<string, string> = {
  new: 'ใหม่',
  good: 'ดี',
  fair: 'พอใช้',
  poor: 'แย่',
};

const subsidiaryFilters = [
  { label: 'ทุกบริษัท', value: 'all' },
  { label: 'PS', value: 'PS' },
  { label: 'TRR Corp', value: 'TRR Corp' },
  { label: 'SSEC', value: 'SSEC' },
  { label: 'TRRP', value: 'TRRP' },
];

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState(mockAssets.filter(a => !a.deleted_at));
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [deleteModal, setDeleteModal] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (selectedStatus !== 'all' && asset.status !== selectedStatus) return false;
      if (selectedSubsidiary !== 'all' && asset.subsidiary !== selectedSubsidiary) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          asset.name.toLowerCase().includes(q) ||
          asset.asset_tag.toLowerCase().includes(q) ||
          (asset.serial_number && asset.serial_number.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [assets, search, selectedStatus, selectedSubsidiary]);

  const handleDelete = () => {
    if (!deleteModal) return;
    setAssets((prev) => prev.filter((a) => a.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const canDelete = (asset: Asset) => !['borrowed', 'overdue'].includes(asset.status);
  const isDamaged = (asset: Asset) => asset.status === 'damaged';

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop_mac':
        return <Laptop size={20} />;
      case 'desktop_windows':
      case 'monitor':
        return <Monitor size={20} />;
      case 'print':
        return <Printer size={20} />;
      case 'videocam':
        return <Video size={20} />;
      case 'router':
        return <Wifi size={20} />;
      case 'smartphone':
        return <Smartphone size={20} />;
      case 'mouse':
        return <Mouse size={20} />;
      case 'cable':
        return <Cable size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ว่าง
          </span>
        );
      case 'borrowed':
        return (
          <span className="bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            กำลังถูกยืม
          </span>
        );
      case 'maintenance':
        return (
          <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ส่งซ่อม
          </span>
        );
      case 'damaged':
        return (
          <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ชำรุด
          </span>
        );
      case 'lost':
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            สูญหาย
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
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-slate-800">จัดการอุปกรณ์</h1>
        </div>

        <Link href="/admin/categories" className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-sm font-semibold" title="จัดการหมวดหมู่">
          <Layers size={18} />
          <span className="hidden sm:inline">หมวดหมู่</span>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        {/* Search & Filters */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาชื่ออุปกรณ์, Tag ID, Serial Number..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สถานะอุปกรณ์</span>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {statusFilters.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    selectedStatus === opt.value
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subsidiary Filters */}
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สังกัดบริษัทเจ้าของ</span>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {subsidiaryFilters.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedSubsidiary(opt.value)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
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
        </section>

        {/* Assets List */}
        <section className="space-y-4">
          {filteredAssets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <Package size={48} className="text-slate-300 mb-4" />
              <div className="font-bold text-slate-700 text-base">ไม่พบอุปกรณ์ในระบบ</div>
              <p className="text-xs text-slate-400 mt-1">กรุณาลองเปลี่ยนเงื่อนไขการค้นหาหรือกดเพิ่มอุปกรณ์ใหม่</p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-slate-300 ${
                  isDamaged(asset) ? 'border-red-200 bg-red-50/10' : 'border-slate-200'
                }`}
              >
                {/* Left section: Icon & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 overflow-hidden ${
                    isDamaged(asset)
                      ? 'bg-red-50 text-red-500 border-red-100'
                      : asset.status === 'available'
                      ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {asset.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset.image_url} alt={asset.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(asset.asset_categories?.icon || '')
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug truncate">
                        {asset.name}
                      </h3>
                      {getStatusBadge(asset.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 font-medium">
                      <span className="text-sky-600 font-semibold">{asset.asset_tag}</span>
                      <span>&middot;</span>
                      <span>{asset.asset_categories?.name}</span>
                      <span>&middot;</span>
                      <span>แผนก: <span className="font-semibold text-slate-500">{asset.department || 'ส่วนกลาง'}</span></span>
                      <span>&middot;</span>
                      <span>สภาพ: {conditionLabels[asset.condition] || asset.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Right section: Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/admin/assets/${asset.id}/edit`}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                    title="แก้ไข"
                  >
                    <Edit size={16} />
                  </Link>

                  {canDelete(asset) ? (
                    <button
                      onClick={() => setDeleteModal(asset)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100 bg-slate-50 cursor-not-allowed"
                      title="ไม่สามารถลบได้ขณะยืมอยู่"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/admin/assets/new"
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-95 transition-transform z-50 cursor-pointer lg:bottom-10 lg:right-10"
        title="เพิ่มอุปกรณ์ใหม่"
      >
        <Plus size={24} />
      </Link>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="ยืนยันการลบอุปกรณ์?"
        description="อุปกรณ์นี้จะถูกซ่อนออกจากคลังรายการยืม แต่ประวัติเดิมในระบบจะไม่หายไป (Soft Delete) คุณสามารถกู้คืนได้ภายหลัง"
        confirmLabel="ยืนยันลบอุปกรณ์"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />

      <BottomNav variant="admin" />
    </div>
  );
}
