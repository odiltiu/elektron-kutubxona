import { useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import StatusChip from "./ui/StatusChip";
import { normalize } from "../lib/library";
import { formatDate, daysBetween, todayStr } from "../lib/date";

const FILTERS = [
  { id: "all", label: "Barchasi" },
  { id: "active", label: "Faol" },
  { id: "overdue", label: "Muddati o'tgan" },
  { id: "returned", label: "Qaytarilgan" },
];

export default function BorrowHistory({ borrows, onReturnBook }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const today = todayStr();

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.id] = f.id === "all" ? borrows.length : borrows.filter((b) => b.status === f.id).length;
    return acc;
  }, {});

  const q = normalize(search);
  const filtered = borrows.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      !q ||
      [item.studentName, item.bookTitle, item.studentGroup, item.bookId].some((f) => normalize(f).includes(q));
    return matchesFilter && matchesSearch;
  });

  // Muddatga nisbatan qisqa izoh: "3 kun qoldi" / "5 kun kechikdi"
  const dueNote = (item) => {
    if (item.status === "returned") return item.returnDate ? `Qaytarildi: ${formatDate(item.returnDate)}` : "Tugallangan";
    const d = daysBetween(today, item.dueDate);
    if (d < 0) return `${-d} kun kechikdi`;
    if (d === 0) return "Bugun qaytarilishi kerak";
    return `${d} kun qoldi`;
  };

  const returnButton = (item) =>
    item.status !== "returned" && (
      <button type="button" onClick={() => onReturnBook(item.id)} className="btn btn-soft min-h-[40px] px-4 text-xs">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Qaytarib olish
      </button>
    );

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <label htmlFor="borrow-search" className="sr-only">
            Ijaralarni qidirish
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden="true" />
          <input
            id="borrow-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Talaba, guruh yoki kitob..."
            className="input pl-10"
          />
        </div>

        <div role="group" aria-label="Holat bo'yicha filtr" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:pb-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-xs font-medium transition-colors ${
                filter === f.id ? "bg-gold text-ink" : "bg-paper text-mute hover:text-ink"
              }`}
            >
              {f.label} <span className="opacity-70">({counts[f.id]})</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="p-10 text-center font-serif text-mute">Ijaralar bo'yicha ma'lumot topilmadi.</p>
      ) : (
        <>
          {/* Telefon: kartalar */}
          <ul className="divide-y divide-line md:hidden">
            {filtered.map((item) => (
              <li key={item.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{item.studentName}</p>
                    <p className="text-xs text-mute">
                      {item.studentGroup}
                      {item.studentPhone && item.studentPhone.trim() !== "+998" ? ` · ${item.studentPhone}` : ""}
                    </p>
                  </div>
                  <StatusChip status={item.status} />
                </div>
                <p className="font-serif text-ink">
                  <span className="mr-1.5 font-mono text-[11px] text-mute">{item.bookId}</span>
                  {item.bookTitle}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs ${item.status === "overdue" ? "font-semibold text-red-700" : "text-mute"}`}>
                    {formatDate(item.borrowDate)} → {formatDate(item.dueDate)}
                    <br />
                    {dueNote(item)}
                  </p>
                  {returnButton(item)}
                </div>
              </li>
            ))}
          </ul>

          {/* Katta ekran: jadval */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-xs uppercase tracking-wider text-mute">
                  <th scope="col" className="px-4 py-3 font-medium">Talaba</th>
                  <th scope="col" className="px-4 py-3 font-medium">Kitob</th>
                  <th scope="col" className="px-4 py-3 font-medium">Berilgan</th>
                  <th scope="col" className="px-4 py-3 font-medium">Muddat</th>
                  <th scope="col" className="px-4 py-3 font-medium">Holati</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-paper/60">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-ink">{item.studentName}</div>
                      <div className="text-xs text-mute">
                        {item.studentGroup}
                        {item.studentPhone && item.studentPhone.trim() !== "+998" ? ` · ${item.studentPhone}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] text-mute">{item.bookId}</span>
                      <div className="font-serif text-ink">{item.bookTitle}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-mute">{formatDate(item.borrowDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className={item.status === "overdue" ? "font-semibold text-red-700" : "text-ink"}>
                        {formatDate(item.dueDate)}
                      </div>
                      <div className="text-xs text-mute">{dueNote(item)}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusChip status={item.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">{returnButton(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
