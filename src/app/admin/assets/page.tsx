'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockAssets, mockBorrowRequests } from '@/lib/mock-data';
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
  Layers,
  Download,
  QrCode,
  History,
  Upload
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
  const [qrModalAsset, setQrModalAsset] = useState<Asset | null>(null);
  const [historyModalAsset, setHistoryModalAsset] = useState<Asset | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importPreviewAssets, setImportPreviewAssets] = useState<any[]>([]);

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

  const handleExportCSV = () => {
    const header = ['รหัสอุปกรณ์ (Asset Tag)', 'ชื่ออุปกรณ์', 'หมวดหมู่', 'ยี่ห้อ', 'รุ่น', 'Serial Number', 'สถานะ', 'สภาพ', 'จุดจัดเก็บ (Location)', 'บริษัท (Subsidiary)', 'แผนก (Department)', 'วันที่ซื้อ', 'ราคา (บาท)'];
    const rows = filteredAssets.map(asset => [
      asset.asset_tag,
      asset.name,
      asset.asset_categories?.name || '',
      asset.brand || '',
      asset.model || '',
      asset.serial_number || '',
      asset.status,
      asset.condition,
      asset.location || '',
      asset.subsidiary || '',
      asset.department || 'ส่วนกลาง',
      asset.purchase_date || '',
      asset.purchase_price || ''
    ]);
    
    const csvContent = "\uFEFF" + [header.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ITAM_Assets_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setAssets((prev) => prev.filter((a) => a.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const simulateCsvUpload = () => {
    const demoImports = [
      {
        id: `asset-import-${Date.now()}-1`,
        asset_tag: 'TAG-99120-LX',
        name: 'Lenovo ThinkPad L14',
        category_id: 'cat-01',
        brand: 'Lenovo',
        model: 'ThinkPad L14 Gen 4',
        serial_number: 'LNV-TP-99120',
        status: 'available' as const,
        condition: 'new' as const,
        purchase_date: new Date().toISOString().slice(0, 10),
        purchase_price: 32000,
        vendor: 'Lenovo Thailand',
        warranty_expiry_date: '2029-07-04',
        location: 'คลัง IT ชั้น 22',
        subsidiary: 'PS',
        image_url: null,
        notes: 'นำเข้าด้วยไฟล์ CSV (Bulk Import)',
        is_borrowable: true,
        deleted_at: null,
        created_by: 'admin-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        asset_categories: { id: 'cat-01', name: 'Notebook', icon: 'laptop_mac', is_active: true, created_at: '', updated_at: '' },
      },
      {
        id: `asset-import-${Date.now()}-2`,
        asset_tag: 'TAG-99121-LX',
        name: 'HP EliteBook 840',
        category_id: 'cat-01',
        brand: 'HP',
        model: 'EliteBook 840 G10',
        serial_number: 'HP-EB-99121',
        status: 'available' as const,
        condition: 'new' as const,
        purchase_date: new Date().toISOString().slice(0, 10),
        purchase_price: 36500,
        vendor: 'HP Online',
        warranty_expiry_date: '2029-07-04',
        location: 'คลัง IT ชั้น 22',
        subsidiary: 'TRR Corp',
        image_url: null,
        notes: 'นำเข้าด้วยไฟล์ CSV (Bulk Import)',
        is_borrowable: true,
        deleted_at: null,
        created_by: 'admin-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        asset_categories: { id: 'cat-01', name: 'Notebook', icon: 'laptop_mac', is_active: true, created_at: '', updated_at: '' },
      }
    ];
    setImportPreviewAssets(demoImports);
  };

  const confirmImport = () => {
    if (importPreviewAssets.length === 0) return;
    setAssets((prev) => [...importPreviewAssets, ...prev]);
    setImportPreviewAssets([]);
    setImportModalOpen(false);
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
          {/* Search Input & Export Button */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="ค้นหาชื่ออุปกรณ์, Tag ID, Serial Number..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer shrink-0"
              title="นำเข้าอุปกรณ์จากไฟล์ CSV"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">นำเข้า CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 hover:bg-sky-100 text-sky-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer shrink-0"
              title="ส่งออกรายงานเป็นไฟล์ CSV"
            >
              <Download size={16} />
              <span className="hidden sm:inline">ส่งออก CSV</span>
            </button>
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
                  <button
                    onClick={() => setQrModalAsset(asset)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="พิมพ์ป้ายสติกเกอร์ QR Code"
                  >
                    <QrCode size={16} />
                  </button>

                  <button
                    onClick={() => setHistoryModalAsset(asset)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="ประวัติการยืมอุปกรณ์"
                  >
                    <History size={16} />
                  </button>

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

      {/* QR Code Printable Tag Modal */}
      {qrModalAsset && (
        <ConfirmModal
          isOpen={!!qrModalAsset}
          title="พิมพ์ป้ายสติกเกอร์ QR Code อุปกรณ์"
          confirmLabel="สั่งพิมพ์ฉลาก (Label Print)"
          confirmVariant="primary"
          onConfirm={() => {
            if (typeof window !== 'undefined') {
              window.print();
            }
          }}
          onCancel={() => setQrModalAsset(null)}
        >
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-500 no-print">
              ใช้เครื่องพิมพ์สติกเกอร์ฉลากอเนกประสงค์เพื่อนำไปติดด้านหลังโน้ตบุ๊กหรือแท็บเล็ตจริงในองค์กร
            </p>
            
            {/* Skeuomorphic Asset Label */}
            <div 
              id="print-qr-label"
              className="bg-white border-2 border-slate-300 rounded-lg p-5 w-72 mx-auto text-slate-800 text-left font-mono relative shadow-md"
            >
              {/* CSS Print Styles */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #print-qr-label, #print-qr-label * {
                    visibility: visible !important;
                  }
                  #print-qr-label {
                    position: absolute !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                }
              `}</style>
              
              <div className="flex gap-3 items-center">
                {/* QR Code SVG */}
                <div className="shrink-0">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 border border-slate-200 p-1 bg-white rounded">
                    <rect width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="9" y="9" width="17" height="17" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="black" />
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="74" y="9" width="17" height="17" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="black" />
                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="9" y="74" width="17" height="17" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="black" />
                    <rect x="75" y="75" width="10" height="10" fill="black" />
                    <rect x="77" y="77" width="6" height="6" fill="white" />
                    <rect x="79" y="79" width="2" height="2" fill="black" />
                    <rect x="35" y="5" width="5" height="10" fill="black" />
                    <rect x="45" y="10" width="10" height="5" fill="black" />
                    <rect x="60" y="5" width="5" height="20" fill="black" />
                    <rect x="35" y="20" width="15" height="5" fill="black" />
                    <rect x="5" y="35" width="10" height="5" fill="black" />
                    <rect x="20" y="35" width="5" height="15" fill="black" />
                    <rect x="10" y="55" width="15" height="5" fill="black" />
                    <rect x="35" y="35" width="30" height="30" fill="black" />
                    <rect x="40" y="40" width="20" height="20" fill="white" />
                    <rect x="45" y="45" width="10" height="10" fill="black" />
                    <rect x="70" y="35" width="5" height="15" fill="black" />
                    <rect x="80" y="45" width="15" height="5" fill="black" />
                    <rect x="75" y="55" width="10" height="10" fill="black" />
                    <rect x="35" y="70" width="15" height="5" fill="black" />
                    <rect x="55" y="70" width="5" height="15" fill="black" />
                    <rect x="45" y="80" width="20" height="10" fill="black" />
                    <rect x="5" y="90" width="90" height="5" fill="black" />
                  </svg>
                </div>
                
                {/* Details text */}
                <div className="text-[10px] space-y-1 min-w-0 flex-1">
                  <div className="font-bold text-slate-400 uppercase tracking-widest text-[8px]">PROPERTY OF</div>
                  <div className="font-bold text-slate-800 text-[11px] truncate">{qrModalAsset.subsidiary === 'PS' ? 'PS CO., LTD.' : 'TRR CORP.'}</div>
                  <div className="text-sky-600 font-bold text-xs mt-0.5">{qrModalAsset.asset_tag}</div>
                  <div className="text-slate-500 font-semibold truncate mt-0.5">{qrModalAsset.name}</div>
                  <div className="text-[9px] text-slate-400 truncate">S/N: {qrModalAsset.serial_number || '-'}</div>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[8px] text-slate-300">
                <span>IT ASSET MANAGEMENT SYSTEM</span>
                <span className="font-bold text-slate-400">STATUS: {qrModalAsset.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </ConfirmModal>
      )}

      {/* Individual Asset Borrow History Modal */}
      {historyModalAsset && (() => {
        const historyList = mockBorrowRequests.filter(r => r.asset_id === historyModalAsset.id);
        
        return (
          <ConfirmModal
            isOpen={!!historyModalAsset}
            title={`ประวัติการยืมเครื่อง: ${historyModalAsset.name}`}
            confirmLabel="ตกลง"
            confirmVariant="primary"
            onConfirm={() => setHistoryModalAsset(null)}
            onCancel={() => setHistoryModalAsset(null)}
          >
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-700">รหัสอุปกรณ์: <span className="text-sky-600">{historyModalAsset.asset_tag}</span></div>
                <div className="text-slate-500 mt-1">ซีเรียลนัมเบอร์: {historyModalAsset.serial_number || '-'}</div>
              </div>
              
              {historyList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  ไม่มีประวัติการยืม-คืนสำหรับอุปกรณ์ชิ้นนี้ในระบบ
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-5">
                  {historyList.map((log) => (
                    <div key={log.id} className="relative text-xs">
                      {/* Circle Indicator */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-sky-500 shadow-sm" />
                      
                      <div className="font-bold text-slate-700 flex items-center justify-between">
                        <span>ใบงาน: {log.request_no}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          log.status === 'returned' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {log.status === 'returned' ? 'คืนแล้ว' : 'กำลังยืม'}
                        </span>
                      </div>
                      
                      <div className="text-slate-500 mt-1">
                        ผู้ยืม: <span className="font-bold text-slate-700">{log.users?.display_name}</span> &middot; แผนก: {log.users?.department || 'IT'}
                      </div>
                      <div className="text-slate-400 text-[10px] mt-0.5">
                        ยืมเมื่อ: {new Date(log.created_at).toLocaleDateString('th-TH')} 
                        {log.returned_at && ` | คืนเมื่อ: ${new Date(log.returned_at).toLocaleDateString('th-TH')}`}
                      </div>
                      {log.return_condition_note && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-1 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/50">
                          สภาพตอนคืน: {log.return_condition_note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ConfirmModal>
        );
      })()}

      {/* Bulk CSV Import Portal Modal */}
      {importModalOpen && (
        <ConfirmModal
          isOpen={importModalOpen}
          title="นำเข้าคลังอุปกรณ์ผ่านไฟล์ CSV"
          confirmLabel={importPreviewAssets.length > 0 ? "ยืนยันนำเข้าทั้งหมด" : "จำลองการอัปโหลดไฟล์"}
          confirmVariant="primary"
          onConfirm={importPreviewAssets.length > 0 ? confirmImport : simulateCsvUpload}
          onCancel={() => {
            setImportModalOpen(false);
            setImportPreviewAssets([]);
          }}
        >
          <div className="space-y-4">
            {importPreviewAssets.length === 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  ดาวน์โหลดไฟล์เทมเพลต Excel/CSV จากนั้นระบุข้อมูล รายการโน้ตบุ๊ก อะแดปเตอร์ หรือมอนิเตอร์ แล้วนำมาวางอัปโหลดที่นี่เพื่อเพิ่มอุปกรณ์เข้าคลังพร้อมกันคราวละหลายเครื่อง
                </p>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer" onClick={simulateCsvUpload}>
                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-600 block">ลากและวางไฟล์ CSV หรือคลิกเพื่ออัปโหลด</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">รองรับไฟล์สกุล .csv, .xlsx (ขนาดสูงสุด 5MB)</span>
                </div>
                <div className="text-center">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert('ดาวน์โหลดเทมเพลต CSV สำเร็จ!'); }}
                    className="text-[11px] font-bold text-sky-600 hover:underline"
                  >
                    📥 ดาวน์โหลดไฟล์เทมเพลตสำหรับนำเข้า (.csv)
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>ตัวอย่างข้อมูลพัสดุที่พบในไฟล์ (2 เครื่อง)</span>
                  <span className="text-emerald-600">✔ ตรวจสอบรูปแบบผ่าน</span>
                </div>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase">
                        <th className="p-2">Tag ID</th>
                        <th className="p-2">ชื่ออุปกรณ์</th>
                        <th className="p-2">ยี่ห้อ/รุ่น</th>
                        <th className="p-2">บริษัท</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {importPreviewAssets.map((asset, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-sky-600">{asset.asset_tag}</td>
                          <td className="p-2 font-semibold text-slate-700">{asset.name}</td>
                          <td className="p-2">{asset.brand} {asset.model}</td>
                          <td className="p-2 font-bold">{asset.subsidiary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  หากยืนยัน อุปกรณ์ทั้งหมดจะถูกเพิ่มเข้าไปยังฐานข้อมูล และสามารถให้บริการยืมสำหรับพนักงานในบริษัทนั้นๆ ได้ทันที
                </p>
              </div>
            )}
          </div>
        </ConfirmModal>
      )}

      <BottomNav variant="admin" />
    </div>
  );
}
