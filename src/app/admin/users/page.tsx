'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { ConfirmModal } from '@/components/confirm-modal';
import { mockUsers } from '@/lib/mock-data';
import { User, UserRole } from '@/lib/database.types';
import { 
  ArrowLeft, 
  Search, 
  Shield, 
  User as UserIcon, 
  Check, 
  Briefcase, 
  Building2,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';

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
        (u.department && u.department.toLowerCase().includes(q))
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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings size={20} className="text-sky-500" />
            <span>จัดการผู้ใช้งานและกำหนดสิทธิ์</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        {/* Search Bar */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, อีเมล หรือแผนกผู้ใช้งาน..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
            />
          </div>
        </section>

        {/* Desktop Table View */}
        <section className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="px-6 py-4">ผู้ใช้งาน</th>
                <th className="px-6 py-4">อีเมล</th>
                <th className="px-6 py-4">แผนก / สังกัด</th>
                <th className="px-6 py-4 text-center">ระดับสิทธิ์</th>
                <th className="px-6 py-4 text-right">เข้าใช้งานล่าสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">ไม่พบข้อมูลผู้ใช้งานในระบบ</td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const initials = u.display_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 overflow-hidden shrink-0">
                          {u.profile_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{u.display_name}</div>
                          <div className="text-[10px] text-slate-400 lg:hidden">{u.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{u.email}</td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="font-semibold text-slate-700">{u.department || '-'}</div>
                        <div className="text-[10px] text-slate-400">{u.subsidiary || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex bg-slate-50 rounded-xl p-1 border border-slate-200 shadow-inner">
                          <button
                            onClick={() => u.role !== 'user' && setRoleModal({ user: u, newRole: 'user' })}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              u.role === 'user' 
                                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            User ทั่วไป
                          </button>
                          <button
                            onClick={() => u.role !== 'admin' && setRoleModal({ user: u, newRole: 'admin' })}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              u.role === 'admin' 
                                ? 'bg-sky-500 text-white shadow-sm border border-sky-500' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            IT Admin
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-right font-medium">
                        {formatDate(u.last_login_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        {/* Mobile Cards View */}
        <section className="lg:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              ไม่พบข้อมูลผู้ใช้งาน
            </div>
          ) : (
            filteredUsers.map((u) => {
              const initials = u.display_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div key={u.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 overflow-hidden shrink-0">
                      {u.profile_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{u.display_name}</h3>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      
                      <div className="flex gap-4 mt-2 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Briefcase size={12} className="text-slate-400" />
                          <span>{u.department || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 size={12} className="text-slate-400" />
                          <span>{u.subsidiary || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ระดับสิทธิ์ผู้ใช้งาน (Role)
                    </div>
                    
                    <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                      <button
                        onClick={() => u.role !== 'user' && setRoleModal({ user: u, newRole: 'user' })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          u.role === 'user' 
                            ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                            : 'text-slate-400'
                        }`}
                      >
                        User
                      </button>
                      <button
                        onClick={() => u.role !== 'admin' && setRoleModal({ user: u, newRole: 'admin' })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          u.role === 'admin' 
                            ? 'bg-sky-500 text-white shadow-sm border border-sky-500' 
                            : 'text-slate-400'
                        }`}
                      >
                        IT Admin
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <ConfirmModal
        isOpen={!!roleModal}
        title="ยืนยันการเปลี่ยนสิทธิ์?"
        description={`คุณแน่ใจว่าต้องการปรับสิทธิ์ระดับการเข้าถึงของ "${roleModal?.user?.display_name}" เป็น [${roleModal?.newRole === 'admin' ? 'IT Admin' : 'User พนักงานทั่วไป'}] หรือไม่?`}
        confirmLabel="ยืนยันเปลี่ยนสิทธิ์"
        confirmVariant={roleModal?.newRole === 'admin' ? 'primary' : 'danger'}
        onConfirm={handleRoleChange}
        onCancel={() => setRoleModal(null)}
      />

      <BottomNav variant="admin" />
    </div>
  );
}
