'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { APP_VERSION } from '@/lib/version';
import { 
  LayoutDashboard, 
  Boxes, 
  ClipboardList, 
  Users, 
  User, 
  Package, 
  Clock, 
  Laptop, 
  ShieldCheck, 
  LogOut,
  Settings
} from 'lucide-react';

export function SideNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user || pathname === '/login') return null;

  const userNavItems = [
    { href: '/assets', icon: Package, label: 'ยืมอุปกรณ์' },
    { href: '/history', icon: Clock, label: 'ประวัติของฉัน' },
    { href: '/profile', icon: User, label: 'โปรไฟล์' },
  ];

  const adminNavItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'แดชบอร์ด' },
    { href: '/admin/assets', icon: Boxes, label: 'จัดการอุปกรณ์' },
    { href: '/admin/history', icon: ClipboardList, label: 'ประวัติทั้งหมด' },
    { href: '/admin/users', icon: Users, label: 'ผู้ใช้งาน' },
    { href: '/admin/settings', icon: Settings, label: 'ตั้งค่าระบบ' },
    { href: '/profile', icon: User, label: 'โปรไฟล์' },
  ];

  const items = user.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 p-6 hidden lg:flex flex-col bg-white border-r border-slate-200 z-40">
      {/* Brand Logo Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-sky-500/20">
          <Laptop size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">AssetHub</h3>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ITAM Borrow System</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto hide-scrollbar">
        {items.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && item.href !== '/profile' && pathname.startsWith(item.href));
          const isExactAdmin = item.href === '/admin' && pathname === '/admin';
          const active = isActive || isExactAdmin;
          
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out border-l-4 ${
                active 
                  ? 'bg-sky-50 border-sky-500 text-sky-600 font-bold' 
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
              <span className="text-sm leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Sidebar Footer with User Details & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        {/* Quick User summary */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 overflow-hidden shrink-0">
            {user.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.display_name?.charAt(0) || 'U'
            )}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate leading-tight">{user.display_name}</div>
            <div className="text-[10px] text-slate-400 font-medium truncate">{user.email}</div>
            {(user.job_title || user.work_location) && (
              <div className="text-[9px] text-slate-500 mt-0.5 truncate">
                {user.job_title} {user.job_title && user.work_location ? '•' : ''} {user.work_location}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors active:scale-95 duration-150 flex items-center justify-center gap-2 cursor-pointer border border-red-100"
        >
          <LogOut size={14} />
          ออกจากระบบ
        </button>

        <div className="text-center text-[10px] text-slate-400 font-medium">
          v{APP_VERSION}
        </div>
      </div>
    </aside>
  );
}
