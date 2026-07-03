'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialIcon } from '@/components/material-icon';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockCategories, mockAssets } from '@/lib/mock-data';
import { AssetCategory } from '@/lib/database.types';

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

  return (
    <div className="pb-28">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center gap-stack-md px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
        <button onClick={() => router.back()} className="text-on-surface p-1">
          <MaterialIcon icon="arrow_back" />
        </button>
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">
          จัดการหมวดหมู่อุปกรณ์
        </h1>
      </header>

      <main className="pt-20 px-margin-mobile max-w-2xl mx-auto space-y-stack-lg">
        {/* Add category */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <p className="text-label-md font-label-md text-on-surface-variant uppercase mb-stack-sm">
            เพิ่มหมวดหมู่ใหม่
          </p>
          <div className="flex gap-stack-sm">
            <input
              type="text"
              placeholder="ชื่อหมวดหมู่ เช่น Tablet"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-body-md"
            />
            <button
              onClick={handleAdd}
              className="bg-primary text-on-primary w-12 rounded-xl flex items-center justify-center shrink-0"
            >
              <MaterialIcon icon="add" />
            </button>
          </div>
        </div>

        {/* Category list */}
        <section className="space-y-stack-sm">
          <p className="text-label-md font-label-md text-on-surface-variant uppercase">
            หมวดหมู่ทั้งหมด ({categories.length})
          </p>

          {categories.map((cat) => {
            const count = getAssetCount(cat.id);
            const canDeleteCat = count === 0;
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md flex items-center gap-stack-md"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    count > 0 ? 'bg-primary-container text-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <MaterialIcon icon={cat.icon} size={20} />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-stack-xs">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1 px-2 py-1 border border-primary rounded-lg text-body-md outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                      <button onClick={handleSaveEdit} className="text-primary">
                        <MaterialIcon icon="check" size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-on-surface-variant">
                        <MaterialIcon icon="close" size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-body-md font-medium text-on-surface">{cat.name}</p>
                      <p className="text-body-sm text-on-surface-variant">{count} ชิ้น</p>
                    </>
                  )}
                </div>
                {!isEditing && (
                  <>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
                    >
                      <MaterialIcon icon="edit" size={18} />
                    </button>
                    {canDeleteCat ? (
                      <button
                        onClick={() => setDeleteModal(cat)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10"
                        title="ลบได้ ไม่มีอุปกรณ์ผูกอยู่"
                      >
                        <MaterialIcon icon="delete" size={18} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-8 h-8 rounded-full flex items-center justify-center text-outline-variant"
                        title="ลบไม่ได้ มีอุปกรณ์ผูกอยู่"
                      >
                        <MaterialIcon icon="delete" size={18} />
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </section>

        {/* Info */}
        <div className="rounded-xl bg-primary-container/40 border border-primary/20 p-stack-md flex gap-stack-sm items-start">
          <MaterialIcon icon="info" className="text-primary shrink-0" size={20} />
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            หมวดหมู่ที่มีอุปกรณ์ผูกอยู่จะลบไม่ได้ (ต้องย้ายอุปกรณ์ออกจากหมวดหมู่ก่อน) เพื่อป้องกันข้อมูลอุปกรณ์เดิมเสียหาย
          </p>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="ยืนยันการลบหมวดหมู่?"
        description={`ลบหมวดหมู่ "${deleteModal?.name}" ออกจากระบบ`}
        confirmLabel="ลบหมวดหมู่"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </div>
  );
}
