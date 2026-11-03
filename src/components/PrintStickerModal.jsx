import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import Modal from "./ui/Modal";

export default function PrintStickerModal({ book, onClose }) {
  return (
    <Modal
      title="QR stiker chop etish"
      subtitle="Kitob orqasiga yopishtirish uchun"
      icon={Printer}
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn btn-outline flex-1">
            Yopish
          </button>
          <button type="button" onClick={() => window.print()} className="btn btn-gold flex-1">
            <Printer className="h-4 w-4" aria-hidden="true" />
            Chop etish
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        {/* 58 mm termoprinter shabloni */}
        <div
          id="printable-sticker"
          className="flex w-64 flex-col items-center rounded-2xl border-2 border-dashed border-gold/60 bg-white p-4 text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-text">★ Smart Kutubxona ★</p>
          <div className="my-2 rounded-lg border border-line bg-white p-2">
            <QRCodeSVG value={book.id} size={120} level="H" />
          </div>
          <p className="rounded bg-paper px-3 py-0.5 font-mono text-sm font-bold tracking-wider text-ink">{book.id}</p>
          <p className="mt-2 line-clamp-1 text-xs font-semibold text-ink">{book.title}</p>
          <p className="line-clamp-1 text-[11px] text-mute">
            {book.author} ({book.year})
          </p>
          <p className="mt-2 w-full border-t border-line pt-1 text-[9px] text-mute">Skaner orqali tezkor berish va qaytarish</p>
        </div>
        <p className="mt-4 text-center font-serif text-sm text-mute">
          58 mm kichik printer yoki stiker qog'oziga mos o'lcham.
        </p>
      </div>
    </Modal>
  );
}
