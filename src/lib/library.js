// Kutubxona mantiqi: saqlash, ID yaratish, holatlar va tavsiyalar.

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    // Buzilgan ma'lumot ilovani to'xtatib qo'ymasligi uchun boshlang'ich holatga qaytamiz
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Xotira to'lgan yoki maxfiy rejim — ilova ishlashda davom etadi
  }
}

// Mavjud ID'lardan eng kattasini topib, keyingisini beradi (BK-1006, BR-505 ...).
// Tasodifiy son yoki ro'yxat uzunligiga tayanmaydi, shuning uchun takrorlanmaydi.
function nextId(prefix, items, start) {
  const max = items.reduce((m, item) => {
    const n = Number(String(item.id).replace(`${prefix}-`, ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, start - 1);
  return `${prefix}-${max + 1}`;
}

export const nextBookId = (books) => nextId("BK", books, 1001);
export const nextBorrowId = (borrows) => nextId("BR", borrows, 501);

// Ijara holatini sanaga qarab hisoblaydi: "returned" | "overdue" | "active"
export function withStatus(borrow, today) {
  if (borrow.status === "returned") return borrow;
  return { ...borrow, status: borrow.dueDate < today ? "overdue" : "active" };
}

// O'zbekcha apostroflarni bir xil ko'rinishga keltiramiz: o‘, oʻ, o’, o` -> o'
export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[‘’ʻʼ`´]/g, "'")
    .trim();
}

// So'rovdagi so'zlarni kategoriyalarga bog'lash uchun kalit so'zlar
const TOPICS = [
  { words: ["dastur", "kod", "code", "js", "javascript", "python", "frontend", "backend", "it"], category: "dasturlash" },
  { words: ["tarix", "tarixiy", "bobur", "temur"], category: "tarixiy" },
  { words: ["adabiyot", "roman", "badiiy", "she'r", "qissa", "mumtoz"], category: "badiiy adabiyot" },
  { words: ["odat", "rivoj", "psixolog", "motivats", "shaxsiy"], category: "shaxsiy rivojlanish" },
];

// Kitoblar fondidan so'rovga mos kitoblarni topadi va mosligi bo'yicha saralaydi
export function recommendBooks(books, query) {
  const q = normalize(query);
  const tokens = q.split(/[^a-z0-9'а-яё]+/i).filter((t) => t.length >= 3);
  const topicCats = TOPICS.filter((t) => t.words.some((w) => q.includes(w))).map((t) => t.category);

  return books
    .map((book) => {
      const title = normalize(book.title);
      const author = normalize(book.author);
      const category = normalize(book.category);
      const desc = normalize(book.description);
      let score = 0;
      if (topicCats.includes(category)) score += 5;
      for (const t of tokens) {
        if (title.includes(t)) score += 4;
        if (author.includes(t)) score += 3;
        if (category.includes(t)) score += 3;
        if (desc.includes(t)) score += 1;
      }
      return { book, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.book.availableCount - a.book.availableCount)
    .map((r) => r.book);
}
