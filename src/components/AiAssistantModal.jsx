import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Bot } from "lucide-react";
import Modal from "./ui/Modal";
import BookCover from "./ui/BookCover";
import { recommendBooks, normalize } from "../lib/library";
import { formatDate } from "../lib/date";

const QUICK = [
  "Dasturlashni boshlovchilarga",
  "Shaxsiy rivojlanish haqida",
  "O'zbek adabiyotidan nimalar bor?",
  "Muddati o'tgan kitoblar",
];

// Yordamchi tayyor javoblar bilan emas, kutubxonadagi haqiqiy kitoblar fondi bo'yicha qidiradi.
// Internet yoki tashqi sun'iy intellekt xizmati talab qilinmaydi.
export default function AiAssistantModal({ books, borrows, onClose, onSelectBookForBorrow }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Assalomu alaykum! Qaysi mavzu yoki muallif bo'yicha kitob kerak? Fondimizdan mosini topib beraman.",
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  // Yangi xabar kelganda pastga aylantiramiz
  useEffect(() => {
    const el = listRef.current?.closest(".overflow-y-auto");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const answer = (query) => {
    const q = normalize(query);
    if (/(muddat|kechik|qarz)/.test(q)) {
      const list = borrows.filter((b) => b.status === "overdue");
      return list.length
        ? { text: `Hozir ${list.length} ta kitob muddatidan kechikmoqda:`, borrows: list }
        : { text: "Muddati o'tgan kitob yo'q — hamma muddatlar joyida." };
    }
    const found = recommendBooks(books, query).slice(0, 4);
    return found.length
      ? { text: `Fondda so'rovingizga mos ${found.length} ta kitob topdim:`, books: found }
      : {
          text: `"${query}" bo'yicha fondda mos kitob topilmadi. Janr nomi bilan so'rab ko'ring: dasturlash, tarix, adabiyot, shaxsiy rivojlanish.`,
        };
  };

  const send = (text) => {
    const query = (text ?? input).trim();
    if (!query) return;
    setMessages((prev) => [...prev, { role: "user", text: query }, { role: "assistant", ...answer(query) }]);
    setInput("");
  };

  return (
    <Modal
      title="Kitob tavsiyasi"
      subtitle="Kutubxona fondi bo'yicha aqlli qidiruv"
      icon={Sparkles}
      onClose={onClose}
      size="lg"
      footer={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <label htmlFor="ai-input" className="sr-only">
            Savolingiz
          </label>
          <input
            id="ai-input"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mavzu, muallif yoki kitob nomini yozing..."
            className="input"
          />
          <button type="submit" disabled={!input.trim()} className="btn btn-gold shrink-0" aria-label="Yuborish">
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      }
    >
      <div className="-mt-1 mb-4 flex gap-2 overflow-x-auto pb-1">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            className="min-h-[36px] shrink-0 rounded-full border border-line px-3 text-xs text-mute transition-colors hover:border-gold hover:text-gold-text"
          >
            {q}
          </button>
        ))}
      </div>

      <ul ref={listRef} className="space-y-4" aria-live="polite">
        {messages.map((m, i) => (
          <li key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
            <div className={m.role === "user" ? "max-w-[80%]" : "min-w-0 max-w-[90%] flex-1"}>
              <p
                className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "rounded-br-md bg-gold text-ink" : "rounded-bl-md bg-paper font-serif text-ink"
                }`}
              >
                {m.text}
              </p>

              {m.books && (
                <ul className="mt-2 space-y-2">
                  {m.books.map((b) => (
                    <li key={b.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5">
                      <BookCover book={b} compact className="h-16 w-11 shrink-0 rounded-md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                        <p className="truncate font-serif text-xs text-mute">
                          {b.author} · {b.availableCount > 0 ? `${b.availableCount} ta mavjud` : "hozircha band"}
                        </p>
                      </div>
                      {b.availableCount > 0 && (
                        <button
                          type="button"
                          onClick={() => onSelectBookForBorrow(b)}
                          className="btn btn-soft min-h-[36px] shrink-0 px-3 text-xs"
                        >
                          Berish
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {m.borrows && (
                <ul className="mt-2 space-y-1.5">
                  {m.borrows.map((b) => (
                    <li key={b.id} className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-900">
                      <strong>{b.studentName}</strong> ({b.studentGroup}) — {b.bookTitle}, muddat {formatDate(b.dueDate)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
