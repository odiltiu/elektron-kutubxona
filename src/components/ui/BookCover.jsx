import { useState } from "react";

// Kitob muqovasi. Rasm bo'lmasa yoki yuklanmasa, oltin fonda kitob nomi ko'rinadi.
export default function BookCover({ book, className = "", compact = false }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = book.cover && failedSrc !== book.cover;

  if (showImage) {
    return (
      <img
        src={book.cover}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailedSrc(book.cover)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-gradient-to-br from-gold-soft via-gold/50 to-gold-deep/70 p-2 text-center font-serif font-bold leading-tight text-ink ${className}`}
    >
      <span dir="auto" className={compact ? "line-clamp-3 text-[9px]" : "line-clamp-4 text-sm"}>{book.title}</span>
    </div>
  );
}
