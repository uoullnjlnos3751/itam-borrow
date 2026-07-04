'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  backHref?: string;
  titleColor?: 'primary' | 'default';
  showAvatar?: boolean;
}

export function Header({
  title,
  backHref,
  titleColor = 'default',
  showAvatar = false,
}: HeaderProps) {
  const { user } = useAuth();
  const initials = user?.display_name
    ? user.display_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 h-16 max-w-2xl mx-auto left-0 right-0">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </Link>
        )}
        <h1
          className={`font-sans text-base font-bold ${
            titleColor === 'primary' ? 'text-sky-500' : 'text-slate-800'
          }`}
        >
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {showAvatar && (
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold border border-sky-200 overflow-hidden shrink-0">
            {user?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
        )}
      </div>
    </header>
  );
}
