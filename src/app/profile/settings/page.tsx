'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Bell, Mail, MessageSquare } from 'lucide-react';

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [emailNotif, setEmailNotif] = useState(true);
  const [teamsNotif, setTeamsNotif] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4">
        <button onClick={() => router.back()} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full mr-3">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">การตั้งค่าการแจ้งเตือน</h1>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Mail size={16} className="text-sky-500" /> แจ้งเตือนทางอีเมล (Email)
            </h2>
            <p className="text-xs text-slate-500 mb-4">รับข้อมูลการอนุมัติ ทวงคืนอุปกรณ์ และใบเสร็จทางอีเมล</p>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-semibold text-slate-700">เปิดใช้งาน Email</span>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                checked={emailNotif}
                onChange={e => setEmailNotif(e.target.checked)}
              />
            </label>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-500" /> แจ้งเตือนผ่าน MS Teams
            </h2>
            <p className="text-xs text-slate-500 mb-4">รับข้อความแจ้งเตือนผ่านบอทใน Microsoft Teams</p>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-semibold text-slate-700">เปิดใช้งาน MS Teams</span>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                checked={teamsNotif}
                onChange={e => setTeamsNotif(e.target.checked)}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-sky-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {saving ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการตั้งค่า</>}
        </button>
      </main>
    </div>
  );
}
