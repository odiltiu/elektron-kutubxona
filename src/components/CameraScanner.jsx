import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

// Telefon kamerasi bilan QR o'qish. Brauzerning o'z BarcodeDetector imkoniyatidan foydalanadi
// (Android Chrome, Edge). Qo'llab-quvvatlamaydigan brauzerlarda tugma umuman ko'rinmaydi.
export const cameraScanSupported =
  typeof window !== "undefined" && "BarcodeDetector" in window && !!navigator.mediaDevices?.getUserMedia;

export default function CameraScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const onDetectedRef = useRef(onDetected);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    let stream;
    let timer;
    let stopped = false;

    (async () => {
      try {
        const formats = await window.BarcodeDetector.getSupportedFormats();
        if (!formats.includes("qr_code")) throw new Error("Bu qurilma QR kodni kamera orqali o'qiy olmaydi.");
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (stopped) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0 && codes[0].rawValue) {
              onDetectedRef.current(codes[0].rawValue);
              return;
            }
          } catch {
            // kadr hali tayyor emas — keyingi urinish
          }
          timer = setTimeout(tick, 300);
        };
        tick();
      } catch (err) {
        if (stopped) return;
        setError(
          err?.name === "NotAllowedError"
            ? "Kameraga ruxsat berilmadi. Brauzer sozlamalarida kameraga ruxsat bering."
            : err?.message || "Kamerani ochib bo'lmadi."
        );
      }
    })();

    // Oyna yopilganda kamera albatta o'chiriladi
    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-ink">
      {error ? (
        <p className="bg-red-50 p-4 text-sm text-red-900">{error}</p>
      ) : (
        <div className="relative">
          <video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-40 w-40 rounded-2xl border-4 border-gold/90" />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 bg-white px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs text-mute">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          QR kodni ramka ichiga tuting
        </span>
        <button type="button" onClick={onClose} className="btn btn-outline min-h-[36px] px-3 text-xs">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Kamerani yopish
        </button>
      </div>
    </div>
  );
}
