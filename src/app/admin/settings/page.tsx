'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Mail, MessageSquare, ShieldCheck, UserPlus, Search, X, Check, Loader2 } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { User } from '@/lib/database.types';
import { useMsal } from '@azure/msal-react';
import { graphRequest } from '@/lib/msal-config';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { instance, accounts } = useMsal();
  
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

  // Approvers state
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // MS Graph API search state
  const [graphSearchResults, setGraphSearchResults] = useState<User[]>([]);
  const [isSearchingGraph, setIsSearchingGraph] = useState(false);

  const admins = useMemo(() => users.filter(u => u.role === 'admin'), [users]);
  
  const localSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.role !== 'admin' && 
      (u.display_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.department && u.department.toLowerCase().includes(q)))
    );
  }, [users, searchQuery]);

  // Debounced MS Graph API search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setGraphSearchResults([]);
      setIsSearchingGraph(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (accounts.length > 0) {
        setIsSearchingGraph(true);
        try {
          const response = await instance.acquireTokenSilent({
            ...graphRequest,
            account: accounts[0]
          });
          
          const q = searchQuery.replace(/'/g, "''"); // escape single quotes for OData
          const res = await fetch(`https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'${q}') or startswith(mail,'${q}')&$select=id,displayName,mail,jobTitle,department,officeLocation&$top=10`, {
            headers: {
              Authorization: `Bearer ${response.accessToken}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            const graphUsers: User[] = data.value.map((gu: any) => ({
              id: gu.id, // Using entra_object_id as temporary ID if not in DB
              entra_object_id: gu.id,
              email: gu.mail || '',
              display_name: gu.displayName || 'Unknown',
              department: gu.department || null,
              subsidiary: null,
              job_title: gu.jobTitle || null,
              work_location: gu.officeLocation || null,
              role: 'user',
              is_active: true,
              last_login_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));
            
            // Filter out users who are already admins in our local state
            const nonAdmins = graphUsers.filter(gu => !admins.find(a => a.entra_object_id === gu.entra_object_id));
            setGraphSearchResults(nonAdmins);
          } else {
            console.error("MS Graph API Error:", await res.text());
          }
        } catch (err) {
          console.error("Error searching MS Graph API:", err);
        } finally {
          setIsSearchingGraph(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, instance, accounts, admins]);

  const displaySearchResults = graphSearchResults.length > 0 ? graphSearchResults : localSearchResults;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    router.back();
  };

  const handlePromoteToAdmin = (selectedUser: User) => {
    setUsers(prev => {
      const exists = prev.find(u => u.id === selectedUser.id || u.entra_object_id === selectedUser.entra_object_id);
      if (exists) {
        return prev.map(u => u.id === exists.id ? { ...u, role: 'admin' } : u);
      } else {
        // User from MS Graph, not in DB yet
        return [...prev, { ...selectedUser, role: 'admin' }];
      }
    });
    setSearchQuery('');
    setGraphSearchResults([]);
    setIsApproverModalOpen(false);
  };

  const handleRevokeAdmin = (userId: string) => {
    if (confirm('คุณแน่ใจว่าต้องการถอดถอนสิทธิ์ IT Admin ของผู้ใช้นี้หรือไม่?')) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'user' } : u));
    }
  };

  const inputClass = 'w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4">
        <button onClick={() => router.back()} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full mr-3 cursor-pointer transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">ตั้งค่าระบบ (Settings)</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Approvers / IT Admins Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">ผู้มีสิทธิ์อนุมัติคำขอ (IT Admin)</h2>
                  <p className="text-xs text-slate-500">จัดการรายชื่อ IT Admin ที่สามารถกดอนุมัติคำขอยืมอุปกรณ์จากผู้ใช้ทุกบริษัทได้</p>
                </div>
              </div>
              <button 
                onClick={() => setIsApproverModalOpen(true)}
                className="shrink-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">เพิ่มผู้อนุมัติ</span>
              </button>
            </div>
          </div>
          <div className="p-6 bg-slate-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {admins.map(admin => (
                <div key={admin.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0 overflow-hidden">
                      {admin.profile_image_url ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={admin.profile_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        admin.display_name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{admin.display_name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{admin.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRevokeAdmin(admin.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer shrink-0"
                    title="ถอดถอนสิทธิ์ IT Admin"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {admins.length === 0 && (
                <div className="col-span-full text-center py-6 text-sm text-slate-400">
                  ยังไม่มีผู้มีสิทธิ์อนุมัติในระบบ
                </div>
              )}
            </div>
          </div>
        </div>

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
          <div className="space-y-4 sm:pl-13">
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
          <div className="space-y-4 sm:pl-13">
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

          <div className="space-y-4 sm:pl-13">
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

      {/* Add Approver Modal */}
      {isApproverModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">เพิ่มผู้อนุมัติ (IT Admin)</h2>
              <button 
                onClick={() => {
                  setIsApproverModalOpen(false);
                  setSearchQuery('');
                  setGraphSearchResults([]);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                {isSearchingGraph ? (
                  <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500 animate-spin" size={18} />
                ) : (
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                )}
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อ หรืออีเมลพนักงานในองค์กร..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all shadow-sm"
                />
              </div>
              <div className="mt-2 text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                เชื่อมต่อฐานข้อมูล Microsoft Entra ID ขององค์กรแล้ว
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {!searchQuery.trim() ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  พิมพ์ชื่อหรืออีเมล 3 ตัวอักษรขึ้นไปเพื่อค้นหา
                </div>
              ) : isSearchingGraph && displaySearchResults.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-sky-500" size={24} />
                  กำลังค้นหาจากระบบส่วนกลาง...
                </div>
              ) : displaySearchResults.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  ไม่พบรายชื่อพนักงานที่ค้นหา
                </div>
              ) : (
                <div className="space-y-1">
                  {displaySearchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold border border-sky-200 shrink-0 overflow-hidden">
                          {user.profile_image_url ? (
                             // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.display_name.charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{user.display_name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{user.email} • {user.department || 'ไม่ระบุแผนก'}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePromoteToAdmin(user)}
                        className="shrink-0 flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Check size={14} />
                        แต่งตั้ง
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
