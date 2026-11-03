import { useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import Modal from "./ui/Modal";
import BookCover from "./ui/BookCover";
import { todayStr, addDays } from "../lib/date";

const PRESETS = [7, 14, 30];

export default function BorrowModal({ book, onClose, onSubmitBorrow }) {
  // Tuzatildi: hook'lar endi har doim bir xil tartibda chaqiriladi (oldin ulardan oldin "return" bor edi)
  const [studentName, setStudentName] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [studentPhone, setStudentPhone] = useState("+998 ");
  const [dueDate, setDueDate] = useState(addDays(14));

  const today = todayStr();
  const available = book.availableCount > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentGroup.trim() || !available) return;
    onSubmitBorrow({
      bookId: book.id,
      bookTitle: book.title,
      studentName: studentName.trim(),
      studentGroup: studentGroup.trim(),
      studentPhone: studentPhone.trim() === "+998" ? "" : studentPhone.trim(),
      borrowDate: today,
      dueDate,
      returnDate: null,
      status: "active",
    });
    onClose();
  };

  return (
    <Modal title="Talabaga kitob berish" subtitle="Ijarani rasmiylashtirish" icon={BookOpen} onClose={onClose} size="sm">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper/60 p-3">
        <BookCover book={book} compact className="h-16 w-12 shrink-0 rounded-md" />
        <div className="min-w-0">
          <span className="font-mono text-[11px] font-semibold text-mute">{book.id}</span>
          <p dir="auto" className="truncate font-semibold text-ink">{book.title}</p>
          <p className="truncate font-serif text-sm text-mute">
            {book.author} · {book.availableCount} ta bo'sh nusxa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="br-name" className="label">
            Talaba F.I.Sh. <span className="text-red-700">*</span>
          </label>
          <input
            id="br-name"
            required
            autoFocus
            autoComplete="name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Masalan: Azizbek Rahimov"
            className="input"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="br-group" className="label">
              Guruhi / kursi <span className="text-red-700">*</span>
            </label>
            <input
              id="br-group"
              required
              value={studentGroup}
              onChange={(e) => setStudentGroup(e.target.value)}
              placeholder="Masalan: 2-kurs"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="br-phone" className="label">
              Telefon raqami
            </label>
            <input
              id="br-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="br-due" className="label">
            Qaytarish muddati <span className="text-red-700">*</span>
          </label>
          <input
            id="br-due"
            type="date"
            required
            min={today}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
          />
          <div className="mt-2 flex gap-2" role="group" aria-label="Tezkor muddat">
            {PRESETS.map((d) => {
              const value = addDays(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDueDate(value)}
                  aria-pressed={dueDate === value}
                  className={`min-h-[36px] rounded-full px-3 text-xs font-medium transition-colors ${
                    dueDate === value ? "bg-gold text-ink" : "bg-paper text-mute hover:text-ink"
                  }`}
                >
                  {d} kun
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" disabled={!available} className="btn btn-gold w-full">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Ijarani tasdiqlash
        </button>
      </form>
    </Modal>
  );
}
