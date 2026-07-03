'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon } from './material-icon';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const userNavItems: NavItem[] = [
  { href: '/assets', icon: 'inventory_2', label: 'ยืมอุปกรณ์' },
  { href: '/history', icon: 'history', label: 'ประวัติของฉัน' },
  { href: '/profile', icon: 'account_circle', label: 'โปรไฟล์' },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', icon: 'space_dashboard', label: 'แดชบอร์ด' },
  { href: '/admin/assets', icon: 'inventory_2', label: 'อุปกรณ์' },
  { href: '/admin/history', icon: 'history', label: 'ประวัติ' },
  { href: '/admin/users', icon: 'manage_accounts', label: 'ผู้ใช้' },
  { href: '/profile', icon: 'account_circle', label: 'โปรไฟล์' },
];

interface BottomNavProps {
  variant?: 'user' | 'admin';
}

export function BottomNav({ variant = 'user' }: BottomNavProps) {
  const pathname = usePathname();
  const items = variant === 'admin' ? adminNavItems : userNavItems;

  return (
    <nav className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center h-16 z-50 lg:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && item.href !== '/admin' && pathname.startsWith(item.href));
        // Special case: /admin exact match
        const isExactAdmin = item.href === '/admin' && pathname === '/admin';
        const active = isActive || isExactAdmin;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 ${
              active ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <MaterialIcon icon={item.icon} size={22} />
            <span className="text-[11px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
