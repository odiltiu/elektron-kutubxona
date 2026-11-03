import { BookOpen, QrCode, Sparkles, PlusCircle, CalendarDays } from "lucide-react";
import { formatLongDate } from "../lib/date";

const TABS = [
  { id: "dashboard", label: "Bosh sahifa" },
  { id: "catalog", label: "Kitoblar fondi" },
  { id: "borrows", label: "Ijaralar" },
];

export default function Header({ activeTab, onNavigate, onOpenScanner, onOpenAi, onOpenAddBook }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      {/* Yuqori sana qatori (muhaddis.uz uslubida) */}
      <div className="hidden border-b border-line/70 sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-mute sm:px-6 lg:px-8">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-gold-deep" aria-hidden="true" />
            {formatLongDate()}
          </span>
          <span>Talabalar va kitoblar hisobi tizimi</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Logotip */}
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex min-w-0 items-center gap-2.5 rounded-xl text-left sm:gap-3"
          aria-label="Smart Kutubxona — bosh sahifa"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold text-ink shadow-card">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold leading-tight text-ink sm:text-lg">Smart Kutubxona</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-text min-[400px]:block">
              Elektron kutubxona
            </span>
          </span>
        </button>

        {/* Asosiy navigatsiya — katta ekranlarda */}
        <nav aria-label="Asosiy bo'limlar" className="hidden items-center gap-1 md:flex">
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onNavigate(t.id)}
                aria-current={active ? "page" : undefined}
                className={`relative min-h-[44px] px-3 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {t.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-gold transition-opacity sm:-bottom-[15px] ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Tezkor amallar */}
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onOpenScanner} className="btn btn-outline px-3 lg:px-4" aria-label="QR skaner">
            <QrCode className="h-4 w-4 text-gold-deep" aria-hidden="true" />
            <span className="hidden lg:inline">QR skaner</span>
          </button>
          <button type="button" onClick={onOpenAi} className="btn btn-outline px-3 lg:px-4" aria-label="Kitob tavsiyasi">
            <Sparkles className="h-4 w-4 text-gold-deep" aria-hidden="true" />
            <span className="hidden lg:inline">Tavsiya</span>
          </button>
          <button type="button" onClick={onOpenAddBook} className="btn btn-gold px-3 sm:px-5" aria-label="Kitob qo'shish">
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Kitob qo'shish</span>
          </button>
        </div>
      </div>

      {/* Telefon uchun bo'limlar qatori (oldin telefonda navigatsiya umuman yo'q edi) */}
      <nav aria-label="Asosiy bo'limlar" className="border-t border-line md:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2">
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onNavigate(t.id)}
                aria-current={active ? "page" : undefined}
                className={`min-h-[40px] shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
                  active ? "bg-gold text-ink" : "text-mute hover:bg-gold-soft hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
