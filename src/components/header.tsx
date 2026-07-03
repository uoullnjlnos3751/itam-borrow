'use client';

import Link from 'next/link';
import { MaterialIcon } from './material-icon';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  title: string;
  backHref?: string;
  titleColor?: 'primary' | 'default';
  showAvatar?: boolean;
  rightIcon?: string;
  rightIconHref?: string;
  rightIconTitle?: string;
}

export function Header({
  title,
  backHref,
  titleColor = 'default',
  showAvatar = false,
  rightIcon,
  rightIconHref,
  rightIconTitle,
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
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-margin-mobile h-16 max-w-2xl mx-auto left-0 right-0">
      <div className="flex items-center gap-stack-md">
        {backHref && (
          <Link href={backHref} className="text-on-surface p-1">
            <MaterialIcon icon="arrow_back" />
          </Link>
        )}
        <h1
          className={`font-headline-md text-title-lg font-bold ${
            titleColor === 'primary' ? 'text-primary' : 'text-on-surface'
          }`}
        >
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-stack-sm">
        {rightIcon && rightIconHref && (
          <Link
            href={rightIconHref}
            className="text-on-surface-variant p-1"
            title={rightIconTitle}
          >
            <MaterialIcon icon={rightIcon} />
          </Link>
        )}
        {showAvatar && (
          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-body-sm font-bold">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}
