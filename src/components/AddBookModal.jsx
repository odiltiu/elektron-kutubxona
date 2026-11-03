import { useEffect, useRef, useState } from "react";
import { Search, PlusCircle, Loader2, BookOpen, Globe } from "lucide-react";
import Modal from "./ui/Modal";
import BookCover from "./ui/BookCover";

const THIS_YEAR = new Date().getFullYear();

// Google Books ba'zan http:// havola qaytaradi — https saytda bunday rasm bloklanadi
const httpsUrl = (url) => (url ? url.replace(/^http:\/\//, "https://") : "");

export default function AddBookModal({ categories, onClose, onAddBook }) {
  const [tab, setTab] = useState("api"); // api | manual
  const [copies, setCopies] = useState(1);

  // API qidiruv
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Qo'lda kiritish
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: categories[0] || "Umumiy",
    year: THIS_YEAR,
    cover: "",
    description: "",
  });

  // Oyna yopilsa, tugallanmagan so'rov bekor qilinadi
  useEffect(() => () => abortRef.current?.abort(), []);

  const totalCount = Math.max(1, Math.min(999, Number(copies) || 1));

  const handleApiSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Kitoblar bazasidan javob olinmadi. Birozdan keyin urinib ko'ring.");
      const data = await res.json();
      const items = (data.items || []).map((item) => {
        const info = item.volumeInfo || {};
        const year = parseInt(String(info.publishedDate || "").slice(0, 4), 10);
        return {
          key: item.id,
          title: info.title || "Nomsiz kitob",
          author: (info.authors || []).join(", ") || "Noma'lum muallif",
          category: (info.categories || [])[0] || "Umumiy",
          year: Number.isFinite(year) ? year : THIS_YEAR,
          cover: httpsUrl(info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail),
          description: info.description
            ? info.description.length > 180
              ? `${info.description.slice(0, 180)}...`
              : info.description
            : "Kitob tavsifi mavjud emas.",
        };
      });
      if (items.length === 0) setError("Bunday kitob topilmadi. Boshqa so'z bilan qidiring yoki qo'lda kiriting.");
      setResults(items);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Internet bilan bog'lanishda xatolik.");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  };

  const addFromApi = (item) => {
    // eslint-disable-next-line no-unused-vars
    const { key, ...book } = item;
    onAddBook({ ...book, totalCount });
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    const year = Number(form.year);
    onAddBook({
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim() || "Umumiy",
      year: Number.isFinite(year) && year > 0 ? year : THIS_YEAR,
      cover: form.cover.trim(),
      description: form.description.trim() || "Kitob tavsifi kiritilmagan.",
      totalCount,
    });
    onClose();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Modal title="Yangi kitob qo'shish" subtitle="Internet bazasidan topish yoki qo'lda kiritish" icon={PlusCircle} onClose={onClose} size="lg">
      <div role="group" aria-label="Qo'shish usuli" className="grid grid-cols-2 gap-1 rounded-full bg-paper p-1">
        {[
          { id: "api", label: "Internetdan topish", Icon: Globe },
          { id: "manual", label: "Qo'lda kiritish", Icon: BookOpen },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`flex min-h-[40px] items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors ${
              tab === id ? "bg-white text-ink shadow-card" : "text-mute hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="ab-copies" className="text-sm font-medium text-ink">
          Nusxalar soni
        </label>
        <input
          id="ab-copies"
          type="number"
          min="1"
          max="999"
          value={copies}
          onChange={(e) => setCopies(e.target.value)}
          className="input w-24"
        />
      </div>

      {tab === "api" ? (
        <div className="mt-4">
          <form onSubmit={handleApiSearch} className="flex gap-2">
            <label htmlFor="ab-query" className="sr-only">
              Kitob nomi yoki muallif
            </label>
            <input
              id="ab-query"
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kitob nomi yoki muallif (masalan: Clean Code)"
              className="input"
            />
            <button type="submit" disabled={loading} className="btn btn-gold shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
              <span className="hidden sm:inline">Qidirish</span>
            </button>
          </form>

          <div aria-live="polite">
            {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}
            {loading && <p className="mt-3 text-sm text-mute">Qidirilmoqda...</p>}
          </div>

          {results.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {results.map((item) => (
                <li key={item.key} className="flex gap-3 rounded-2xl border border-line p-3 transition-colors hover:border-gold">
                  <BookCover book={item} compact className="h-24 w-16 shrink-0 rounded-md" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{item.title}</p>
                    <p className="line-clamp-1 font-serif text-sm text-mute">{item.author}</p>
                    <p className="text-[11px] text-mute">
                      {item.category} · {item.year}
                    </p>
                    <button type="button" onClick={() => addFromApi(item)} className="btn btn-soft mt-auto min-h-[36px] px-3 text-xs">
                      <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Fondga qo'shish
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length === 0 && !error && (
            <p className="py-8 text-center font-serif text-mute">Kitob nomini yozing — internet bazasidan topib beraman.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="ab-title" className="label">
              Kitob nomi <span className="text-red-700">*</span>
            </label>
            <input id="ab-title" required autoFocus value={form.title} onChange={set("title")} className="input" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ab-author" className="label">
                Muallif <span className="text-red-700">*</span>
              </label>
              <input id="ab-author" required value={form.author} onChange={set("author")} className="input" />
            </div>
            <div>
              <label htmlFor="ab-category" className="label">
                Janr
              </label>
              <input id="ab-category" list="ab-categories" value={form.category} onChange={set("category")} className="input" />
              <datalist id="ab-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ab-year" className="label">
                Nashr yili
              </label>
              <input id="ab-year" type="number" min="1000" max={THIS_YEAR + 1} value={form.year} onChange={set("year")} className="input" />
            </div>
            <div>
              <label htmlFor="ab-cover" className="label">
                Muqova rasmi (havola, ixtiyoriy)
              </label>
              <input id="ab-cover" type="url" value={form.cover} onChange={set("cover")} placeholder="https://..." className="input" />
            </div>
          </div>
          <div>
            <label htmlFor="ab-desc" className="label">
              Qisqacha tavsif
            </label>
            <textarea id="ab-desc" rows={3} value={form.description} onChange={set("description")} className="input py-2.5" />
          </div>
          <button type="submit" className="btn btn-gold w-full">
            Kutubxonaga saqlash
          </button>
        </form>
      )}
    </Modal>
  );
}
