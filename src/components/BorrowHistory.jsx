import React, { useState } from 'react';
import { RefreshCw, Search, AlertCircle, CheckCircle2, Clock, Phone, User, Calendar } from 'lucide-react';

export default function BorrowHistory({ borrows, onReturnBook }) {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'overdue', 'returned'
  const [search, setSearch] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filtered = borrows.filter(item => {
    // Holatni tekshirish
    const matchesFilter = filter === 'all' || item.status === filter;

    // Qidiruv
    const matchesSearch =
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.studentGroup.toLowerCase().includes(search.toLowerCase()) ||
      item.bookId.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Yuqori boshqaruv qatori */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Talaba, guruh yoki kitob bo'yicha..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filtr tugmalari */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'active', label: 'Faol ijaralar' },
            { id: 'overdue', label: '⚠️ Muddati o\'tganlar' },
            { id: 'returned', label: 'Qaytarilganlar' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jadval */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
              <th className="py-3 px-4">Talaba</th>
              <th className="py-3 px-4">Kitob</th>
              <th className="py-3 px-4">Berilgan sana</th>
              <th className="py-3 px-4">Qaytarish muddati</th>
              <th className="py-3 px-4">Holati</th>
              <th className="py-3 px-4 text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  Ijaralar tarixi bo'yicha ma'lumot topilmadi.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isOverdue = item.status === 'overdue' || (item.status === 'active' && item.dueDate < today);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Talaba ma'lumoti */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.studentName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{item.studentGroup}</span>
                        {item.studentPhone && <span>• {item.studentPhone}</span>}
                      </div>
                    </td>

                    {/* Kitob ma'lumoti */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {item.bookId}
                      </span>
                      <div className="font-semibold text-slate-800 mt-0.5">{item.bookTitle}</div>
                    </td>

                    {/* Berilgan sana */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.borrowDate}
                    </td>

                    {/* Qaytarish muddati */}
                    <td className="py-3.5 px-4 font-medium">
                      <span className={isOverdue ? "text-rose-600 font-bold" : "text-slate-700"}>
                        {item.dueDate}
                      </span>
                    </td>

                    {/* Holati */}
                    <td className="py-3.5 px-4">
                      {item.status === 'returned' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Qaytarilgan
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          Muddati o'tgan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          <Clock className="w-3 h-3" />
                          O'qilmoqda
                        </span>
                      )}
                    </td>

                    {/* Amal (Qaytarib olish) */}
                    <td className="py-3.5 px-4 text-right">
                      {item.status !== 'returned' ? (
                        <button
                          onClick={() => onReturnBook(item.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Qaytarib olish</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {item.returnDate ? `Qaytarildi: ${item.returnDate}` : 'Tugallangan'}
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
