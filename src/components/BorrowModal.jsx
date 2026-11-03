import React, { useState } from 'react';
import { X, BookOpen, Calendar, User, Phone, CheckCircle2 } from 'lucide-react';

export default function BorrowModal({ book, onClose, onSubmitBorrow }) {
  if (!book) return null;

  // Standart qaytarish sanasi (bugundan boshlab 14 kun)
  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [studentName, setStudentName] = useState('');
  const [studentGroup, setStudentGroup] = useState('');
  const [studentPhone, setStudentPhone] = useState('+998 ');
  const [dueDate, setDueDate] = useState(defaultDueDate());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !studentGroup) return;

    onSubmitBorrow({
      bookId: book.id,
      bookTitle: book.title,
      studentName,
      studentGroup,
      studentPhone,
      borrowDate: todayStr,
      dueDate,
      returnDate: null,
      status: 'active'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Talabaga kitob berish</h3>
              <p className="text-xs text-slate-500">Ijaraga rasmiylashtirish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tanlangan kitob qisqacha ma'lumoti */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={book.cover}
            alt={book.title}
            className="w-12 h-16 object-cover rounded-md border border-slate-200 shadow-xs"
          />
          <div>
            <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
              {book.id}
            </span>
            <h4 className="font-bold text-slate-900 text-xs mt-0.5 line-clamp-1">{book.title}</h4>
            <p className="text-[11px] text-slate-500">{book.author}</p>
          </div>
        </div>

        {/* Forma */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Talaba F.I.Sh. *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masalan: Odil Xusanov"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guruhi / Kursi *</label>
              <input
                type="text"
                required
                value={studentGroup}
                onChange={(e) => setStudentGroup(e.target.value)}
                placeholder="FullStack-26"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon raqami</label>
              <input
                type="text"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qaytarish muddati (Deadline) *</label>
            <div className="relative">
              <input
                type="date"
                required
                min={todayStr}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Standart muddat: 14 kun etib belgilangan.</p>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ijarani tasdiqlash</span>
          </button>
        </form>

      </div>
    </div>
  );
}
