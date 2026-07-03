'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialIcon } from './material-icon';
import { mockCategories } from '@/lib/mock-data';
import { Asset, AssetStatus, AssetCondition } from '@/lib/database.types';

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

  const handleSave = async () => {
    if (!assetTag || !name) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => router.push('/admin/assets'), 1000);
  };

  const inputClass = 'w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md';

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-stack-lg">
          <MaterialIcon icon="check_circle" className="text-primary" size={40} />
        </div>
        <h2 className="text-title-lg font-title-lg text-on-surface mb-stack-xs">
          {mode === 'new' ? 'เพิ่มอุปกรณ์เรียบร้อยแล้ว' : 'บันทึกเรียบร้อยแล้ว'}
        </h2>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center gap-stack-md px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
        <button onClick={() => router.back()} className="text-on-surface p-1">
          <MaterialIcon icon="arrow_back" />
        </button>
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">
          {mode === 'new' ? 'เพิ่มอุปกรณ์ใหม่' : 'แก้ไขอุปกรณ์'}
        </h1>
      </header>

      <main className="pt-20 px-margin-mobile max-w-2xl mx-auto space-y-stack-lg">
        {/* Identification */}
        <div className="space-y-stack-md">
          <p className="section-label">ข้อมูลระบุตัวตน</p>
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">รหัสอุปกรณ์ (Asset Tag) *</label>
            <input type="text" placeholder="เช่น TAG-88291-LX" value={assetTag} onChange={e => setAssetTag(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">ชื่ออุปกรณ์ *</label>
            <input type="text" placeholder='MacBook Pro 16"' value={name} onChange={e => setName(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-stack-sm">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">หมวดหมู่ *</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
                {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">ยี่ห้อ</label>
              <input type="text" placeholder="Apple, Dell, HP..." value={brand} onChange={e => setBrand(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-stack-sm">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">รุ่น (Model)</label>
              <input type="text" placeholder="16-inch M3 Pro" value={model} onChange={e => setModel(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">Serial Number</label>
              <input type="text" placeholder="C02DR4XXXXXX" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Lifecycle */}
        <div className="space-y-stack-md pt-stack-lg border-t border-outline-variant">
          <p className="section-label">สถานะและสภาพ</p>
          <div className="grid grid-cols-2 gap-stack-sm">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">สถานะ *</label>
              <select value={status} onChange={e => setStatus(e.target.value as AssetStatus)} className={inputClass}>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">สภาพอุปกรณ์ *</label>
              <select value={condition} onChange={e => setCondition(e.target.value as AssetCondition)} className={inputClass}>
                {conditionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-stack-sm py-1">
            <input type="checkbox" checked={isBorrowable} onChange={e => setIsBorrowable(e.target.checked)} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
            <span className="text-body-md text-on-surface">เปิดให้พนักงานยืมได้ (Borrowable)</span>
          </label>
        </div>

        {/* Financial */}
        <div className="space-y-stack-md pt-stack-lg border-t border-outline-variant">
          <p className="section-label">ข้อมูลการจัดซื้อ</p>
          <div className="grid grid-cols-2 gap-stack-sm">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">วันที่ซื้อ</label>
              <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">ราคา (บาท)</label>
              <input type="number" placeholder="79,900" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-stack-sm">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">ผู้จำหน่าย</label>
              <input type="text" placeholder="Advice, Synnex..." value={vendor} onChange={e => setVendor(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">หมดประกันวันที่</label>
              <input type="date" value={warrantyExpiry} onChange={e => setWarrantyExpiry(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-stack-md pt-stack-lg border-t border-outline-variant">
          <p className="section-label">ตำแหน่งและเจ้าของ</p>
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">จุดจัดเก็บ</label>
            <input type="text" placeholder="เช่น คลัง IT ชั้น 22" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">บริษัทในเครือ (เจ้าของทรัพย์สิน)</label>
            <select value={subsidiary} onChange={e => setSubsidiary(e.target.value)} className={inputClass}>
              {subsidiaryOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-stack-xs uppercase">หมายเหตุ</label>
            <textarea rows={3} placeholder="ข้อมูลเพิ่มเติม..." value={notes} onChange={e => setNotes(e.target.value)} className={`${inputClass} resize-none`} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-margin-mobile flex gap-stack-sm">
        <button onClick={() => router.back()} className="flex-1 text-center bg-surface-container text-on-surface text-body-lg font-medium py-3.5 rounded-xl">
          ยกเลิก
        </button>
        <button
          onClick={handleSave}
          disabled={!assetTag || !name || saving}
          className="flex-1 bg-primary text-on-primary text-body-lg font-medium py-3.5 rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-stack-sm disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full" />
          ) : (
            <>
              <MaterialIcon icon="save" size={20} />
              บันทึกอุปกรณ์
            </>
          )}
        </button>
      </div>
    </div>
  );
}
