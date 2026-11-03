import { useCallback, useEffect, useMemo, useState } from "react";
import { QrCode, Sparkles, BookOpen, ArrowRight, AlertTriangle } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StatsCards from "./components/StatsCards";
import BookCatalog from "./components/BookCatalog";
import BorrowHistory from "./components/BorrowHistory";
import ScannerModal from "./components/ScannerModal";
import AddBookModal from "./components/AddBookModal";
import BorrowModal from "./components/BorrowModal";
import PrintStickerModal from "./components/PrintStickerModal";
import AiAssistantModal from "./components/AiAssistantModal";
import SectionTitle from "./components/ui/SectionTitle";
import BookCover from "./components/ui/BookCover";
import StatusChip from "./components/ui/StatusChip";
import { INITIAL_BOOKS, INITIAL_BORROWS } from "./data/initialData";
import { loadJSON, saveJSON, nextBookId, nextBorrowId, withStatus, normalize } from "./lib/library";
import { todayStr, formatDate } from "./lib/date";

const BOOKS_KEY = "smart_library_books";
const BORROWS_KEY = "smart_library_borrows";

export default function App() {
  const [books, setBooks] = useState(() => loadJSON(BOOKS_KEY, INITIAL_BOOKS));
  const [borrows, setBorrows] = useState(() => loadJSON(BORROWS_KEY, INITIAL_BORROWS));
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | catalog | borrows

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [bookForBorrow, setBookForBorrow] = useState(null);
  const [bookForPrint, setBookForPrint] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => saveJSON(BOOKS_KEY, books), [books]);
  useEffect(() => saveJSON(BORROWS_KEY, borrows), [borrows]);

  // Xabar 3,5 soniyadan keyin o'zi yo'qoladi
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Holat har safar sanaga qarab hisoblanadi: sahifa ochiq turgan paytda ham muddati o'tganlar to'g'ri ko'rinadi
  const today = todayStr();
  const borrowsView = useMemo(() => borrows.map((b) => withStatus(b, today)), [borrows, today]);
  const overdueList = borrowsView.filter((b) => b.status === "overdue");

  const goTo = useCallback((tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  }, []);

  // Yangi kitob. Fondda shu nom va muallifli kitob bo'lsa, yangi yozuv o'rniga nusxalari ko'paytiriladi.
  const handleAddBook = (book) => {
    const existing = books.find(
      (b) => normalize(b.title) === normalize(book.title) && normalize(b.author) === normalize(book.author)
    );
    if (existing) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === existing.id
            ? { ...b, totalCount: b.totalCount + book.totalCount, availableCount: b.availableCount + book.totalCount }
            : b
        )
      );
      setToast(`"${existing.title}" fondda bor edi — ${book.totalCount} ta nusxa qo'shildi (${existing.id}).`);
      return;
    }
    const id = nextBookId(books);
    setBooks((prev) => [{ ...book, id, availableCount: book.totalCount }, ...prev]);
    setToast(`"${book.title}" fondga qo'shildi (${id}).`);
  };

  const handleBorrowBook = (data) => {
    const book = books.find((b) => b.id === data.bookId);
    if (!book || book.availableCount <= 0) {
      setToast("Bu kitobning bo'sh nusxasi qolmagan.");
      return;
    }
    setBorrows((prev) => [{ ...data, id: nextBorrowId(prev) }, ...prev]);
    setBooks((prev) =>
      prev.map((b) => (b.id === data.bookId ? { ...b, availableCount: Math.max(0, b.availableCount - 1) } : b))
    );
    setToast(`"${book.title}" ${data.studentName}ga berildi.`);
  };

  // Tuzatildi: oldin qaytarilgan kitob ID'si setState ichida aniqlanardi va nusxa soni
  // ko'paymay qolishi mumkin edi. Endi ijara oldindan topiladi.
  const handleReturnBook = (borrowId) => {
    const borrow = borrows.find((b) => b.id === borrowId);
    if (!borrow || borrow.status === "returned") return;

    setBorrows((prev) =>
      prev.map((b) => (b.id === borrowId ? { ...b, status: "returned", returnDate: todayStr() } : b))
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === borrow.bookId ? { ...b, availableCount: Math.min(b.totalCount, b.availableCount + 1) } : b
      )
    );
    setToast(`"${borrow.bookTitle}" kutubxonaga qaytarildi.`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#asosiy"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Asosiy mazmunga o'tish
      </a>

      <Header
        activeTab={activeTab}
        onNavigate={goTo}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenAddBook={() => setIsAddBookOpen(true)}
      />

      <main id="asosiy" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Kirish banneri */}
            <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-white via-gold-soft/60 to-gold-soft p-6 sm:p-10">
              <div className="relative z-10 max-w-2xl">
                <span className="chip bg-white/80 text-gold-text ring-1 ring-gold/30">
                  Kutubxona avtomatlashtirilgan tizimi
                </span>
                <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                  Kitoblar va talabalar nazorati — bir joyda
                </h1>
                <p className="mt-3 font-serif text-base leading-relaxed text-mute sm:text-lg">
                  Skaner orqali kitobni bir soniyada bering va qabul qiling, kichik printerda QR stiker chiqaring,
                  fonddan mos kitobni tez toping.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => setIsScannerOpen(true)} className="btn btn-gold">
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    QR skaner bilan ishlash
                  </button>
                  <button type="button" onClick={() => setIsAiOpen(true)} className="btn btn-outline">
                    <Sparkles className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                    Kitob tavsiyasi olish
                  </button>
                </div>
              </div>
              <BookOpen
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -right-6 hidden h-72 w-72 text-gold/25 lg:block"
                strokeWidth={1}
              />
            </section>

            <StatsCards books={books} borrows={borrowsView} />

            {overdueList.length > 0 && (
              <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm text-red-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong>{overdueList.length} ta kitob</strong> muddatidan kechikmoqda:{" "}
                    {overdueList.slice(0, 3).map((b) => b.studentName).join(", ")}
                    {overdueList.length > 3 ? " va boshqalar" : ""}.
                  </span>
                </p>
                <button type="button" onClick={() => goTo("borrows")} className="btn btn-danger shrink-0">
                  Ko'rib chiqish
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Fonddan namunalar */}
              <section className="card p-5 sm:p-6 lg:col-span-2">
                <SectionTitle
                  action={
                    <button
                      type="button"
                      onClick={() => goTo("catalog")}
                      className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-gold-text hover:underline"
                    >
                      Barchasini ochish <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  }
                >
                  Kitoblar fondi
                </SectionTitle>

                <ul className="mt-4 divide-y divide-line">
                  {books.slice(0, 4).map((b) => (
                    <li key={b.id} className="flex gap-4 py-4 first:pt-2 last:pb-0">
                      <BookCover book={b} compact className="h-24 w-16 shrink-0 rounded-lg shadow-card" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-text">{b.category}</p>
                        <h3 dir="auto" className="mt-0.5 line-clamp-1 font-semibold text-ink">{b.title}</h3>
                        <p className="font-serif text-sm text-mute">
                          {b.author} · {b.year}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`chip ${b.availableCount > 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                            {b.availableCount > 0 ? `${b.availableCount} / ${b.totalCount} mavjud` : "Barchasi ijarada"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setBookForPrint(b)}
                            className="text-xs font-medium text-mute underline-offset-4 hover:text-gold-text hover:underline"
                          >
                            QR stiker
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* So'nggi ijaralar */}
              <section className="card flex flex-col p-5 sm:p-6">
                <SectionTitle>So'nggi ijaralar</SectionTitle>
                <ul className="mt-4 flex-1 space-y-3">
                  {borrowsView.slice(0, 5).map((br) => (
                    <li key={br.id} className="rounded-xl border border-line bg-paper/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate text-sm font-semibold text-ink">{br.studentName}</p>
                        <StatusChip status={br.status} />
                      </div>
                      <p dir="auto" className="mt-0.5 truncate font-serif text-sm text-mute">{br.bookTitle}</p>
                      {br.status !== "returned" && (
                        <p className="mt-1 text-[11px] text-mute">Muddat: {formatDate(br.dueDate)}</p>
                      )}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => goTo("borrows")} className="btn btn-soft mt-4 w-full">
                  Ijaralarni boshqarish
                </button>
              </section>
            </div>
          </div>
        )}

        {activeTab === "catalog" && (
          <div className="animate-fade-in">
            <PageTitle title="Kitoblar fondi" text="Kutubxonadagi barcha kitoblar, janrlar va nusxalar holati" />
            <BookCatalog
              books={books}
              onBorrowClick={setBookForBorrow}
              onPrintClick={setBookForPrint}
              onAddBookClick={() => setIsAddBookOpen(true)}
            />
          </div>
        )}

        {activeTab === "borrows" && (
          <div className="animate-fade-in">
            <PageTitle title="Talabalar ijarasi" text="Berilgan kitoblar, qaytarish muddatlari va qarzdorlik nazorati" />
            <BorrowHistory borrows={borrowsView} onReturnBook={handleReturnBook} />
          </div>
        )}
      </main>

      <Footer
        onNavigate={goTo}
        books={books}
        borrows={borrows}
        onRestore={(data) => {
          setBooks(data.books);
          setBorrows(data.borrows);
          setToast(`Zaxira tiklandi: ${data.books.length} ta kitob, ${data.borrows.length} ta ijara.`);
        }}
        onError={setToast}
      />

      {isScannerOpen && (
        <ScannerModal
          books={books}
          borrows={borrowsView}
          onClose={() => setIsScannerOpen(false)}
          onBorrowBook={(book) => {
            setIsScannerOpen(false);
            setBookForBorrow(book);
          }}
          onReturnBook={handleReturnBook}
        />
      )}

      {isAddBookOpen && (
        <AddBookModal
          categories={[...new Set(books.map((b) => b.category))]}
          onClose={() => setIsAddBookOpen(false)}
          onAddBook={handleAddBook}
        />
      )}

      {bookForBorrow && (
        <BorrowModal book={bookForBorrow} onClose={() => setBookForBorrow(null)} onSubmitBorrow={handleBorrowBook} />
      )}

      {bookForPrint && <PrintStickerModal book={bookForPrint} onClose={() => setBookForPrint(null)} />}

      {isAiOpen && (
        <AiAssistantModal
          books={books}
          borrows={borrowsView}
          onClose={() => setIsAiOpen(false)}
          onSelectBookForBorrow={(book) => {
            setIsAiOpen(false);
            setBookForBorrow(book);
          }}
        />
      )}

      {/* Bildirishnoma */}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
        {toast && (
          <div className="pointer-events-auto max-w-md rounded-full bg-ink px-5 py-3 text-sm text-white shadow-lift animate-fade-in">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function PageTitle({ title, text }) {
  return (
    <div className="mb-6">
      <SectionTitle as="h1">{title}</SectionTitle>
      <p className="mt-1 pl-[26px] font-serif text-mute">{text}</p>
    </div>
  );
}
