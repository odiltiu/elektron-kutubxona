// Sana bilan ishlash. toISOString() UTC qaytaradi va O'zbekistonda (UTC+5)
// yarim tundan keyin noto'g'ri kunni berishi mumkin, shuning uchun mahalliy sanadan foydalanamiz.

const pad = (n) => String(n).padStart(2, "0");

export function toDateStr(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayStr() {
  return toDateStr(new Date());
}

export function addDays(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

const WEEKDAYS = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

// "Seshanba, 3-noyabr, 2026-yil"
export function formatLongDate(date = new Date()) {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()}-${MONTHS[date.getMonth()]}, ${date.getFullYear()}-yil`;
}

// "2026-10-04" -> "4-oktabr, 2026"
export function formatDate(str) {
  if (!str) return "—";
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return str;
  return `${d}-${MONTHS[m - 1]}, ${y}`;
}

// Muddatgacha (yoki muddatdan beri) necha kun qolganini hisoblaydi
export function daysBetween(fromStr, toStr) {
  const a = new Date(`${fromStr}T00:00:00`);
  const b = new Date(`${toStr}T00:00:00`);
  return Math.round((b - a) / 86400000);
}
