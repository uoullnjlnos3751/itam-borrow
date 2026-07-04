'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/bottom-nav';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  HelpCircle, 
  Bell, 
  UserCheck,
  Briefcase,
  History,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const initials = user.display_name
    ? user.display_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <h1 className="text-lg font-bold text-slate-800">โปรไฟล์ของฉัน</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        {/* Profile Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />
          
          {/* Avatar Area */}
          <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-3xl font-extrabold border-2 border-sky-200 overflow-hidden shadow-inner shrink-0 relative">
            {user.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="space-y-2 flex-1">
            <h2 className="text-xl font-bold text-slate-800">{user.display_name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-xs">
              <span className="bg-sky-50 text-sky-700 border border-sky-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {user.role === 'admin' ? 'IT Admin' : 'Staff'}
              </span>
              <span className="text-slate-400">&middot;</span>
              <span className="text-slate-500 font-medium">{user.email}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              แผนก {user.department || '-'} &middot; TRR Group
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100 shrink-0">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">กำลังยืมอยู่</div>
                <div className="text-lg font-bold text-slate-800">1 รายการ</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0">
                <History size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ยืมทั้งหมด</div>
                <div className="text-lg font-bold text-slate-800">3 รายการ</div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Options */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="px-5 py-4 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ข้อมูลทั่วไป</h3>
          </div>
          
          <div className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
              <Briefcase size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ตำแหน่ง / ฝ่าย</div>
              <div className="text-sm font-semibold text-slate-700 truncate">{user.department || '-'}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
              <Building2 size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">บริษัทในเครือ</div>
              <div className="text-sm font-semibold text-slate-700 truncate">{user.subsidiary || '-'} (TRR Group)</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สิทธิ์การเข้าถึง</div>
              <div className="text-sm font-semibold text-slate-700 truncate">
                {user.role === 'admin' ? 'ผู้ดูแลระบบสูงสุด (IT Admin)' : 'พนักงานทั่วไป (Staff)'}
              </div>
            </div>
          </div>
        </section>

        {/* Menu Actions */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
                <Bell size={16} />
              </div>
              <span className="text-sm font-semibold text-slate-700">การตั้งค่าการแจ้งเตือน</span>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
                <HelpCircle size={16} />
              </div>
              <span className="text-sm font-semibold text-slate-700">ช่วยเหลือและศูนย์สนับสนุน</span>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </section>

        {/* Logout Button */}
        <section className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-200/50 shadow-sm shadow-red-500/5 cursor-pointer"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </section>
      </main>

      <BottomNav variant={user.role === 'admin' ? 'admin' : 'user'} />
    </div>
  );
}
