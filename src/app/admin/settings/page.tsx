'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Webhook, Mail, MessageSquare } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [teamsEnabled, setTeamsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [msgPending, setMsgPending] = useState('พนักงานชื่อ [User_Name] ได้ส่งคำขอยืมอุปกรณ์ "[Asset_Name]" เข้าสู่ระบบ กรุณาตรวจสอบและอนุมัติผ่านหน้าระบบ ITAM Borrow ครับ');
  const [msgApproved, setMsgApproved] = useState('สวัสดี [User_Name] คำขอยืมอุปกรณ์ "[Asset_Name]" (รหัสคำขอ: [Request_ID]) ของคุณได้รับการ "อนุมัติ" เรียบร้อยแล้ว 🎉 กรุณาติดต่อรับของที่แผนก IT ครับ');
  const [msgRejected, setMsgRejected] = useState('เรียน [User_Name] ขออภัยครับ คำขอยืม "[Asset_Name]" ของคุณถูกปฏิเสธในครั้งนี้ กรุณาคลิกลิงก์ด้านล่างเพื่อตรวจสอบเหตุผลเพิ่มเติมครับ');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    router.back();
  };

  const inputClass = 'w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4">
        <button onClick={() => router.back()} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full mr-3 cursor-pointer transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">ตั้งค่าการเชื่อมต่อ (Integrations)</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        {/* MS Teams Webhook */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-800">Microsoft Teams Webhook</h2>
              <p className="text-xs text-slate-500">เชื่อมต่อสำหรับส่งการแจ้งเตือนไปยังห้องแชทของทีม</p>
            </div>
            <button
              type="button"
              onClick={() => setTeamsEnabled(!teamsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 cursor-pointer ${teamsEnabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${teamsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="space-y-4 pl-13">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Webhook URL</label>
              <input 
                type="text" 
                placeholder="https://trrgroup.webhook.office.com/..." 
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => alert('กำลังส่งข้อความทดสอบไปยัง Microsoft Teams...')}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                ทดสอบการส่งข้อความ
              </button>
            </div>
          </div>
        </div>

        {/* SMTP Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-800">ระบบส่งอีเมล (SMTP)</h2>
              <p className="text-xs text-slate-500">ตั้งค่า Mail Server สำหรับส่งจดหมายแจ้งเตือนและใบเสร็จรับของ</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 cursor-pointer ${emailEnabled ? 'bg-sky-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="space-y-4 pl-13">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">SMTP Server</label>
                <input 
                  type="text" 
                  placeholder="smtp.office365.com" 
                  value={smtpServer}
                  onChange={e => setSmtpServer(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Port</label>
                <input 
                  type="text" 
                  placeholder="587" 
                  value={smtpPort}
                  onChange={e => setSmtpPort(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Username</label>
                <input 
                  type="text" 
                  placeholder="noreply-itam@trrgroup.com" 
                  value={smtpUser}
                  onChange={e => setSmtpUser(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={smtpPass}
                  onChange={e => setSmtpPass(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => alert('กำลังทดสอบส่งอีเมลด้วยการตั้งค่านี้...')}
                className="text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                ทดสอบการเชื่อมต่อ SMTP
              </button>
            </div>
          </div>
        </div>

        {/* Notification Templates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-800">รูปแบบข้อความแจ้งเตือน</h2>
              <p className="text-xs text-slate-500">ปรับแต่งข้อความที่จะส่งไปยังผู้ใช้งานในแต่ละสถานการณ์</p>
            </div>
          </div>
          
          <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-1">💡 ตัวแปรที่สามารถพิมพ์ใส่ในข้อความได้:</p>
            <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
              <li><code className="text-orange-600 bg-orange-50 px-1 py-0.5 rounded">[User_Name]</code> - ชื่อของผู้ที่ทำการยืม</li>
              <li><code className="text-orange-600 bg-orange-50 px-1 py-0.5 rounded">[Asset_Name]</code> - ชื่ออุปกรณ์ที่ทำรายการ</li>
              <li><code className="text-orange-600 bg-orange-50 px-1 py-0.5 rounded">[Request_ID]</code> - รหัสคำขอยืม (เช่น REQ-10024)</li>
            </ul>
          </div>

          <div className="space-y-4 pl-13">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">เมื่อมีคำขอใหม่ (รออนุมัติ)</label>
              <textarea 
                rows={2}
                value={msgPending}
                onChange={e => setMsgPending(e.target.value)}
                className={inputClass + ' resize-none'}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">เมื่อคำขอได้รับการอนุมัติ</label>
              <textarea 
                rows={2}
                value={msgApproved}
                onChange={e => setMsgApproved(e.target.value)}
                className={inputClass + ' resize-none'}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">เมื่อคำขอถูกปฏิเสธ</label>
              <textarea 
                rows={2}
                value={msgRejected}
                onChange={e => setMsgRejected(e.target.value)}
                className={inputClass + ' resize-none'}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการตั้งค่าระบบ</>}
          </button>
        </div>
      </main>
    </div>
  );
}
