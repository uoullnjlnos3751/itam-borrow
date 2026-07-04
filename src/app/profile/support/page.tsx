'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, MessageCircle, PhoneCall, ExternalLink } from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4">
        <button onClick={() => router.back()} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full mr-3">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">ช่วยเหลือและสนับสนุน</h1>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} />
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">คู่มือการใช้งานระบบ (FAQ)</h2>
          <p className="text-xs text-slate-500 mb-4">เรียนรู้วิธีการยืมอุปกรณ์ การต่อคิว และคำถามที่พบบ่อย</p>
          <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
            อ่านคู่มือ <ExternalLink size={16} />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 mb-2">ติดต่อแผนก IT Support</h2>
          
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">IT Helpdesk Ticket</div>
              <div className="text-xs text-slate-500">แจ้งปัญหาการใช้งานระบบผ่าน Ticket</div>
            </div>
          </a>

          <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">โทรภายใน (Ext.) 1102</div>
              <div className="text-xs text-slate-500">เวลาทำการ จ.-ศ. 08:30 - 17:30 น.</div>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
