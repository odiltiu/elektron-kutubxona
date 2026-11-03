import { useCallback, useRef, useState } from "react";
import { QrCode, CheckCircle2, AlertCircle, RefreshCw, BookOpen, Camera } from "lucide-react";
import CameraScanner, { cameraScanSupported } from "./CameraScanner";
import Modal from "./ui/Modal";
import BookCover from "./ui/BookCover";
import { formatDate } from "../lib/date";

export default function ScannerModal({ books, borrows, onClose, onBorrowBook, onReturnBook }) {
  const [code, setCode] = useState("");
  const [foundId, setFoundId] = useState(null);
  const [message, setMessage] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const inputRef = useRef(null);

  // Kitob va ijaralar har doim joriy ma'lumotdan olinadi: qaytarilgandan keyin sonlar darhol yangilanadi
  const book = books.find((b) => b.id === foundId) || null;
  const activeBorrows = book ? borrows.filter((b) => b.bookId === book.id && b.status !== "returned") : [];

  // Kod bo'yicha kitobni topish (skaner apparati, qo'lda kiritish va kamera uchun umumiy)
  const lookup = useCallback(
    (raw) => {
      const clean = String(raw).trim().toUpperCase();
      if (!clean) return;
      const found = books.find((b) => b.id.toUpperCase() === clean);
      if (found) {
        setFoundId(found.id);
        setMessage({ type: "success", text: `Topildi: ${found.title}` });
      } else {
        setFoundId(null);
        setMessage({ type: "error", text: `"${clean}" kodli kitob topilmadi.` });
      }
    },
    [books]
  );

  // Skaner apparati kodni yozib, oxirida Enter bosadi — forma o'zi yuboriladi
  const handleSubmit = (e) => {
    e.preventDefault();
    lookup(code);
    setCode(""); // keyingi skanerlash uchun maydon tozalanadi
  };

  const handleCameraDetected = useCallback(
    (value) => {
      setCameraOn(false);
      lookup(value);
    },
    [lookup]
  );

  const handleReturn = (borrow) => {
    onReturnBook(borrow.id);
    setMessage({ type: "success", text: `${borrow.studentName}dan qabul qilindi.` });
    inputRef.current?.focus();
  };

  return (
    <Modal title="QR skaner" subtitle="Kitob orqasidagi kodni skanerga tuting" icon={QrCode} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="scan-code" className="label">
          Skanerdan o'qilgan kod (yoki qo'lda kiriting)
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="scan-code"
            autoFocus
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Masalan: BK-1001"
            className="input font-mono font-semibold"
          />
          <button type="submit" className="btn btn-gold shrink-0">
            Qidirish
          </button>
        </div>
        <p className="mt-2 flex items-center gap-2 text-xs text-mute">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Skaner tayyor: kodni o'qitsangiz, avtomatik qidiradi.
        </p>
        {cameraScanSupported && !cameraOn && (
          <button type="button" onClick={() => setCameraOn(true)} className="btn btn-outline mt-3 w-full">
            <Camera className="h-4 w-4 text-gold-deep" aria-hidden="true" />
            Telefon kamerasi bilan skanerlash
          </button>
        )}
      </form>

      {cameraOn && <CameraScanner onDetected={handleCameraDetected} onClose={() => setCameraOn(false)} />}

      <div aria-live="polite">
        {message && (
          <p
            className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm ${
              message.type === "success" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {message.text}
          </p>
        )}
      </div>

      {book && (
        <div className="mt-4 rounded-2xl border border-line bg-paper/60 p-4">
          <div className="flex gap-4">
            <BookCover book={book} compact className="h-24 w-16 shrink-0 rounded-lg shadow-card" />
            <div className="min-w-0">
              <span className="font-mono text-[11px] font-semibold text-mute">{book.id}</span>
              <h3 dir="auto" className="font-semibold text-ink">{book.title}</h3>
              <p dir="auto" className="font-serif text-sm text-mute">
                {book.author} · {book.year}
              </p>
              <p className="mt-1 text-sm">
                Mavjud: <strong className={book.availableCount > 0 ? "text-emerald-800" : "text-red-700"}>{book.availableCount}</strong> / {book.totalCount} ta
              </p>
            </div>
          </div>

          {/* Tuzatildi: bir nechta nusxa bo'lsa, har bir o'quvchidan alohida qabul qilish va
              bo'sh nusxa bo'lsa yana berish mumkin */}
          {activeBorrows.length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-mute">Hozir o'qiyotganlar</p>
              <ul className="mt-2 space-y-2">
                {activeBorrows.map((br) => (
                  <li key={br.id} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-semibold text-ink">
                        {br.studentName} <span className="font-normal text-mute">({br.studentGroup})</span>
                      </p>
                      <p className={br.status === "overdue" ? "text-xs font-semibold text-red-700" : "text-xs text-mute"}>
                        Muddat: {formatDate(br.dueDate)}
                        {br.status === "overdue" ? " — kechikkan" : ""}
                      </p>
                    </div>
                    <button type="button" onClick={() => handleReturn(br)} className="btn btn-soft min-h-[40px] shrink-0 px-4 text-xs">
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      Qabul qilish
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 border-t border-line pt-4">
            {book.availableCount > 0 ? (
              <button type="button" onClick={() => onBorrowBook(book)} className="btn btn-gold w-full">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Talabaga berish
              </button>
            ) : (
              <p className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-800">
                Bu kitobning barcha nusxalari band.
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
