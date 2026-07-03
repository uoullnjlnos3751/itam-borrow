'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { mockAssets } from '@/lib/mock-data';

export default function RequestPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [dueDate, setDueDate] = useState('');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const asset = mockAssets.find((a) => a.id === params.id);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async () => {
    if (!dueDate || !reason) return;
    setSubmitting(true);
    // Mock submit
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => router.push('/history'), 1500);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">ไม่พบอุปกรณ์ที่ระบุ</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-stack-lg">
          <MaterialIcon icon="check_circle" className="text-primary" size={40} />
        </div>
        <h2 className="text-title-lg font-title-lg text-on-surface mb-stack-xs">ส่งคำขอยืมเรียบร้อยแล้ว</h2>
        <p className="text-body-sm text-on-surface-variant">รอแอดมิน IT พิจารณาอนุมัติ...</p>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center gap-stack-md px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
        <button onClick={() => router.back()} className="text-on-surface p-1">
          <MaterialIcon icon="arrow_back" />
        </button>
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">แบบฟอร์มขอยืมอุปกรณ์</h1>
      </header>

      <main className="pt-20 px-margin-mobile max-w-2xl mx-auto space-y-stack-lg">
        {/* Asset info card */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md flex items-center gap-stack-md">
          <div className="w-14 h-14 rounded-lg bg-primary-container flex items-center justify-center text-primary shrink-0">
            <MaterialIcon icon={asset.asset_categories?.icon || 'devices'} />
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface">{asset.name}</h3>
            <p className="text-body-sm text-on-surface-variant">
              {asset.asset_tag} &middot; {asset.asset_categories?.name}
            </p>
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">
            วันที่ต้องการคืน (ยืมได้สูงสุด 7 วัน)
          </label>
          <input
            type="date"
            value={dueDate}
            min={today}
            max={maxDateStr}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">
            เหตุผลการยืม
          </label>
          <textarea
            rows={4}
            placeholder="เช่น ใช้สำหรับพรีเซนต์งานที่ลูกค้า วันที่ 8 ก.ค. 2569"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">
            สถานที่ใช้งาน
          </label>
          <input
            type="text"
            placeholder="เช่น Head Office, ชั้น 22"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md"
          />
        </div>

        {/* Info banner */}
        <div className="rounded-xl bg-primary-container/40 border border-primary/20 p-stack-md flex gap-stack-sm items-start">
          <MaterialIcon icon="info" className="text-primary shrink-0" size={20} />
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            คำขอของคุณจะถูกส่งไปยังแอดมิน IT เพื่อพิจารณาอนุมัติ
            คุณจะได้รับอีเมลแจ้งผลเมื่อคำขอได้รับการอนุมัติหรือปฏิเสธ
          </p>
        </div>
      </main>

      {/* Fixed bottom submit */}
      <div className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-margin-mobile">
        <button
          onClick={handleSubmit}
          disabled={!dueDate || !reason || submitting}
          className="w-full bg-primary text-on-primary text-body-lg font-medium py-3.5 rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-stack-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="animate-spin w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full" />
          ) : (
            <>
              <MaterialIcon icon="send" size={20} />
              ส่งคำขอยืม
            </>
          )}
        </button>
      </div>
    </div>
  );
}
