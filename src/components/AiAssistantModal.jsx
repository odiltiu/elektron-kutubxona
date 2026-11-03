import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2, BookOpen } from 'lucide-react';

export default function AiAssistantModal({ books, onClose, onSelectBookForBorrow }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Assalomu alaykum! Men kutubxonaning Sun'iy Intellekt yordamchisiman. Sizga qaysi soha yoki mavzu bo'yicha kitob kerak? Masalan, dasturlash, tarix, psixologiya yoki o'zbek adabiyoti bo'yicha tavsiya bera olaman."
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // Tezkor savollar shablonlari
  const quickPrompts = [
    "Dasturlashni endi boshlaganlarga nima tavsiya qilasiz?",
    "Shaxsiy rivojlanish va odatlar haqida kitob bormi?",
    "O'zbek mumtoz adabiyotidan nimalar bor?",
    "Muddati o'tib ketgan kitoblar bo'yicha tavsiya"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    // Foydalanuvchi xabarini qo'shish
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);

    // AI tahlili simulyatsiyasi (Kutubxonadagi kitoblar bilan aqlli integratsiya)
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("dastur") || lower.includes("kod") || lower.includes("code") || lower.includes("js")) {
        reply = "Dasturlash sohasini endi boshlagan yoki kuchaytirmoqchi bo'lgan talabalar uchun kutubxonamizdagi **'Clean Code' (Robert C. Martin)** va **'JavaScript: The Good Parts' (Douglas Crockford)** asarlarini tavsiya qilaman. Bu kitoblar kodni toza, tushunarli va professional yozishni o'rgatadi.";
      } else if (lower.includes("odat") || lower.includes("rivoj") || lower.includes("psixolog")) {
        reply = "Kutubxonamiz fondidagi **'Atom odatlar' (James Clear)** kitobi ayni muddao! Ushbu kitob orqali har kuni 1% yaxshiroq bo'lish, chalg'imaslik va darslarni rejalashtirish bo'yicha aniq amaliy metodlarni o'rganasiz.";
      } else if (lower.includes("o'zbek") || lower.includes("tarix") || lower.includes("adabiyot")) {
        reply = "Milliy tariximiz va adabiyotimiz durdonalari sifatida **'O'tkan kunlar' (Abdulla Qodiriy)** hamda **'Yulduzli tunlar' (Pirimqul Qodirov)** romanlarini mutolaa qilishni tavsiya qilaman. Ular har bir yoshning ma'naviy dunyosini boyitadi.";
      } else {
        reply = `Sizning "${query}" so'rovingiz bo'yicha: Kutubxonamizda hozirda jami ${books.length} xil yo'nalishdagi adabiyotlar mavjud. Siz istalgan kitobni qidiruv bo'limidan nomi yoki janri bo'yicha topib, bir zumda ijaraga olishingiz mumkin.`;
      }

      setMessages([...newMessages, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 h-[80vh] flex flex-col">
        
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Kutubxonachi yordamchisi</h3>
              <p className="text-xs text-slate-500">Kitob tavsiyalari va aqlli tahlil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tezkor savollar shablonlari */}
        <div className="py-2 flex gap-1.5 overflow-x-auto border-b border-slate-100">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat xabarlari ro'yxati */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>AI o'ylamoqda va kitoblar fondini tahlil qilmoqda...</span>
            </div>
          )}
        </div>

        {/* Xabar yuborish inputi */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-slate-100 flex gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="AI dan kitob tavsiyasi yoki ma'lumot so'rang..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yuborish</span>
          </button>
        </form>

      </div>
    </div>
  );
}
