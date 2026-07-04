'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { mockAssets, mockCategories } from '@/lib/mock-data';
import Link from 'next/link';
import { 
  Laptop, 
  Monitor, 
  Printer, 
  Video, 
  Wifi, 
  Smartphone, 
  Mouse, 
  Cable, 
  Package, 
  Search,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export default function AssetsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const categoryOptions = useMemo(
    () => [
      { label: 'ทั้งหมด', value: 'all' },
      ...mockCategories
        .filter((c) => c.is_active)
        .map((c) => ({ label: c.name, value: c.id })),
    ],
    []
  );

  const filteredAssets = useMemo(() => {
    return mockAssets.filter((asset) => {
      if (asset.deleted_at) return false;
      const isAvailable = asset.status === 'available' && asset.is_borrowable;
      
      // Restrict normal users to only see assets of their own subsidiary
      if (user?.role !== 'admin' && asset.subsidiary !== user?.subsidiary) {
        return false;
      }

      // Regular users only see available items, admins see all (available or borrowed)
      if (user?.role !== 'admin' && !isAvailable) {
        return false;
      }

      if (selectedCategory !== 'all' && asset.category_id !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          asset.name.toLowerCase().includes(q) ||
          asset.asset_tag.toLowerCase().includes(q) ||
          (asset.brand && asset.brand.toLowerCase().includes(q)) ||
          (asset.model && asset.model.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, selectedCategory, user]);

  // Helper to map category icons to Lucide components
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop_mac':
        return <Laptop size={24} />;
      case 'desktop_windows':
      case 'monitor':
        return <Monitor size={24} />;
      case 'print':
        return <Printer size={24} />;
      case 'videocam':
        return <Video size={24} />;
      case 'router':
        return <Wifi size={24} />;
      case 'smartphone':
        return <Smartphone size={24} />;
      case 'mouse':
        return <Mouse size={24} />;
      case 'cable':
        return <Cable size={24} />;
      default:
        return <Package size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ว่างให้ยืม
          </span>
        );
      case 'borrowed':
        return (
          <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ถูกยืมแล้ว
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const initials = user?.display_name
    ? user.display_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white">
            <Laptop size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">ยืมอุปกรณ์ IT</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">คลังบริษัท: {user?.subsidiary || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-slate-800">{user?.display_name}</div>
            <div className="text-[10px] text-slate-400 font-medium">{user?.email}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 overflow-hidden shrink-0">
            {user?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        {/* Search & Filters */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="ค้นหาชื่ออุปกรณ์ ยี่ห้อ รุ่น หรือ Tag ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Filter Indicator / Button */}
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold px-2">
              <SlidersHorizontal size={16} />
              <span>ตัวกรองตามหมวดหมู่</span>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedCategory(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  selectedCategory === opt.value
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Catalog Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <Package size={48} className="text-slate-300 mb-4" />
              <div className="font-bold text-slate-700 text-base">ไม่พบอุปกรณ์ที่ตรงกับคำค้นหา</div>
              <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่</p>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isAvailable = asset.status === 'available' && asset.is_borrowable;
              return (
                <div
                  key={asset.id}
                  className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-all duration-200 relative group overflow-hidden ${
                    !isAvailable ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <div>
                    {/* Card Header: Icon & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-colors overflow-hidden ${
                        isAvailable 
                          ? 'bg-sky-50 text-sky-500 border-sky-100' 
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {asset.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={asset.image_url} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                          getCategoryIcon(asset.asset_categories?.icon || '')
                        )}
                      </div>
                      {getStatusBadge(asset.status)}
                    </div>

                    {/* Card Body */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-sky-600 transition-colors truncate">
                        {asset.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                          {asset.asset_tag}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          &middot; {asset.asset_categories?.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        ยี่ห้อ/รุ่น: {asset.brand || '-'} {asset.model || ''} <br/>
                        จุดเก็บ: {asset.location || '-'} &middot; แผนกยืม: <span className="font-semibold text-slate-600">{asset.department || 'ส่วนกลาง'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    {isAvailable ? (
                      <Link
                        href={`/assets/${asset.id}/request`}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-sky-500/10 active:scale-[0.98]"
                      >
                        ยืมอุปกรณ์
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-400 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                      >
                        ไม่ว่างให้ยืม
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <BottomNav variant="user" />
    </div>
  );
}
