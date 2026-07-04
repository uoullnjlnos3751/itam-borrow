'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockCategories, mockAssets } from '@/lib/mock-data';
import { AssetCategory } from '@/lib/database.types';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  FolderPlus,
  Layers,
  Laptop, 
  Monitor, 
  Printer, 
  Video, 
  Wifi, 
  Smartphone, 
  Mouse, 
  Cable, 
  Package
} from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState(mockCategories);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteModal, setDeleteModal] = useState<AssetCategory | null>(null);

  const getAssetCount = (categoryId: string) => {
    return mockAssets.filter((a) => a.category_id === categoryId && !a.deleted_at).length;
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newCat: AssetCategory = {
      id: `cat-new-${Date.now()}`,
      name: newName.trim(),
      icon: 'devices',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCat]);
    setNewName('');
  };

  const handleEdit = (cat: AssetCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === editingId ? { ...c, name: editName.trim() } : c))
    );
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteModal.id));
    setDeleteModal(null);
  };

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

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 lg:px-8">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0 mr-4">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Layers size={20} className="text-sky-500" />
          <span>จัดการหมวดหมู่อุปกรณ์</span>
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Add category box */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FolderPlus size={14} />
            <span>เพิ่มหมวดหมู่ใหม่</span>
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ป้อนชื่อหมวดหมู่ เช่น Tablet, Headset..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
            />
            <button
              onClick={handleAdd}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/10 active:scale-[0.98] transition-all cursor-pointer font-bold text-sm gap-1"
            >
              <Plus size={16} />
              <span>เพิ่ม</span>
            </button>
          </div>
        </section>

        {/* Category List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              หมวดหมู่ทั้งหมด ({categories.length})
            </h3>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const count = getAssetCount(cat.id);
              const canDeleteCat = count === 0;
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-slate-300"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex gap-2 max-w-sm">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm focus:bg-white transition-all"
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer border border-slate-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{cat.name}</h4>
                          <span className="bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-md text-[10px] font-bold mt-1 inline-block">
                            มีอุปกรณ์ทั้งหมด {count} รายการ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </button>

                      {canDeleteCat ? (
                        <button
                          onClick={() => setDeleteModal(cat)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100 bg-slate-50 cursor-not-allowed"
                          title="ไม่สามารถลบหมวดหมู่ที่มีอุปกรณ์อยู่ได้"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="ยืนยันการลบหมวดหมู่?"
        description="คุณต้องการลบหมวดหมู่นี้ออกจากระบบหรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้ (ระบบจะลบได้เฉพาะหมวดหมู่ที่ไม่มีอุปกรณ์ผูกอยู่เท่านั้น)"
        confirmLabel="ยืนยันลบหมวดหมู่"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </div>
  );
}
