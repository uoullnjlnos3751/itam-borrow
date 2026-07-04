'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Clock,
  User,
  LayoutDashboard,
  Boxes,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const userNavItems: NavItem[] = [
  { href: '/assets', icon: Package, label: 'ยืมอุปกรณ์' },
  { href: '/history', icon: Clock, label: 'ประวัติของฉัน' },
  { href: '/profile', icon: User, label: 'โปรไฟล์' },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', icon: LayoutDashboard, label: 'แดชบอร์ด' },
  { href: '/admin/assets', icon: Boxes, label: 'อุปกรณ์' },
  { href: '/admin/history', icon: ClipboardList, label: 'ประวัติทั้งหมด' },
];

interface BottomNavProps {
  variant?: 'user' | 'admin';
}

export function BottomNav({ variant = 'user' }: BottomNavProps) {
  const pathname = usePathname();
  const items = variant === 'admin' ? adminNavItems : userNavItems;

  return (
    <nav className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 z-50 lg:hidden">
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' &&
                item.href !== '/admin' &&
                pathname.startsWith(item.href));
            const isExactAdmin =
              item.href === '/admin' && pathname === '/admin';
            const active = isActive || isExactAdmin;

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center gap-1
                  min-w-[64px] py-1.5 rounded-xl
                  transition-all duration-200 ease-in-out
                  ${active ? 'text-sky-500' : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span
                  className={`
                    text-[11px] leading-none
                    ${active ? 'font-semibold' : 'font-medium'}
                  `}
                >
                  {item.label}
                </span>
                {/* Active dot indicator */}
                <span
                  className={`
                    absolute -bottom-0.5 left-1/2 -translate-x-1/2
                    h-1 rounded-full bg-sky-500
                    transition-all duration-200 ease-in-out
                    ${active ? 'w-4 opacity-100' : 'w-0 opacity-0'}
                  `}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
