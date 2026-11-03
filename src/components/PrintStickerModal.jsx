import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Sparkles, Check } from 'lucide-react';

export default function PrintStickerModal({ book, onClose }) {
  if (!book) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">QR Stiker chop etish</h3>
              <p className="text-xs text-slate-500">Kitob orqasiga yopishtirish uchun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stiker ko'rinishi (Termoprinter shabloni 58mm) */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div
            id="printable-sticker"
            className="w-64 bg-white border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center text-center shadow-inner relative"
          >
            <div className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase mb-1">
              ★ SMART KUTUBXONA ★
            </div>
            
            {/* QR Kod */}
            <div className="p-2 bg-white rounded-lg border border-slate-200 my-1 shadow-sm">
              <QRCodeSVG
                value={book.id}
                size={120}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Inventar ID */}
            <div className="font-mono font-bold text-sm tracking-wider text-slate-900 bg-slate-100 px-3 py-0.5 rounded mt-1 border border-slate-200">
              {book.id}
            </div>

            {/* Kitob nomi va muallifi */}
            <div className="mt-2 text-xs font-semibold text-slate-800 line-clamp-1">
              {book.title}
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1">
              {book.author} ({book.year})
            </div>

            <div className="mt-2 text-[9px] text-slate-400 border-t border-slate-100 pt-1 w-full">
              Skaner orqali tezkor berish & qaytarish
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            💡 Kichik printercha (58mm yoki stiker qog'oz) ga to'g'ri keladigan o'lcham.
          </p>
        </div>

        {/* Tugmalar */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
          >
            Yopish
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish</span>
          </button>
        </div>

      </div>
    </div>
  );
}
