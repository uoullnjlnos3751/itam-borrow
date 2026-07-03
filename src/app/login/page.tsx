'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { MaterialIcon } from '@/components/material-icon';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const [loginMode, setLoginMode] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/assets');
      }
    }
  }, [user, isLoading, router]);

  const handleLogin = (role: 'user' | 'admin' = 'user') => {
    login(role);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-stack-lg shadow-lg">
          <MaterialIcon icon="devices" className="text-on-primary" size={40} />
        </div>

        {/* Title */}
        <h1 className="font-headline-md text-headline-md font-bold text-primary mb-stack-xs">
          AssetHub ยืม-คืน
        </h1>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          ระบบยืม-คืนอุปกรณ์ IT&nbsp;&middot; TRR Group
        </p>

        {/* Login Button */}
        <button
          onClick={() => handleLogin('user')}
          className="w-full flex items-center justify-center gap-stack-sm bg-surface-container-lowest border border-outline-variant rounded-xl py-3.5 px-4 shadow-sm hover:bg-surface-container-low transition-colors active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          <span className="text-body-lg font-medium text-on-surface">
            เข้าสู่ระบบด้วยอีเมลบริษัท (Microsoft)
          </span>
        </button>

        {/* Dev mode: admin login */}
        <button
          onClick={() => handleLogin('admin')}
          className="w-full mt-stack-sm flex items-center justify-center gap-stack-sm bg-surface-container-lowest border border-primary/30 rounded-xl py-3.5 px-4 shadow-sm hover:bg-primary-container/30 transition-colors active:scale-[0.98]"
        >
          <MaterialIcon icon="admin_panel_settings" className="text-primary" size={20} />
          <span className="text-body-lg font-medium text-primary">
            [ทดสอบ] เข้าสู่ระบบแบบ Admin
          </span>
        </button>

        <p className="text-body-sm text-on-surface-variant mt-stack-lg leading-relaxed">
          ใช้บัญชี Office 365 ของบริษัทเท่านั้น
          <br />
          เช่น yourname@trrgroup.com
        </p>

        <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant w-full">
          <p className="text-body-sm text-on-surface-variant">
            มีปัญหาการเข้าสู่ระบบ? ติดต่อ IT Support
          </p>
        </div>
      </div>
    </div>
  );
}
