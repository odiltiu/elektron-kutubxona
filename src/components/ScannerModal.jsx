import React, { useState, useEffect, useRef } from 'react';
import { QrCode, X, Search, CheckCircle2, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

export default function ScannerModal({ books, borrows, onClose, onBorrowBook, onReturnBook }) {
  const [scannedCode, setScannedCode] = useState('');
  const [foundBook, setFoundBook] = useState(null);
  const [activeBorrow, setActiveBorrow] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const inputRef = useRef(null);

  // Modal ochilganda skaner kutishi uchun kursorni inputga fokuslaymiz
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearchCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    // 1. Kitobni qidirish
    const b = books.find(item => item.id.toUpperCase() === cleanCode);
    
    // 2. Ushbu kitob bo'yicha faol ijarani qidirish
    const br = borrows.find(item => 
      item.bookId.toUpperCase() === cleanCode && 
      (item.status === 'active' || item.status === 'overdue')
    );

    if (b) {
      setFoundBook(b);
      setActiveBorrow(br || null);
      setStatusMessage({ type: 'success', text: `Kitob topildi: ${b.title}` });
    } else {
      setFoundBook(null);
      setActiveBorrow(null);
      setStatusMessage({ type: 'error', text: `Bunday kodli (${cleanCode}) kitob topilmadi!` });
    }
  };

  const handleKeyDown = (e) => {
    // Skaner apparatlari odatda kodni o'qib oxirida Enter bosadi
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchCode(scannedCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">QR Skaner apparati oynasi</h3>
              <p className="text-xs text-slate-500">Kitob orqasidagi kodni skanerga tuting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skaner kutish maydoni */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Skaner apparatidan o'qilgan kod (yoki qo'lda kiriting):
          </label>
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Masalan: BK-1001"
              className="w-full pl-10 pr-24 py-3 bg-slate-50 border-2 border-emerald-500/40 focus:border-emerald-500 rounded-xl text-slate-900 font-mono font-semibold text-sm outline-none transition-all"
            />
            <QrCode className="w-5 h-5 text-emerald-600 absolute left-3 pointer-events-none" />
            <button
              onClick={() => handleSearchCode(scannedCode)}
              className="absolute right-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Qidirish
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
            Skaner apparati tayyor: QR kodni o'qitsangiz, avtomatik qidiradi.
          </p>
        </div>

        {/* Status xabari */}
        {statusMessage && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Topilgan kitob kartochkasi va tezkor amallar */}
        {foundBook && (
          <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex gap-3">
              <img
                src={foundBook.cover}
                alt={foundBook.title}
                className="w-16 h-22 object-cover rounded-lg shadow-sm border border-slate-200"
              />
              <div className="flex-1">
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {foundBook.id}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{foundBook.title}</h4>
                <p className="text-xs text-slate-600">{foundBook.author} ({foundBook.year})</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">
                    Mavjud: <strong className="text-emerald-700">{foundBook.availableCount}</strong> / {foundBook.totalCount} ta
                  </span>
                </div>
              </div>
            </div>

            {/* Agar kitob hozir talabada bo'lsa: Qaytarib olish tugmasi */}
            {activeBorrow ? (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-800 mb-3">
                  <p className="font-bold">⚠️ Ushbu kitob hozir talabada:</p>
                  <p>Talaba: <strong>{activeBorrow.studentName}</strong> ({activeBorrow.studentGroup})</p>
                  <p>Muddati: {activeBorrow.dueDate}</p>
                </div>
                <button
                  onClick={() => {
                    onReturnBook(activeBorrow.id);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Kutubxonaga qabul qilish (Qaytarildi)</span>
                </button>
              </div>
            ) : (
              /* Agar kitob kutubxonada bo'sh bo'lsa: Talabaga berish */
              <div className="mt-4 pt-3 border-t border-slate-200">
                {foundBook.availableCount > 0 ? (
                  <button
                    onClick={() => {
                      onBorrowBook(foundBook);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Talabaga ijaraga berish</span>
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg">
                    Hozircha bu kitobning barcha nusxalari band!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal pastki qismi */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
}
