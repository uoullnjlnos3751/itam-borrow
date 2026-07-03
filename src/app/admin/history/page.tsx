'use client';

import { useState, useMemo } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { FilterPills } from '@/components/filter-pills';
import { StatusBadge } from '@/components/status-badge';
import { MaterialIcon } from '@/components/material-icon';
import { mockBorrowRequests } from '@/lib/mock-data';

const filterOptions = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'กำลังยืม', value: 'borrowed' },
  { label: 'รออนุมัติ', value: 'pending' },
  { label: 'คืนแล้ว', value: 'returned' },
];

export default function AdminHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'all') return mockBorrowRequests;
    return mockBorrowRequests.filter((r) => r.status === selectedFilter);
  }, [selectedFilter]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="pb-24">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center px-margin-mobile h-16 max-w-2xl mx-auto lg:max-w-none lg:px-8 left-0 right-0 lg:max-w-none lg:left-64">
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">
          ประวัติการยืม-คืนทั้งหมด
        </h1>
      </header>

      <main className="pt-16 px-margin-mobile max-w-2xl mx-auto lg:max-w-none lg:px-8">
        <section className="py-stack-lg sticky top-16 bg-background z-40">
          <FilterPills options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
        </section>

        <section className="space-y-stack-sm">
          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <MaterialIcon icon="history" size={48} className="mb-stack-sm opacity-50" />
              <p>ไม่มีประวัติ</p>
            </div>
          )}
          {filteredRequests.map((req) => {
            const isInactive = req.status === 'returned' || req.status === 'rejected' || req.status === 'cancelled';
            return (
              <div key={req.id} className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md ${isInactive ? 'opacity-70' : ''}`}>
                <div className="flex justify-between items-start mb-stack-xs">
                  <h3 className="font-title-lg text-title-lg text-on-surface">{req.assets?.name}</h3>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  {req.request_no} &middot; {req.assets?.asset_tag} &middot; {req.users?.display_name}
                </p>
                <div className="flex justify-between items-center mt-stack-sm pt-stack-sm border-t border-outline-variant">
                  <span className="text-body-sm text-on-surface-variant">สร้างเมื่อ</span>
                  <span className="text-body-sm font-medium text-on-surface">{formatDate(req.created_at)}</span>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <BottomNav variant="admin" />
    </div>
  );
}
