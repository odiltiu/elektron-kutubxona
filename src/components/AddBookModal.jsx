import React, { useState } from 'react';
import { X, Search, PlusCircle, Loader2, BookOpen, Sparkles, Check } from 'lucide-react';

export default function AddBookModal({ onClose, onAddBook, existingBooksCount }) {
  const [activeTab, setActiveTab] = useState('api'); // 'api' yoki 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Qo'lda kiritish formasi
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Dasturlash',
    year: 2026,
    totalCount: 3,
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    description: ''
  });

  // Tashqi API orqali qidirish (Google Books API)
  const handleApiSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=6`);
      if (!res.ok) throw new Error("API dan ma'lumot olishda xatolik yuz berdi");
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const formatted = data.items.map(item => {
          const info = item.volumeInfo || {};
          return {
            title: info.title || "Nomsiz kitob",
            author: (info.authors && info.authors.join(", ")) || "Noma'lum muallif",
            category: (info.categories && info.categories[0]) || "Umumiy",
            year: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : 2024,
            cover: (info.imageLinks && (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
            description: info.description ? info.description.substring(0, 160) + "..." : "Kitob tavsifi mavjud emas.",
            totalCount: 3
          };
        });
        setSearchResults(formatted);
      } else {
        setError("Bunday nomdagi kitob topilmadi. Qidiruv so'zini o'zgartirib ko'ring yoki qo'lda kiriting.");
      }
    } catch (err) {
      setError(err.message || "Internet yoki API bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApiBook = (item) => {
    const nextId = `BK-${1000 + existingBooksCount + 1}`;
    onAddBook({
      ...item,
      id: nextId,
      availableCount: item.totalCount
    });
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    const nextId = `BK-${1000 + existingBooksCount + 1}`;
    onAddBook({
      ...formData,
      id: nextId,
      totalCount: Number(formData.totalCount) || 1,
      availableCount: Number(formData.totalCount) || 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Yangi kitob qo'shish</h3>
              <p className="text-xs text-slate-500">API orqali avtomatik topish yoki qo'lda kiritish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tablar (API qidiruv vs Qo'lda) */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl my-4">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'api' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tashqi API orqali qidirish (Tavsiya etiladi)</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Qo'lda to'ldirish</span>
          </button>
        </div>

        {/* TANA QISMI */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'api' ? (
            <div>
              {/* Qidiruv inputi */}
              <form onSubmit={handleApiSearch} className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kitob nomi yoki muallifini yozing (masalan: Clean Code, Python, Fizika)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Qidirish</span>
                </button>
              </form>

              {/* Xatolik xabari */}
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200 mb-3">
                  {error}
                </div>
              )}

              {/* API natijalari ro'yxati */}
              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-sm transition-all flex gap-3"
                    >
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-14 h-20 object-cover rounded-md border border-slate-100 shadow-xs shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.author}</p>
                          <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {item.category} • {item.year}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSelectApiBook(item)}
                          className="mt-2 py-1 px-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Fondga qo'shish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Boshlang'ich maslahat */}
              {!loading && searchResults.length === 0 && !error && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Qidiruv maydoniga kitob nomini yozing, API avtomatik topib beradi.
                </div>
              )}
            </div>
          ) : (
            /* Qo'lda to'ldirish formasi */
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kitob nomi *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Kitobning to'liq nomi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Muallif *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Muallif ismi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategoriya / Janr</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Dasturlash, Badiiy..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nashr yili</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kutubxonadagi nusxalar soni</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCount}
                    onChange={(e) => setFormData({ ...formData, totalCount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Muqova rasm havolasi (URL)</label>
                <input
                  type="url"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qisqacha tavsif</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kitob nima haqidaligi haqida qisqacha..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Kutubxonaga saqlash
              </button>
            </form>
          )}
        </div>

        {/* Modal pastki qismi */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
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
