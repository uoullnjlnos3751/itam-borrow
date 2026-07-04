import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, Camera, Keyboard } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setMode('camera');
      setManualCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <h2 className="font-bold text-slate-800 text-lg">สแกน QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 relative">
          {/* Mode Switcher */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6 relative z-10">
            <button
              onClick={() => setMode('camera')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'camera'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Camera size={16} /> กล้อง
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'manual'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Keyboard size={16} /> กรอกรหัสเอง
            </button>
          </div>

          {mode === 'camera' ? (
            <div className="rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-black aspect-square relative">
              <Scanner
                onScan={(result) => {
                  if (result && result.length > 0) {
                    onScan(result[0].rawValue);
                  }
                }}
                components={{
                  finder: false,
                }}
              />
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                <div className="w-full h-full border-2 border-sky-400/80 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4 py-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  กรอก Tag ID ของอุปกรณ์
                </label>
                <input
                  type="text"
                  placeholder="เช่น TAG-88291-LX"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-sm shadow-sky-500/20 active:scale-95"
              >
                ยืนยันรหัส
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 font-medium mt-6">
            {mode === 'camera'
              ? 'จัดให้ QR Code อยู่ตรงกลางกรอบ เพื่อสแกนอัตโนมัติ'
              : 'สามารถดู Tag ID ได้ที่ใต้เครื่องหรือบนฉลากอุปกรณ์'}
          </p>
        </div>
      </div>
    </div>
  );
}
