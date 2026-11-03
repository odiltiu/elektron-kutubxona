import { BookOpen, Users, CheckCircle2, AlertTriangle } from "lucide-react";

export default function StatsCards({ books, borrows }) {
  const totalBooks = books.reduce((sum, b) => sum + (Number(b.totalCount) || 0), 0);
  const availableBooks = books.reduce((sum, b) => sum + (Number(b.availableCount) || 0), 0);
  const activeBorrows = borrows.filter((b) => b.status !== "returned").length;
  const overdue = borrows.filter((b) => b.status === "overdue").length;

  const stats = [
    { label: "Jami kitob fondi", value: totalBooks, sub: `${books.length} xil nomdagi asar`, Icon: BookOpen },
    { label: "Talabalarda", value: activeBorrows, sub: "Hozir o'qilayotgan kitoblar", Icon: Users },
    { label: "Kutubxonada mavjud", value: availableBooks, sub: "Berishga tayyor nusxalar", Icon: CheckCircle2 },
    {
      label: "Muddati o'tgan",
      value: overdue,
      sub: overdue > 0 ? "Qaytarish talab etiladi" : "Barcha muddatlar joyida",
      Icon: AlertTriangle,
      danger: overdue > 0,
    },
  ];

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, sub, Icon, danger }) => (
        <li key={label} className={`card p-5 ${danger ? "border-red-200" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-mute">{label}</p>
              <p className={`mt-1 text-3xl font-semibold ${danger ? "text-red-700" : "text-ink"}`}>{value}</p>
            </div>
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl ${
                danger ? "bg-red-50 text-red-700" : "bg-gold-soft text-gold-text"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 border-t border-line pt-3 font-serif text-sm text-mute">{sub}</p>
        </li>
      ))}
    </ul>
  );
}
