import React from 'react';
import { BookOpen, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StatsCards({ books, borrows }) {
  // Hisob-kitoblar
  const totalBooks = books.reduce((sum, b) => sum + (Number(b.totalCount) || 0), 0);
  const activeBorrows = borrows.filter(b => b.status === 'active' || b.status === 'overdue').length;
  const availableBooks = books.reduce((sum, b) => sum + (Number(b.availableCount) || 0), 0);
  const overdueBorrows = borrows.filter(b => b.status === 'overdue').length;

  const stats = [
    {
      label: "Jami kitob fondi",
      value: totalBooks,
      subtext: `${books.length} xil nomdagi asarlar`,
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      label: "Talabalarda (ijarada)",
      value: activeBorrows,
      subtext: "Hozir o'qilayotgan kitoblar",
      icon: Users,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      label: "Kutubxonada mavjud",
      value: availableBooks,
      subtext: "Ijaraga berishga tayyor",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      label: "Muddati o'tganlar",
      value: overdueBorrows,
      subtext: overdueBorrows > 0 ? "Shoshilinch qaytarish talab etiladi" : "Barcha muddatlar joyida",
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      bgLight: overdueBorrows > 0 ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{item.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.bgLight}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
              <span>{item.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
