'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { Monitor, Shield, LogIn, Laptop, Smartphone, Key } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Left Column: Hero Design (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Floating background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

        {/* Logo/Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Laptop className="text-white" size={22} />
          </div>
          <span className="font-bold text-xl tracking-wider">AssetHub</span>
        </div>

        {/* Core Marketing message */}
        <div className="my-auto z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            ระบบยืม-คืนอุปกรณ์ IT <br/>
            <span className="text-sky-200">แบบครบวงจร</span>
          </h1>
          <p className="text-sky-100 text-base leading-relaxed">
            เพิ่มความสะดวกรวดเร็วในการขอยืมอุปกรณ์ไอทีสำหรับพนักงาน TRR Group จัดการข้อมูลแบบเรียลไทม์ พร้อมระบบอนุมัติอัตโนมัติ
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <Laptop size={20} className="mb-2 text-sky-200" />
              <div className="text-sm font-semibold">ขอยืมง่าย</div>
              <div className="text-xs text-sky-100 mt-1">ใน 3 ขั้นตอน</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <Smartphone size={20} className="mb-2 text-sky-200" />
              <div className="text-sm font-semibold">รองรับมือถือ</div>
              <div className="text-xs text-sky-100 mt-1">สะดวกทุกที่ทุกเวลา</div>
            </div>
          </div>
        </div>

        {/* Hero Footer */}
        <div className="z-10 text-xs text-sky-200/80">
          &copy; {new Date().getFullYear()} TRR Group IT Support. All rights reserved.
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Top gradient accent for mobile screen */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-indigo-600" />

        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex lg:hidden w-16 h-16 rounded-2xl bg-sky-500 items-center justify-center mb-4 shadow-md shadow-sky-500/20">
              <Laptop className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              ยินดีต้อนรับสู่ <span className="text-sky-500 lg:text-slate-800">AssetHub</span>
            </h2>
            <p className="text-slate-500 text-sm">
              ระบบยืม-คืนอุปกรณ์ IT &middot; TRR Group
            </p>
          </div>

          {/* Form container card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              {/* Microsoft Login Button */}
              <button
                onClick={() => handleLogin('user')}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl py-3 px-4 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer text-slate-700 font-semibold text-sm"
              >
                <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span>เข้าสู่ระบบด้วย Microsoft Account</span>
              </button>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">สำหรับทดสอบระบบ</span>
              </div>

              {/* Dev mode: admin login */}
              <button
                onClick={() => handleLogin('admin')}
                className="w-full flex items-center justify-center gap-2 bg-sky-50 border border-sky-100 hover:bg-sky-100 text-sky-700 rounded-xl py-3 px-4 transition-all active:scale-[0.98] cursor-pointer font-semibold text-sm"
              >
                <Shield size={18} className="text-sky-600" />
                <span>เข้าสู่ระบบในฐานะ IT Admin (Test)</span>
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Key size={14} className="text-slate-400" />
                คำแนะนำในการเข้าใช้งาน
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>กรุณาใช้บัญชี Office 365 ของบริษัทเท่านั้น</li>
                <li>ตัวอย่าง: <span className="font-medium text-slate-600">yourname@trrgroup.com</span></li>
              </ul>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center pt-2 border-t border-slate-200/60">
            <p className="text-xs text-slate-400">
              พบปัญหาเกี่ยวกับการล็อกอิน? กรุณาติดต่อ{' '}
              <a href="#" className="text-sky-500 hover:underline font-semibold">IT Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
