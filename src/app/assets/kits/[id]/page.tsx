'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockAssets, mockAssetKits } from '@/lib/mock-data';
import { 
  ArrowLeft, CheckCircle2, Calendar, 
  MapPin, FileText, Send, Info, PenTool, Eraser, LayoutList
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

export default function KitRequestPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  // Form State
  const [step, setStep] = useState(1); // 1 = Form, 2 = Terms & Signature
  const [dueDate, setDueDate] = useState('');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  
  // Signature State
  const sigCanvas = useRef<any>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const kit = mockAssetKits.find((k) => k.id === params.id);
  const kitAssets = kit ? mockAssets.filter(a => kit.asset_ids.includes(a.id)) : [];

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleNextStep = () => {
    if (!dueDate || !reason) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      alert('กรุณากดยอมรับเงื่อนไขการใช้งาน');
      return;
    }
    if (sigCanvas.current?.isEmpty()) {
      alert('กรุณาเซ็นชื่อเพื่อยืนยัน');
      return;
    }

    setSubmitting(true);
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setSignatureData(dataUrl);

    // Mock submit
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => router.push('/history'), 2000);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" /></div>;
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">ไม่พบชุดอุปกรณ์ที่ระบุ</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 shadow-sm border border-emerald-100 animate-in zoom-in duration-300">
          <CheckCircle2 className="text-emerald-500" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ส่งคำขอยืมชุดอุปกรณ์เรียบร้อยแล้ว</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">ระบบบันทึกคำขอของคุณพร้อมลายเซ็นดิจิทัลแล้ว กำลังนำคุณไปยังหน้าประวัติการยืม...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-8 h-16 shadow-sm">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => step === 2 ? setStep(1) : router.back()} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800">
              {step === 1 ? 'แบบฟอร์มขอยืมชุดอุปกรณ์' : 'ยืนยันเงื่อนไขและลายเซ็น'}
            </h1>
          </div>
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            ขั้นตอน {step}/2
          </div>
        </div>
      </header>

      <main className="pt-8 px-4 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form or Signature */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === 1 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-800 mb-6">กรอกข้อมูลการยืม</h2>
                
                <div className="space-y-6">
                  {/* Due date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Calendar size={16} className="text-indigo-500" />
                      วันที่ต้องการคืน <span className="text-xs text-slate-400 font-normal">(ยืมได้สูงสุด 7 วัน)</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      min={today}
                      max={maxDateStr}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm font-medium text-slate-800"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <MapPin size={16} className="text-indigo-500" />
                      สถานที่ใช้งาน
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น Head Office, ชั้น 22 หรือ บูธนิทรรศการ..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm text-slate-800"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <FileText size={16} className="text-indigo-500" />
                      เหตุผลการยืม
                    </label>
                    <textarea
                      rows={4}
                      placeholder="เช่น ใช้สำหรับพรีเซนต์งานที่ลูกค้า วันที่..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm text-slate-800 resize-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold text-slate-800 mb-4">ข้อตกลงและเงื่อนไขการยืม (IT Policy)</h2>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-48 overflow-y-auto mb-6 text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>1. ข้าพเจ้าขอรับรองว่าข้อมูลการขอยืมนี้เป็นความจริงทุกประการ</p>
                  <p>2. ข้าพเจ้าจะดูแลรักษาอุปกรณ์ที่ยืมไปเสมือนเป็นทรัพย์สินของตนเอง หากเกิดความเสียหาย สูญหาย หรือเสื่อมสภาพก่อนเวลาอันควรจากการใช้งานผิดประเภท ข้าพเจ้ายินดีรับผิดชอบชดใช้ค่าเสียหายตามที่บริษัทกำหนด</p>
                  <p>3. ห้ามนำอุปกรณ์ไปใช้ในกิจกรรมที่ผิดกฎหมาย หรือละเมิดนโยบายความปลอดภัยทางไซเบอร์ของบริษัท</p>
                  <p>4. ข้าพเจ้าจะส่งคืนอุปกรณ์ตามวันเวลาที่กำหนด หากมีความจำเป็นต้องใช้ต่อ จะทำการขอขยายเวลาในระบบล่วงหน้า</p>
                  <p>5. ข้อมูลในอุปกรณ์อาจถูกลบหรือ Format ทันทีเมื่อส่งคืน ข้าพเจ้าจะเป็นผู้สำรองข้อมูลเอง</p>
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขการยืมอุปกรณ์ไอทีของบริษัททุกประการ
                  </span>
                </label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <PenTool size={16} className="text-indigo-500" />
                      ลายเซ็นผู้ยืม (E-Signature)
                    </label>
                    <button 
                      onClick={clearSignature}
                      className="text-[10px] flex items-center gap-1 font-bold text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Eraser size={12} /> ล้างลายเซ็น
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden" style={{ touchAction: 'none' }}>
                    <SignatureCanvas 
                      ref={sigCanvas} 
                      penColor="black"
                      canvasProps={{ className: 'w-full h-40 cursor-crosshair' }} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">ใช้นิ้วมือหรือเมาส์เพื่อเซ็นชื่อในกรอบด้านบน</p>
                </div>
              </div>
            )}
            
            {/* Desktop Navigation Buttons */}
            <div className="hidden lg:flex justify-end mt-6">
              {step === 1 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!dueDate || !reason}
                  className="bg-indigo-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป (ยืนยันเงื่อนไข) <ArrowLeft className="rotate-180" size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !acceptedTerms}
                  className="bg-indigo-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>ยืนยันการยืม <Send size={18} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Kit Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">ชุดอุปกรณ์ที่เลือก</h3>
              
              <div className="flex flex-col mb-4">
                <div className="w-full h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden mb-4">
                  {kit.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={kit.image_url} alt={kit.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <LayoutList size={32} />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-slate-800 leading-tight mb-1">{kit.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{kit.description}</p>
                <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 self-start">
                  รวม {kit.asset_ids.length} รายการ
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-slate-700">รายการในชุด:</p>
                <ul className="space-y-2">
                  {kitAssets.map((asset) => (
                    <li key={asset.id} className="flex flex-col text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-800">{asset.name}</span>
                      <span className="text-[10px] text-slate-500">Tag: {asset.asset_tag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  {step === 1 ? 'เมื่อส่งคำขอแล้ว จะถูกส่งไปยังแอดมิน IT เพื่อพิจารณาอนุมัติ' : 'คำขอนี้จะมีผลสมบูรณ์เมื่อคุณกดยอมรับเงื่อนไขและเซ็นชื่อรับรอง'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Sticky bottom submit */}
      <div className="lg:hidden fixed bottom-0 w-full z-40 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {step === 1 ? (
          <button
            onClick={handleNextStep}
            disabled={!dueDate || !reason}
            className="w-full bg-indigo-600 text-white text-sm font-bold py-3.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ถัดไป (ยืนยันเงื่อนไข) <ArrowLeft className="rotate-180" size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !acceptedTerms}
            className="w-full bg-indigo-600 text-white text-sm font-bold py-3.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>ยืนยันการยืมชุดอุปกรณ์ <Send size={18} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
