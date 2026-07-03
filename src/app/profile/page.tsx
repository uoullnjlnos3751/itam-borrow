'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcon } from '@/components/material-icon';
import { BottomNav } from '@/components/bottom-nav';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="pb-24">
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex justify-center items-center px-margin-mobile h-16 max-w-2xl mx-auto lg:max-w-none lg:px-8 left-0 right-0 lg:max-w-none lg:left-64">
        <h1 className="font-headline-md text-title-lg font-bold text-primary">โปรไฟล์ของฉัน</h1>
      </header>

      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto lg:max-w-none lg:px-8 space-y-stack-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary-container text-primary flex items-center justify-center text-display-sm font-bold mb-stack-md shadow-sm">
            {user.display_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <h2 className="text-headline-sm font-bold text-on-surface">{user.display_name}</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">{user.email}</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden mt-stack-lg">
          <div className="p-stack-md border-b border-outline-variant flex items-center gap-stack-md">
            <MaterialIcon icon="badge" className="text-primary" />
            <div>
              <p className="text-label-md text-on-surface-variant">แผนก / ฝ่าย</p>
              <p className="text-body-md font-medium text-on-surface">{user.department || '-'}</p>
            </div>
          </div>
          <div className="p-stack-md border-b border-outline-variant flex items-center gap-stack-md">
            <MaterialIcon icon="corporate_fare" className="text-primary" />
            <div>
              <p className="text-label-md text-on-surface-variant">บริษัท</p>
              <p className="text-body-md font-medium text-on-surface">{user.subsidiary || '-'}</p>
            </div>
          </div>
          <div className="p-stack-md flex items-center gap-stack-md">
            <MaterialIcon icon="shield_person" className="text-primary" />
            <div>
              <p className="text-label-md text-on-surface-variant">ระดับสิทธิ์</p>
              <p className="text-body-md font-medium text-on-surface">
                {user.role === 'admin' ? 'ผู้ดูแลระบบ (IT Admin)' : 'พนักงานทั่วไป (User)'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-stack-xl">
          <button
            onClick={handleLogout}
            className="w-full bg-error/10 text-error hover:bg-error/20 text-body-lg font-medium py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-stack-sm"
          >
            <MaterialIcon icon="logout" size={24} />
            ออกจากระบบ
          </button>
        </div>
      </main>

      <BottomNav variant={user.role === 'admin' ? 'admin' : 'user'} />
    </div>
  );
}
