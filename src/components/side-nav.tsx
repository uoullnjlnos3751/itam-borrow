'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon } from './material-icon';
import { useAuth } from '@/lib/auth-context';

export function SideNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user || pathname === '/login') return null;

  const userNavItems = [
    { href: '/assets', icon: 'inventory_2', label: 'ยืมอุปกรณ์' },
    { href: '/history', icon: 'history', label: 'ประวัติของฉัน' },
    { href: '/profile', icon: 'account_circle', label: 'โปรไฟล์' },
  ];

  const adminNavItems = [
    { href: '/admin', icon: 'space_dashboard', label: 'แดชบอร์ด' },
    { href: '/admin/assets', icon: 'inventory_2', label: 'จัดการอุปกรณ์' },
    { href: '/admin/history', icon: 'history', label: 'ประวัติทั้งหมด' },
    { href: '/profile', icon: 'account_circle', label: 'โปรไฟล์' },
  ];

  const items = user.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-4 flex-col hidden lg:flex bg-surface-container-lowest border-r border-outline-variant z-40">
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
            <MaterialIcon icon={user.role === 'admin' ? 'admin_panel_settings' : 'badge'} className="text-on-primary-container" />
          </div>
          <div>
            <h3 className="text-body-md font-semibold text-on-surface">ITAM Borrow</h3>
            <p className="text-xs text-on-surface-variant">ระบบยืมคืนอุปกรณ์ไอที</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const isExactAdmin = item.href === '/admin' && pathname === '/admin';
          const active = isActive || isExactAdmin;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
                active 
                  ? 'bg-primary-container text-on-primary-container font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <MaterialIcon icon={item.icon} size={24} style={active ? { fontVariationSettings: "'FILL' 1" } : undefined} />
              <span className="font-body text-body-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-outline-variant">
        <button className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-xl font-semibold text-body-md hover:bg-secondary-fixed transition-colors active:scale-95 duration-150 flex items-center justify-center gap-2">
          <MaterialIcon icon="support_agent" size={20} />
          ติดต่อฝ่ายไอที
        </button>
      </div>
    </aside>
  );
}
