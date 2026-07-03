'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/material-icon';
import { BottomNav } from '@/components/bottom-nav';
import { SearchInput } from '@/components/search-input';
import { FilterPills } from '@/components/filter-pills';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockAssets } from '@/lib/mock-data';
import { Asset, AssetStatus } from '@/lib/database.types';

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

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState(mockAssets.filter(a => !a.deleted_at));
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deleteModal, setDeleteModal] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (selectedStatus !== 'all' && asset.status !== selectedStatus) return false;
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
  }, [assets, search, selectedStatus]);

  const handleDelete = () => {
    if (!deleteModal) return;
    setAssets((prev) => prev.filter((a) => a.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const canDelete = (asset: Asset) => !['borrowed', 'overdue'].includes(asset.status);
  const isDamaged = (asset: Asset) => asset.status === 'damaged';

  return (
    <div className="pb-24">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-margin-mobile h-16 max-w-2xl mx-auto lg:max-w-none lg:px-8 left-0 right-0 lg:max-w-none lg:left-64">
        <div className="flex items-center gap-stack-md">
          <Link href="/admin" className="text-on-surface p-1">
            <MaterialIcon icon="arrow_back" />
          </Link>
          <h1 className="font-headline-md text-title-lg font-bold text-on-surface">จัดการอุปกรณ์</h1>
        </div>
        <Link href="/admin/categories" className="text-on-surface-variant p-1" title="จัดการหมวดหมู่">
          <MaterialIcon icon="category" />
        </Link>
      </header>

      <main className="pt-16 px-margin-mobile max-w-2xl mx-auto lg:max-w-none lg:px-8">
        <section className="py-stack-lg sticky top-16 bg-background z-40">
          <SearchInput
            placeholder="ค้นหาชื่อ, Tag ID, Serial..."
            value={search}
            onChange={setSearch}
          />
          <FilterPills options={statusFilters} selected={selectedStatus} onSelect={setSelectedStatus} />
        </section>

        <section className="space-y-stack-sm">
          {filteredAssets.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <MaterialIcon icon="inventory_2" size={48} className="mb-stack-sm opacity-50" />
              <p>ไม่พบอุปกรณ์</p>
            </div>
          )}
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className={`rounded-xl p-stack-md flex items-center gap-stack-md ${
                isDamaged(asset)
                  ? 'border border-error/30 bg-error/5'
                  : 'border border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  isDamaged(asset)
                    ? 'bg-error/10 text-error'
                    : asset.status === 'available'
                    ? 'bg-primary-container text-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <MaterialIcon icon={asset.asset_categories?.icon || 'devices'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-title-lg text-title-lg text-on-surface truncate">{asset.name}</h3>
                  <StatusBadge status={asset.status} variant="asset" />
                </div>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  {asset.asset_tag} &middot; {asset.asset_categories?.name} &middot; สภาพ: {conditionLabels[asset.condition] || asset.condition}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Link
                  href={`/admin/assets/${asset.id}/edit`}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
                  title="แก้ไข"
                >
                  <MaterialIcon icon="edit" size={20} />
                </Link>
                {canDelete(asset) ? (
                  <button
                    onClick={() => setDeleteModal(asset)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-error hover:bg-error/10"
                    title="ลบ"
                  >
                    <MaterialIcon icon="delete" size={20} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-9 h-9 rounded-full flex items-center justify-center text-outline-variant"
                    title="ลบไม่ได้ ขณะถูกยืมอยู่"
                  >
                    <MaterialIcon icon="delete" size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* FAB */}
      <Link
        href="/admin/assets/new"
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform z-50"
      >
        <MaterialIcon icon="add" />
      </Link>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="ยืนยันการลบอุปกรณ์?"
        description="อุปกรณ์นี้จะถูกซ่อนจากรายการยืม แต่ประวัติการยืม-คืนเดิมจะยังเก็บไว้ (soft delete) ไม่สามารถลบอุปกรณ์ที่กำลังถูกยืมอยู่ได้"
        confirmLabel="ลบอุปกรณ์"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />

      <BottomNav variant="admin" />
    </div>
  );
}
