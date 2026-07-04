'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockAssets } from '@/lib/mock-data';
import { 
  ArrowLeft, CheckCircle2, Calendar, 
  MapPin, FileText, Send, MonitorSmartphone, Info
} from 'lucide-react';

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
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" /></div>;
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">ไม่พบอุปกรณ์ที่ระบุ</p>
      </div>
    );
  }

  // Cross-subsidiary borrow blocking security check
  if (user?.role !== 'admin' && asset.subsidiary !== user?.subsidiary) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shadow-sm mb-4">
          <Info size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          ไม่มีสิทธิ์ยืมอุปกรณ์ต่างบริษัท
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          คุณสังกัดบริษัท <span className="font-semibold text-slate-700">{user?.subsidiary}</span> แต่ต้องการยืมอุปกรณ์ของบริษัท <span className="font-semibold text-slate-700">{asset.subsidiary}</span> ซึ่งระบบไม่สามารถดำเนินการข้ามบริษัทได้
        </p>
        <button
          onClick={() => router.push('/assets')}
          className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm shadow-sky-500/10 active:scale-[0.98]"
        >
          กลับหน้าคลังอุปกรณ์
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
          <CheckCircle2 className="text-emerald-500" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ส่งคำขอยืมเรียบร้อยแล้ว</h2>
        <p className="text-slate-500">ระบบกำลังนำคุณไปยังหน้าประวัติการยืม...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-8 h-16 shadow-sm">
        <div className="max-w-5xl mx-auto w-full flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">แบบฟอร์มขอยืมอุปกรณ์</h1>
        </div>
      </header>

      <main className="pt-8 px-4 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">กรอกข้อมูลการยืม</h2>
              
              <div className="space-y-6">
                {/* Due date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Calendar size={16} className="text-sky-500" />
                    วันที่ต้องการคืน <span className="text-xs text-slate-400 font-normal">(ยืมได้สูงสุด 7 วัน)</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    min={today}
                    max={maxDateStr}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-colors text-sm font-medium text-slate-800"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <MapPin size={16} className="text-sky-500" />
                    สถานที่ใช้งาน
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น Head Office, ชั้น 22"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-colors text-sm text-slate-800"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <FileText size={16} className="text-sky-500" />
                    เหตุผลการยืม
                  </label>
                  <textarea
                    rows={4}
                    placeholder="เช่น ใช้สำหรับพรีเซนต์งานที่ลูกค้า วันที่..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-colors text-sm text-slate-800 resize-none"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop Submit Button */}
            <div className="hidden lg:flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={!dueDate || !reason || submitting}
                className="bg-sky-500 text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-sky-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    ส่งคำขอยืม <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Asset Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">อุปกรณ์ที่เลือก</h3>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 border border-sky-100">
                  <MonitorSmartphone size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 leading-tight mb-1">{asset.name}</h4>
                  <p className="text-xs font-medium text-sky-600 bg-sky-50 inline-block px-2 py-0.5 rounded-md mb-1">{asset.asset_tag}</p>
                  <p className="text-xs text-slate-500">{asset.asset_categories?.name}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  คำขอของคุณจะถูกส่งไปยังแอดมิน IT เพื่อพิจารณาอนุมัติ
                  คุณจะได้รับอีเมลแจ้งผลเมื่อคำขอได้รับการอนุมัติหรือปฏิเสธ
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Sticky bottom submit */}
      <div className="lg:hidden fixed bottom-0 w-full z-40 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleSubmit}
          disabled={!dueDate || !reason || submitting}
          className="w-full bg-sky-500 text-white text-sm font-bold py-3.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              ส่งคำขอยืม <Send size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
