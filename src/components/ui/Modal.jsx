import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const SIZES = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

// Barcha oynalar uchun umumiy qobiq: Escape va fon bosilganda yopiladi,
// ekran o'quvchilar uchun role="dialog", orqa fon aylanmaydi, yopilgach fokus qaytadi.
export default function Modal({ title, subtitle, icon: Icon, onClose, children, footer, size = "md" }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Ichidagi biror maydon o'zi fokus olmagan bo'lsa, oynaning o'ziga fokus beramiz
    if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
      panelRef.current.focus();
    }

    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[92vh] w-full ${SIZES[size]} flex-col rounded-t-3xl border border-line bg-white shadow-lift focus:outline-none sm:rounded-3xl`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-text">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-base font-semibold text-ink">
                {title}
              </h2>
              {subtitle && <p className="truncate font-serif text-sm text-mute">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Oynani yopish"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-mute transition-colors hover:bg-paper hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer && <div className="border-t border-line px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
