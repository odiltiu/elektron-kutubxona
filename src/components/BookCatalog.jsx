import React, { useState } from 'react';
import { Search, PlusCircle, Printer, BookOpen, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function BookCatalog({ books, onBorrowClick, onPrintClick, onAddBookClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Kategoriyalar ro'yxatini aniqlash
  const categories = ['all', ...new Set(books.map(b => b.category))];

  // Filtrlangan kitoblar
  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Yuqori qidiruv va filtr qatori */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Qidiruv inputi */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kitob nomi, muallifi yoki ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Kategoriyalar va Yangi kitob qo'shish */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">Barcha janrlar</option>
            {categories.filter(c => c !== 'all').map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={onAddBookClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Yangi kitob</span>
          </button>
        </div>

      </div>

      {/* Kitoblar kartochkalari tarmog'i */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Hech qanday kitob topilmadi. Qidiruv so'zini tekshiring.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCount > 0;
            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Muqova va yuqori nishonlar */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs font-mono font-bold text-slate-800 text-[11px] px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
                      {book.id}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg backdrop-blur-xs shadow-sm ${
                        isAvailable 
                          ? 'bg-emerald-500/90 text-white' 
                          : 'bg-rose-500/90 text-white'
                      }`}>
                        {isAvailable ? `${book.availableCount} ta mavjud` : 'Band'}
                      </span>
                    </div>
                  </div>

                  {/* Kitob matn ma'lumotlari */}
                  <div className="p-4">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {book.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {book.author} ({book.year})
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Pastki amallar (Berish & Stiker) */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                  <button
                    disabled={!isAvailable}
                    onClick={() => onBorrowClick(book)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isAvailable
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'Talabaga berish' : 'Hozircha band'}</span>
                  </button>

                  <button
                    onClick={() => onPrintClick(book)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                    title="QR Stiker chop etish (Kichik printer uchun)"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
