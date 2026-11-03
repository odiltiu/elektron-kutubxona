// Fayl yuklab olish, Excel uchun CSV va zaxira (JSON) bilan ishlash

export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Excel (o'zbek/rus sozlamalari) ";" ajratgichni kutadi. Boshidagi BOM o'zbekcha harflar
// buzilmasligi uchun kerak.
export function toCSV(rows, columns) {
  const escape = (value) => {
    const s = value === null || value === undefined ? "" : String(value);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => escape(c.label)).join(";");
  const lines = rows.map((row) => columns.map((c) => escape(c.value(row))).join(";"));
  return "﻿" + [header, ...lines].join("\r\n");
}

export const BACKUP_VERSION = 1;

export function makeBackup(books, borrows) {
  return JSON.stringify({ app: "smart-kutubxona", version: BACKUP_VERSION, exportedAt: new Date().toISOString(), books, borrows }, null, 2);
}

// Zaxira faylini tekshiradi. Noto'g'ri fayl joriy ma'lumotlarni buzmasligi kerak.
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Fayl o'qilmadi: bu zaxira fayli emas.");
  }
  const validBook = (b) => b && typeof b.id === "string" && typeof b.title === "string" && Number.isFinite(Number(b.totalCount));
  const validBorrow = (b) => b && typeof b.id === "string" && typeof b.bookId === "string" && typeof b.dueDate === "string";
  if (!data || data.app !== "smart-kutubxona" || !Array.isArray(data.books) || !Array.isArray(data.borrows)) {
    throw new Error("Bu Smart Kutubxona zaxira fayli emas.");
  }
  if (!data.books.every(validBook) || !data.borrows.every(validBorrow)) {
    throw new Error("Zaxira faylidagi ma'lumotlar to'liq emas yoki buzilgan.");
  }
  return { books: data.books, borrows: data.borrows };
}
