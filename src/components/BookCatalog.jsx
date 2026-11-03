import { useMemo, useState } from "react";
import { Search, PlusCircle, Printer, BookOpen } from "lucide-react";
import BookCover from "./ui/BookCover";
import { normalize } from "../lib/library";

const AVAILABILITY = [
  { id: "all", label: "Barchasi" },
  { id: "available", label: "Mavjud" },
  { id: "busy", label: "Band" },
];

export default function BookCatalog({ books, onBorrowClick, onPrintClick, onAddBookClick }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");

  // Janrlar va har biridagi kitoblar soni ("Ruknlar" paneli uchun)
  const categories = useMemo(() => {
    const counts = new Map();
    books.forEach((b) => counts.set(b.category, (counts.get(b.category) || 0) + 1));
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [books]);

  const q = normalize(search);
  const filtered = books.filter((b) => {
    const matchesSearch =
      !q || [b.title, b.author, b.id, b.category].some((field) => normalize(field).includes(q));
    const matchesCategory = category === "all" || b.category === category;
    const matchesAvailability =
      availability === "all" || (availability === "available" ? b.availableCount > 0 : b.availableCount === 0);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const categoryButton = (id, label, count) => {
    const active = category === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setCategory(id)}
        aria-pressed={active}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl px-3 text-left text-sm transition-colors ${
          active ? "bg-gold-soft font-semibold text-gold-text" : "text-ink hover:bg-paper"
        }`}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${active ? "bg-gold-deep" : "bg-line"}`} />
          {label}
        </span>
        <span className="text-xs text-mute">{count}</span>
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
      {/* Ruknlar (janrlar) paneli */}
      <aside className="card h-fit p-4 lg:sticky lg:top-32">
        <h2 className="px-3 pb-2 text-sm font-semibold text-ink">Ruknlar</h2>
        {/* Telefonda gorizontal, katta ekranda vertikal ro'yxat */}
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:block lg:space-y-0.5 lg:overflow-visible">
          <div className="shrink-0 lg:shrink">{categoryButton("all", "Barcha kitoblar", books.length)}</div>
          {categories.map(([name, count]) => (
            <div key={name} className="shrink-0 lg:shrink">
              {categoryButton(name, name, count)}
            </div>
          ))}
        </div>
      </aside>

      <div className="space-y-5">
        {/* Qidiruv va filtrlar */}
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Kitob qidirish
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kitob nomi, muallif yoki ID..."
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div role="group" aria-label="Mavjudligi bo'yicha" className="flex rounded-full bg-paper p-1">
              {AVAILABILITY.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvailability(a.id)}
                  aria-pressed={availability === a.id}
                  className={`min-h-[36px] rounded-full px-3 text-xs font-medium transition-colors ${
                    availability === a.id ? "bg-white text-ink shadow-card" : "text-mute hover:text-ink"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={onAddBookClick} className="btn btn-gold shrink-0 px-4">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Yangi kitob</span>
              <span className="sr-only sm:hidden">Yangi kitob</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-mute" aria-live="polite">
          {filtered.length} ta kitob topildi
        </p>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-gold/60" aria-hidden="true" />
            <p className="mt-3 font-serif text-mute">Hech qanday kitob topilmadi. Qidiruv so'zi yoki filtrni o'zgartiring.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filtered.map((book) => {
              const isAvailable = book.availableCount > 0;
              return (
                <li key={book.id} className="card flex gap-4 p-4 transition-shadow hover:shadow-lift">
                  <BookCover book={book} className="h-36 w-24 shrink-0 rounded-xl shadow-card sm:h-40 sm:w-28" />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-mute">{book.id}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-text">
                        {book.category}
                      </span>
                    </div>
                    <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-ink">{book.title}</h3>
                    <p className="font-serif text-sm text-mute">
                      {book.author} · {book.year}
                    </p>
                    <p className="mt-1.5 line-clamp-2 font-serif text-sm leading-snug text-ink/75">{book.description}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                      <span className={`chip ${isAvailable ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                        {isAvailable ? `${book.availableCount} / ${book.totalCount} mavjud` : "Hozircha band"}
                      </span>
                      <div className="ml-auto flex gap-2">
                        <button
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => onBorrowClick(book)}
                          className="btn btn-gold min-h-[40px] px-4 text-xs"
                        >
                          Talabaga berish
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintClick(book)}
                          aria-label={`${book.title} uchun QR stiker chop etish`}
                          className="btn btn-outline min-h-[40px] px-3"
                        >
                          <Printer className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
