'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockUsers } from '@/lib/mock-data';
import { User, UserRole } from '@/lib/database.types';

export default function AdminUsersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [roleModal, setRoleModal] = useState<{ user: User, newRole: UserRole } | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/assets');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.display_name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, searchQuery]);

  const handleRoleChange = () => {
    if (!roleModal) return;
    setUsers(prev => prev.map(u => 
      u.id === roleModal.user.id ? { ...u, role: roleModal.newRole } : u
    ));
    setRoleModal(null);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="pb-24 lg:pb-8 bg-background min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center gap-4 px-margin-mobile h-16">
        <button onClick={() => router.back()} className="text-on-surface-variant p-2 -ml-2 rounded-full hover:bg-surface-container">
          <MaterialIcon icon="arrow_back" />
        </button>
        <h1 className="font-headline-md text-title-lg font-bold text-on-surface">จัดการผู้ใช้งาน</h1>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-50 justify-between items-center w-full px-8 py-4 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <h1 className="text-headline-lg font-bold text-on-surface">จัดการผู้ใช้งาน</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold">
            {user?.display_name?.charAt(0) || 'A'}
          </div>
        </div>
      </header>

      <main className="pt-20 lg:pt-8 px-margin-mobile lg:px-8 max-w-2xl lg:max-w-7xl mx-auto space-y-stack-lg">
        
        {/* Search Bar */}
        <section className="sticky top-16 lg:top-auto z-40 bg-background lg:bg-transparent py-2 lg:py-0">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, อีเมล หรือแผนก..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-12 pr-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
        </section>

        {/* Desktop Table View */}
        <section className="hidden lg:block bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-label-md uppercase text-on-surface-variant border-b border-outline-variant">
                <th className="px-6 py-4 font-semibold">ชื่อ - นามสกุล</th>
                <th className="px-6 py-4 font-semibold">อีเมล</th>
                <th className="px-6 py-4 font-semibold">แผนก</th>
                <th className="px-6 py-4 font-semibold text-center">สิทธิ์การใช้งาน</th>
                <th className="px-6 py-4 font-semibold text-right">ใช้งานล่าสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-on-surface-variant">ไม่พบข้อมูลผู้ใช้งาน</td>
                </tr>
              )}
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-body-md font-medium text-on-surface flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                      {u.display_name.charAt(0)}
                    </div>
                    {u.display_name}
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{u.email}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{u.department || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex bg-surface-container-high rounded-full p-1 border border-outline-variant">
                      <button
                        onClick={() => u.role !== 'user' && setRoleModal({ user: u, newRole: 'user' })}
                        className={`px-4 py-1.5 rounded-full text-label-md transition-all ${
                          u.role === 'user' ? 'bg-background text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        User
                      </button>
                      <button
                        onClick={() => u.role !== 'admin' && setRoleModal({ user: u, newRole: 'admin' })}
                        className={`px-4 py-1.5 rounded-full text-label-md transition-all ${
                          u.role === 'admin' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        IT Admin
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant text-right">
                    {formatDate(u.last_login_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Mobile Cards View */}
        <section className="lg:hidden space-y-stack-sm">
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">ไม่พบข้อมูลผู้ใช้งาน</div>
          )}
          {filteredUsers.map((u) => (
            <div key={u.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0 text-title-lg">
                  {u.display_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-title-md font-bold text-on-surface truncate">{u.display_name}</h3>
                  <p className="text-body-sm text-on-surface-variant truncate">{u.email}</p>
                  <p className="text-xs text-primary mt-1 font-medium">{u.department || 'ไม่มีข้อมูลแผนก'}</p>
                </div>
              </div>
              
              <div className="border-t border-outline-variant pt-4 mt-2">
                <p className="text-label-sm text-on-surface-variant mb-2 uppercase">ตั้งค่าสิทธิ์ (Role)</p>
                <div className="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant w-full">
                  <button
                    onClick={() => u.role !== 'user' && setRoleModal({ user: u, newRole: 'user' })}
                    className={`flex-1 py-2 rounded-md text-label-md transition-all ${
                      u.role === 'user' ? 'bg-background text-on-surface shadow-sm font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    User
                  </button>
                  <button
                    onClick={() => u.role !== 'admin' && setRoleModal({ user: u, newRole: 'admin' })}
                    className={`flex-1 py-2 rounded-md text-label-md transition-all ${
                      u.role === 'admin' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    IT Admin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

      </main>

      <ConfirmModal
        isOpen={!!roleModal}
        title="ยืนยันการเปลี่ยนสิทธิ์"
        description={`คุณต้องการเปลี่ยนสิทธิ์ของ "${roleModal?.user?.display_name}" เป็น ${roleModal?.newRole === 'admin' ? 'IT Admin' : 'User ทั่วไป'} ใช่หรือไม่?`}
        confirmLabel="ยืนยัน"
        confirmVariant={roleModal?.newRole === 'admin' ? 'primary' : 'danger'}
        onConfirm={handleRoleChange}
        onCancel={() => setRoleModal(null)}
      />

      <BottomNav variant="admin" />
    </div>
  );
}
