# Smart Kutubxona

Kutubxona uchun elektron boshqaruv tizimi: kitoblar fondi, talabalar ijarasi, QR stikerlar va skaner bilan ishlash.
Dizayn muhaddis.uz (Hadis ilmi maktabi) saytining uslubida: oltin rang palitrasi, Poppins va Alegreya shriftlari.

## Imkoniyatlar

- **Bosh sahifa:** statistika, muddati o'tgan kitoblar haqida ogohlantirish, so'nggi ijaralar
- **Kitoblar fondi:** "Ruknlar" (janrlar) paneli, qidiruv, mavjud/band filtri
- **Ijaralar:** holat bo'yicha filtr, qolgan yoki kechikkan kunlar, bir bosishda qaytarib olish
- **QR skaner:** skaner apparati (yoki qo'lda kiritish) orqali kitobni topish, berish va qabul qilish
- **QR stiker:** 58 mm termoprinter uchun stiker chop etish
- **Yangi kitob:** Google Books bazasidan topish yoki qo'lda kiritish (takror kitob qo'shilsa, nusxalari ko'payadi)
- **Kitob tavsiyasi:** fonddagi kitoblar bo'yicha mavzu, muallif va nom bo'yicha qidiruv
- **Excel'ga yuklash:** kitoblar va ijaralar ro'yxatini `.csv` faylga eksport
- **Zaxira:** barcha ma'lumotni bitta faylga yuklab olish va undan tiklash (footer'da)
- **Telefon kamerasi bilan QR:** Android Chrome va Edge'da skaner apparatisiz ishlaydi
- **Arabcha kitoblar:** nom va mualliflar o'ngdan chapga to'g'ri ko'rinadi

## Ishga tushirish

```bash
npm install
npm run dev
```

Production uchun: `npm run build`.

## Eslatma

Ma'lumotlar brauzerning `localStorage` xotirasida saqlanadi, shuning uchun vaqti-vaqti bilan zaxira oling. Bir nechta kompyuterda umumiy baza bilan ishlash uchun
server (masalan, Node.js + ma'lumotlar bazasi) qo'shish kerak bo'ladi.
