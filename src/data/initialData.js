export const INITIAL_BOOKS = [
  {
    id: "BK-1001",
    title: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    category: "Badiiy adabiyot",
    year: 1925,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
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
    cover: "https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=400&q=80",
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
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
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
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
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
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80",
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
    borrowDate: "2026-09-20",
    dueDate: "2026-10-04",
    returnDate: null,
    status: "overdue" // "active", "returned", "overdue"
  },
  {
    id: "BR-502",
    bookId: "BK-1004",
    bookTitle: "JavaScript: The Good Parts",
    studentName: "Azizbek Rahimov",
    studentGroup: "Frontend-3",
    studentPhone: "+998 93 456 78 90",
    borrowDate: "2026-09-28",
    dueDate: "2026-10-12",
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
    borrowDate: "2026-09-15",
    dueDate: "2026-09-29",
    returnDate: "2026-09-28",
    status: "returned"
  },
  {
    id: "BR-504",
    bookId: "BK-1001",
    bookTitle: "O'tkan kunlar",
    studentName: "Javohir Toshmatov",
    studentGroup: "Backend-Node",
    studentPhone: "+998 97 111 22 33",
    borrowDate: "2026-10-01",
    dueDate: "2026-10-15",
    returnDate: null,
    status: "active"
  }
];
