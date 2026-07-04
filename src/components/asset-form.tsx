'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockCategories } from '@/lib/mock-data';
import { Asset, AssetStatus, AssetCondition } from '@/lib/database.types';
import { ArrowLeft, Save, CheckCircle2, X } from 'lucide-react';

const statusOptions: { value: AssetStatus; label: string }[] = [
  { value: 'available', label: 'ว่าง (Available)' },
  { value: 'borrowed', label: 'ถูกยืม (Borrowed)' },
  { value: 'reserved', label: 'จองไว้ (Reserved)' },
  { value: 'maintenance', label: 'ซ่อมบำรุง (Maintenance)' },
  { value: 'damaged', label: 'ชำรุด (Damaged)' },
  { value: 'lost', label: 'สูญหาย (Lost)' },
  { value: 'retired', label: 'ปลดระวาง (Retired)' },
];

const conditionOptions: { value: AssetCondition; label: string }[] = [
  { value: 'new', label: 'ใหม่ (New)' },
  { value: 'good', label: 'ดี (Good)' },
  { value: 'fair', label: 'พอใช้ (Fair)' },
  { value: 'poor', label: 'แย่ (Poor)' },
];

const subsidiaryOptions = ['PS', 'TRR Corp', 'SSEC', 'TRRP', 'TRM', 'TRRL', 'TRRSK', 'TRRT', 'TRW', 'TMI', 'TEG'];

interface AssetFormProps {
  mode: 'new' | 'edit';
  asset?: Asset;
}

export function AssetForm({ mode, asset }: AssetFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [assetTag, setAssetTag] = useState(asset?.asset_tag || '');
  const [name, setName] = useState(asset?.name || '');
  const [categoryId, setCategoryId] = useState(asset?.category_id || mockCategories[0]?.id || '');
  const [brand, setBrand] = useState(asset?.brand || '');
  const [model, setModel] = useState(asset?.model || '');
  const [serialNumber, setSerialNumber] = useState(asset?.serial_number || '');
  const [status, setStatus] = useState<AssetStatus>(asset?.status || 'available');
  const [condition, setCondition] = useState<AssetCondition>(asset?.condition || 'good');
  const [isBorrowable, setIsBorrowable] = useState(asset?.is_borrowable ?? true);
  const [purchaseDate, setPurchaseDate] = useState(asset?.purchase_date || '');
  const [purchasePrice, setPurchasePrice] = useState(asset?.purchase_price?.toString() || '');
  const [vendor, setVendor] = useState(asset?.vendor || '');
  const [warrantyExpiry, setWarrantyExpiry] = useState(asset?.warranty_expiry_date || '');
  const [location, setLocation] = useState(asset?.location || '');
  const [subsidiary, setSubsidiary] = useState(asset?.subsidiary || 'PS');
  const [notes, setNotes] = useState(asset?.notes || '');
  const [imageUrl, setImageUrl] = useState(asset?.image_url || '');

  const handleSave = async () => {
    if (!assetTag || !name) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => router.push('/admin/assets'), 1000);
  };

  const inputClass = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm text-slate-800 transition-all';

  if (saved) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          {mode === 'new' ? 'เพิ่มอุปกรณ์เรียบร้อยแล้ว' : 'บันทึกเรียบร้อยแล้ว'}
        </h2>
        <p className="text-sm text-slate-400">ระบบกำลังพากลับไปยังคลังอุปกรณ์...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 lg:px-8">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0 mr-4">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">
          {mode === 'new' ? 'เพิ่มอุปกรณ์ใหม่' : 'แก้ไขอุปกรณ์'}
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Card container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          
          {/* Identification */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-sky-500 uppercase tracking-wider">ข้อมูลระบุตัวตน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">รหัสอุปกรณ์ (Asset Tag) *</label>
                <input type="text" placeholder="เช่น TAG-88291-LX" value={assetTag} onChange={e => setAssetTag(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">ชื่ออุปกรณ์ *</label>
                <input type="text" placeholder='MacBook Pro 16"' value={name} onChange={e => setName(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">หมวดหมู่ *</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
                  {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">ยี่ห้อ</label>
                <input type="text" placeholder="Apple, Dell, HP..." value={brand} onChange={e => setBrand(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">รุ่น (Model)</label>
                <input type="text" placeholder="16-inch M3 Pro" value={model} onChange={e => setModel(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Serial Number</label>
                <input type="text" placeholder="C02DR4XXXXXX" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* รูปภาพอุปกรณ์ */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-sky-500 uppercase tracking-wider">รูปภาพอุปกรณ์</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">ลิงก์รูปภาพ (Image URL)</label>
                <input
                  type="text"
                  placeholder="ป้อน URL ของรูปภาพ เช่น https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={inputClass}
                />
                
                {/* Preset image select buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">รูปภาพตัวอย่างด่วน</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImageUrl('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600 font-semibold cursor-pointer"
                    >
                      MacBook/Notebook
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600 font-semibold cursor-pointer"
                    >
                      Monitor/จอภาพ
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600 font-semibold cursor-pointer"
                    >
                      iPad/Tablet
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=300&q=80')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600 font-semibold cursor-pointer"
                    >
                      Projector
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80')}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-600 font-semibold cursor-pointer"
                    >
                      Pocket Wi-Fi
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Image Preview Container */}
              <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden min-h-[120px]">
                {imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="w-full h-full max-h-[110px] object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 text-center">ไม่มีรูปภาพแสดงผล</span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Status and conditions */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-sky-500 uppercase tracking-wider">สถานะและสภาพอุปกรณ์</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">สถานะ *</label>
                <select value={status} onChange={e => setStatus(e.target.value as AssetStatus)} className={inputClass}>
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">สภาพอุปกรณ์ *</label>
                <select value={condition} onChange={e => setCondition(e.target.value as AssetCondition)} className={inputClass}>
                  {conditionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 py-2 select-none cursor-pointer">
              <input type="checkbox" checked={isBorrowable} onChange={e => setIsBorrowable(e.target.checked)} className="w-4.5 h-4.5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
              <span className="text-xs font-semibold text-slate-700">เปิดให้พนักงานยืมได้ (Borrowable)</span>
            </label>
          </div>

          <hr className="border-slate-100" />

          {/* Financial details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-sky-500 uppercase tracking-wider">ข้อมูลการจัดซื้อ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">วันที่ซื้อ</label>
                <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">ราคา (บาท)</label>
                <input type="number" placeholder="79900" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">ผู้จำหน่าย</label>
                <input type="text" placeholder="Advice, Synnex..." value={vendor} onChange={e => setVendor(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">หมดประกันวันที่</label>
                <input type="date" value={warrantyExpiry} onChange={e => setWarrantyExpiry(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Location and ownership */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-sky-500 uppercase tracking-wider">ตำแหน่งและเจ้าของ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">บริษัทในเครือ (เจ้าของ) *</label>
                <select value={subsidiary || 'PS'} onChange={e => setSubsidiary(e.target.value)} className={inputClass}>
                  {subsidiaryOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">จุดจัดเก็บ (Location)</label>
                <input type="text" placeholder="เช่น คลัง IT ชั้น 22" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">หมายเหตุเพิ่มเติม</label>
              <textarea rows={3} placeholder="ข้อมูลประกอบเพิ่มเติม..." value={notes} onChange={e => setNotes(e.target.value)} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={() => router.back()} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer">
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={!assetTag || !name || saving}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-sky-500/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Save size={16} />
                <span>บันทึกอุปกรณ์</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
