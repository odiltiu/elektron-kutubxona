import { useRef } from "react";
import { BookOpen, Download, Upload } from "lucide-react";
import { downloadFile, makeBackup, parseBackup } from "../lib/exportData";
import { todayStr } from "../lib/date";

const LINKS = [
  { id: "dashboard", label: "Bosh sahifa" },
  { id: "catalog", label: "Kitoblar fondi" },
  { id: "borrows", label: "Ijaralar" },
];

export default function Footer({ onNavigate, books, borrows, onRestore, onError }) {
  const fileRef = useRef(null);

  const handleBackup = () => {
    downloadFile(`smart-kutubxona-zaxira-${todayStr()}.json`, makeBackup(books, borrows), "application/json");
  };

  const handleRestoreFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // shu faylni qayta tanlash mumkin bo'lsin
    if (!file) return;
    try {
      const data = parseBackup(await file.text());
      const ok = window.confirm(
        `Zaxirada ${data.books.length} ta kitob va ${data.borrows.length} ta ijara bor.\n` +
          "Joriy ma'lumotlar shu zaxira bilan almashtiriladi. Davom etasizmi?"
      );
      if (ok) onRestore(data);
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <footer className="mt-12 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-ink">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-semibold text-ink">Smart Kutubxona</span>
          </div>
          <p className="mt-3 font-serif text-sm leading-relaxed text-mute">
            Kitoblar fondi, talabalar ijarasi, QR stikerlar va skaner bilan ishlaydigan elektron kutubxona tizimi.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">Bo'limlar</h2>
          <ul className="mt-3 space-y-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(l.id)}
                  className="min-h-[36px] text-sm text-mute transition-colors hover:text-gold-text"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">Ma'lumotlar zaxirasi</h2>
          <p className="mt-3 font-serif text-sm leading-relaxed text-mute">
            Ma'lumotlar shu brauzer xotirasida saqlanadi. Brauzer tozalanib ketmasligi uchun vaqti-vaqti bilan zaxira oling.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={handleBackup} className="btn btn-soft min-h-[40px] px-4 text-xs">
              <Download className="h-4 w-4" aria-hidden="true" />
              Zaxira olish
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-outline min-h-[40px] px-4 text-xs">
              <Upload className="h-4 w-4 text-gold-deep" aria-hidden="true" />
              Zaxiradan tiklash
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleRestoreFile}
              className="sr-only"
              tabIndex={-1}
              aria-label="Zaxira faylini tanlash"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-mute sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Smart Kutubxona. Full-Stack web dasturlash o'quv loyihasi.
        </p>
      </div>
    </footer>
  );
}
