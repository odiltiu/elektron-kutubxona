import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import BookCatalog from './components/BookCatalog';
import BorrowHistory from './components/BorrowHistory';
import ScannerModal from './components/ScannerModal';
import AddBookModal from './components/AddBookModal';
import BorrowModal from './components/BorrowModal';
import PrintStickerModal from './components/PrintStickerModal';
import AiAssistantModal from './components/AiAssistantModal';
import { INITIAL_BOOKS, INITIAL_BORROWS } from './data/initialData';
import { QrCode, Sparkles, PlusCircle, BookOpen, ArrowRight, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  // 1. Kitoblar holati (LocalStorage bilan)
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('smart_library_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  // 2. Ijaralar holati (LocalStorage bilan)
  const [borrows, setBorrows] = useState(() => {
    const saved = localStorage.getItem('smart_library_borrows');
    return saved ? JSON.parse(saved) : INITIAL_BORROWS;
  });

  // 3. Faol bo'lim (Tab)
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'catalog', 'borrows'

  // 4. Modallar boshqaruvi
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState(null);
  const [selectedBookForPrint, setSelectedBookForPrint] = useState(null);

  // LocalStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('smart_library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('smart_library_borrows', JSON.stringify(borrows));
  }, [borrows]);

  // Muddati o'tganlarni avtomatik tekshirish
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBorrows(prev => prev.map(item => {
      if (item.status === 'active' && item.dueDate < today) {
        return { ...item, status: 'overdue' };
      }
      return item;
    }));
  }, []);

  // Yangi kitob qo'shish
  const handleAddBook = (newBook) => {
    setBooks(prev => [newBook, ...prev]);
  };

  // Talabaga kitob berish
  const handleBorrowBook = (borrowData) => {
    const newBorrow = {
      ...borrowData,
      id: `BR-${Math.floor(100 + Math.random() * 900)}`
    };

    // Ijaralar ro'yxatiga qo'shish
    setBorrows(prev => [newBorrow, ...prev]);

    // Kitobning mavjud nusxalarini 1 taga kamaytirish
    setBooks(prev => prev.map(b => {
      if (b.id === borrowData.bookId) {
        return { ...b, availableCount: Math.max(0, b.availableCount - 1) };
      }
      return b;
    }));
  };

  // Kitobni qabul qilib olish (Qaytarildi)
  const handleReturnBook = (borrowId) => {
    const today = new Date().toISOString().split('T')[0];
    let returnedBookId = null;

    setBorrows(prev => prev.map(b => {
      if (b.id === borrowId) {
        returnedBookId = b.bookId;
        return { ...b, status: 'returned', returnDate: today };
      }
      return b;
    }));

    // Kitob fondidagi mavjud nusxani 1 taga ko'paytirish
    if (returnedBookId) {
      setBooks(prev => prev.map(b => {
        if (b.id === returnedBookId) {
          return { ...b, availableCount: Math.min(b.totalCount, b.availableCount + 1) };
        }
        return b;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Asosiy Sarlavha (Header) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenAddBook={() => setIsAddBookOpen(true)}
      />

      {/* Asosiy kontent maydoni */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* =========================================================
            1. BOSH OYNA (DASHBOARD)
            ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Salomlashish va tezkor banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Kutubxona Avtomatlashtirilgan Tizimi
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Xush kelibsiz! Kitoblar va Talabalar nazorati
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Skaner apparati orqali kitoblarni bir soniyada berish va qabul qilish, 
                  kichik printer orqali QR stikerlar chiqarish va sun'iy intellekt tavsiyalaridan foydalaning.
                </p>

                {/* Tezkor tugmalar */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Skaner bilan o'qitish</span>
                  </button>

                  <button
                    onClick={() => setIsAiOpen(true)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-2 backdrop-blur-xs transition-all border border-white/10"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Kutubxonachi</span>
                  </button>
                </div>
              </div>

              {/* Orqa fon bezaklari */}
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
                <BookOpen className="w-64 h-64 text-white" />
              </div>
            </div>

            {/* Statistika kartalari (4 ta asosiy blok) */}
            <StatsCards books={books} borrows={borrows} />

            {/* Pastki 2 ustun: Tezkor fond & Oxirgi ijaralar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chap ustun (2 qism): Ommabop kitoblar vitrinasi */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Kutubxonadagi kitoblar (Fondi)</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Barchasini ko'rish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {books.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex gap-3 items-center"
                    >
                      <img
                        src={b.cover}
                        alt={b.title}
                        className="w-12 h-16 object-cover rounded-md border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[9px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          {b.id}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs mt-1 truncate">{b.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{b.author}</p>
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span className={b.availableCount > 0 ? "text-emerald-700 font-semibold" : "text-rose-600 font-semibold"}>
                            {b.availableCount > 0 ? `${b.availableCount} ta mavjud` : 'Barchasi ijarada'}
                          </span>
                          <button
                            onClick={() => setSelectedBookForPrint(b)}
                            className="text-slate-400 hover:text-slate-700 text-[10px] underline"
                          >
                            QR stiker
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* O'ng ustun (1 qism): So'nggi ijaralar qisqacha ko'rinishi */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">So'nggi ijaralar</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('borrows')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Barchasi
                    </button>
                  </div>

                  <div className="space-y-3">
                    {borrows.slice(0, 4).map((br) => (
                      <div
                        key={br.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-900 truncate">{br.studentName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{br.bookTitle}</p>
                        </div>
                        <div>
                          {br.status === 'returned' ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Qaytarildi
                            </span>
                          ) : br.status === 'overdue' ? (
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                              Kechikkan
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                              {br.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('borrows')}
                  className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Ijaralarni boshqarish
                </button>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            2. KITOBLAR FONDI (KATALOG)
            ========================================================= */}
        {activeTab === 'catalog' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Kitoblar fondi</h2>
                <p className="text-xs text-slate-500">Kutubxonadagi barcha kitoblar ro'yxati va holati</p>
              </div>
            </div>
            <BookCatalog
              books={books}
              onBorrowClick={(book) => setSelectedBookForBorrow(book)}
              onPrintClick={(book) => setSelectedBookForPrint(book)}
              onAddBookClick={() => setIsAddBookOpen(true)}
            />
          </div>
        )}

        {/* =========================================================
            3. IJARALAR VA QAYTARIB OLISH
            ========================================================= */}
        {activeTab === 'borrows' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Talabalar ijarasi hisobi</h2>
                <p className="text-xs text-slate-500">Berilgan kitoblar, qaytarish muddatlari va qarzdorlik nazorati</p>
              </div>
            </div>
            <BorrowHistory
              borrows={borrows}
              onReturnBook={handleReturnBook}
            />
          </div>
        )}

      </main>

      {/* =========================================================
          MODAL OYNALAR (MODALS)
          ========================================================= */}
      
      {/* 1. Skaner apparatidan o'qish modali */}
      {isScannerOpen && (
        <ScannerModal
          books={books}
          borrows={borrows}
          onClose={() => setIsScannerOpen(false)}
          onBorrowBook={(book) => setSelectedBookForBorrow(book)}
          onReturnBook={handleReturnBook}
        />
      )}

      {/* 2. Yangi kitob qo'shish (Google Books API) */}
      {isAddBookOpen && (
        <AddBookModal
          onClose={() => setIsAddBookOpen(false)}
          onAddBook={handleAddBook}
          existingBooksCount={books.length}
        />
      )}

      {/* 3. Talabaga kitob berish modali */}
      {selectedBookForBorrow && (
        <BorrowModal
          book={selectedBookForBorrow}
          onClose={() => setSelectedBookForBorrow(null)}
          onSubmitBorrow={handleBorrowBook}
        />
      )}

      {/* 4. Termoprinter / Sticker printer uchun QR stiker chiqarish */}
      {selectedBookForPrint && (
        <PrintStickerModal
          book={selectedBookForPrint}
          onClose={() => setSelectedBookForPrint(null)}
        />
      )}

      {/* 5. AI Kutubxonachi yordamchisi */}
      {isAiOpen && (
        <AiAssistantModal
          books={books}
          onClose={() => setIsAiOpen(false)}
          onSelectBookForBorrow={(book) => setSelectedBookForBorrow(book)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4 text-center text-xs text-slate-400">
        Smart Kutubxona © 2026 — Full-Stack Web Dasturlash o'quv dasturi asosida ishlab chiqilgan.
      </footer>

    </div>
  );
}
