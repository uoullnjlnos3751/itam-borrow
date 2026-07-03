'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { SearchInput } from '@/components/search-input';
import { FilterPills } from '@/components/filter-pills';
import { StatusBadge } from '@/components/status-badge';
import { mockAssets, mockCategories } from '@/lib/mock-data';
import Link from 'next/link';

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
      // Only show available, borrowable, non-deleted
      if (asset.deleted_at) return false;
      const isAvailable = asset.status === 'available' && asset.is_borrowable;
      
      if (user?.role !== 'admin' && !isAvailable) {
        return false;
      }

      if (selectedCategory !== 'all' && asset.category_id !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          asset.name.toLowerCase().includes(q) ||
          asset.asset_tag.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedCategory]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="pb-24">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
        <div className="flex items-center gap-stack-md">
          <MaterialIcon icon="devices" className="text-primary p-2" />
          <h1 className="font-headline-md text-title-lg font-bold text-primary">ยืมอุปกรณ์ IT</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-body-sm font-bold">
          {user?.display_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
        </div>
      </header>

      <main className="pt-16 px-margin-mobile max-w-2xl mx-auto">
        <section className="py-stack-lg sticky top-16 bg-background z-40">
          <SearchInput
            placeholder="ค้นหาชื่ออุปกรณ์ หรือ Tag ID..."
            value={search}
            onChange={setSearch}
          />
          <FilterPills
            options={categoryOptions}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        <section className="space-y-stack-sm">
          {filteredAssets.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <MaterialIcon icon="search_off" size={48} className="mb-stack-sm opacity-50" />
              <p>ไม่พบอุปกรณ์ที่ตรงกับคำค้นหา</p>
            </div>
          )}
          {filteredAssets.map((asset) => {
            const isAvailable = asset.status === 'available' && asset.is_borrowable;
            return (
              <div
                key={asset.id}
                className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md flex items-center gap-stack-md ${
                  !isAvailable ? 'opacity-60' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    isAvailable
                      ? 'bg-primary-container text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <MaterialIcon icon={asset.asset_categories?.icon || 'devices'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-title-lg text-title-lg text-on-surface truncate">
                      {asset.name}
                    </h3>
                    <StatusBadge status={asset.status} variant="asset" />
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    {asset.asset_tag} &middot; {asset.asset_categories?.name}
                  </p>
                </div>
                {isAvailable ? (
                  <Link
                    href={`/assets/${asset.id}/request`}
                    className="shrink-0 bg-primary text-on-primary text-label-md font-label-md px-4 py-2 rounded-full active:scale-95 transition-transform"
                  >
                    ยืม
                  </Link>
                ) : (
                  <button
                    disabled
                    className="shrink-0 bg-surface-container text-on-surface-variant text-label-md font-label-md px-4 py-2 rounded-full"
                  >
                    ยืม
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <BottomNav variant="user" />
    </div>
  );
}
