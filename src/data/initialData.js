import { addDays } from "../lib/date";

// Namunaviy ma'lumotlar. Sanalar bugungi kunga nisbatan olinadi, shunda demo har doim "jonli" ko'rinadi.
export const INITIAL_BOOKS = [
  {
    id: "BK-1001",
    title: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    category: "Badiiy adabiyot",
    year: 1925,
    cover: "",
    totalCount: 5,
    availableCount: 4,
    description: "O'zbek adabiyotidagi birinchi tarixiy roman. Kumushbibi va Otabekning muhabbati tarixi."
  },
  {
    id: "BK-1002",
    title: "Clean Code (Toza kod)",
    author: "Robert C. Martin",
    category: "Dasturlash",
    year: 2008,
    cover: "",
    totalCount: 3,
    availableCount: 1,
    description: "Yaxshi va tushunarli dasturlash madaniyatini o'rgatuvchi jahon bestselleri."
  },
  {
    id: "BK-1003",
    title: "Yulduzli tunlar",
    author: "Pirimqul Qodirov",
    category: "Tarixiy",
    year: 1978,
    cover: "",
    totalCount: 4,
    availableCount: 4,
    description: "Zahiriddin Muhammad Boburning murakkab hayoti va ijodiga bag'ishlangan roman."
  },
  {
    id: "BK-1004",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Dasturlash",
    year: 2008,
    cover: "",
    totalCount: 2,
    availableCount: 0,
    description: "JavaScript tilining eng kuchli va toza qismlari haqida chuqur qo'llanma."
  },
  {
    id: "BK-1005",
    title: "Atom odatlar",
    author: "James Clear",
    category: "Shaxsiy rivojlanish",
    year: 2018,
    cover: "",
    totalCount: 6,
    availableCount: 5,
    description: "Kichik odatlar orqali ulkan natijalarga erishish bo'yicha amaliy qo'llanma."
  }
];

export const INITIAL_BORROWS = [
  {
    id: "BR-501",
    bookId: "BK-1002",
    bookTitle: "Clean Code (Toza kod)",
    studentName: "Odil Xusanov",
    studentGroup: "FullStack-2026",
    studentPhone: "+998 90 123 45 67",
    borrowDate: addDays(-30),
    dueDate: addDays(-16),
    returnDate: null,
    status: "active" // holat sanaga qarab hisoblanadi: active | overdue | returned
  },
  {
    id: "BR-502",
    bookId: "BK-1004",
    bookTitle: "JavaScript: The Good Parts",
    studentName: "Azizbek Rahimov",
    studentGroup: "Frontend-3",
    studentPhone: "+998 93 456 78 90",
    borrowDate: addDays(-6),
    dueDate: addDays(8),
    returnDate: null,
    status: "active"
  },
  {
    id: "BR-503",
    bookId: "BK-1004",
    bookTitle: "JavaScript: The Good Parts",
    studentName: "Madina Aliyeva",
    studentGroup: "WebDev-1",
    studentPhone: "+998 99 987 65 43",
    borrowDate: addDays(-40),
    dueDate: addDays(-26),
    returnDate: addDays(-27),
    status: "returned"
  },
  {
    id: "BR-504",
    bookId: "BK-1001",
    bookTitle: "O'tkan kunlar",
    studentName: "Javohir Toshmatov",
    studentGroup: "Backend-Node",
    studentPhone: "+998 97 111 22 33",
    borrowDate: addDays(-3),
    dueDate: addDays(11),
    returnDate: null,
    status: "active"
  }
];
