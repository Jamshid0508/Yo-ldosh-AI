# Yo'ldosh AI

O'zbekistonda haydovchilik guvohnomasi (prava) imtihoniga tayyorlanuvchilar uchun AI asosidagi ta'lim platformasi. To'liq texnik topshiriq — [tz.md](tz.md).

Bu repo **1-bosqich (MVP)** ni amalga oshiradi: gamifikatsiyalangan o'quv yo'li, rasmli test moduli, AI o'qituvchi (chat), vaziyat tahlili + avtomatik SVG sxema chizuvchi (SceneRenderer), belgi tekshiruvi (rasm orqali), belgilar katalogi + flashcard, mehmon rejimi (localStorage + ixtiyoriy MongoDB zaxira), dark mode, PWA.

**AI provayder — bepul Gemini API standart** (Anthropic Claude pullik muqobil sifatida ham qo'llab-quvvatlanadi). **Baza — MongoDB Atlas** (ixtiyoriy — bo'lmasa ilova to'liq localStorage rejimida ishlayveradi).

## Papka strukturasi

```
client/     React 18 + Vite + TypeScript + Tailwind frontend
server/
  providers/  AI provayder abstraksiyasi (gemini.ts standart, anthropic.ts muqobil)
  db/         MongoDB ulanish + progress zaxirasi + AI limit hisoblagichi (ixtiyoriy)
  prompts/    Har bir AI so'rov turi uchun system prompt
```

## Ishga tushirish

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

`.env` faylida to'ldirish kerak bo'lgan qiymatlar — pastdagi **"Nimalarni to'ldirish kerak"** bo'limiga qarang. Hech narsa to'ldirmasangiz ham server `http://localhost:8787` da ishga tushadi — AI so'rovlariga aniq xato xabari bilan javob beradi, ilova esa lokal test/belgi funksiyalari bilan to'liq foydali bo'lib qoladi.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

`http://localhost:5173` da ochiladi, `/api/*` so'rovlar avtomatik `localhost:8787` ga proksi qilinadi.

---

## Nimalarni to'ldirish kerak

### 1) Bepul AI kaliti — Google Gemini (majburiy, AI funksiyalari uchun)

Pullik kalitingiz yo'qligini hisobga olib, backend standart holatda **Google Gemini API**dan foydalanadi — matn (chat, test generatsiyasi, vaziyat tahlili) va rasm (belgi tekshiruvi) uchun ham to'liq bepul tarifi bor.

1. https://aistudio.google.com/apikey ga Google hisobingiz bilan kiring
2. **"Create API key"** bosing, kalitni nusxalang
3. `server/.env` faylida to'ldiring:
   ```
   AI_PROVIDER=gemini
   GEMINI_API_KEY=<sizning kalitingiz>
   GEMINI_MODEL=gemini-2.0-flash
   ```

**Bepul tarif haqida:** Gemini Flash modellari kunlik/daqiqalik so'rov limiti bilan bepul ishlaydi (aniq raqamlar Google tomonidan vaqti-vaqti bilan yangilanadi — joriy limitlarni https://ai.google.dev/pricing sahifasidan tekshiring). Bizning ilovadagi rate-limit (mehmon — kuniga 10, ro'yxatdan o'tgan — 30) bu bepul tarifga mos keladi.

**Kelajakda pullik Claude'ga o'tish:** kod allaqachon shunga tayyor — `server/providers/anthropic.ts` mavjud. Shunchaki:
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=<kalit>
```

**Boshqa bepul muqobillar** (agar Gemini limiti yetmasa, o'zingiz `server/providers/` ga xuddi shu `AiProvider` interfeysi bo'yicha qo'shishingiz mumkin):
- **Groq** (console.groq.com) — juda tez, bepul, lekin ko'p modellarda vision (rasm) yo'q — faqat chat/test uchun mos
- **Mistral La Plateforme** (console.mistral.ai) — bepul tarif bor, vision cheklangan

### 2) MongoDB Atlas (ixtiyoriy — progress zaxirasi uchun)

Siz Atlas'ni o'zingiz ulaysiz, shu qadamlarni bosing:

1. https://www.mongodb.com/cloud/atlas/register — bepul ro'yxatdan o'ting
2. **"Build a Database" → M0 (Free)** tarifni tanlang, klaster yarating (bir necha daqiqa kutadi)
3. **Database Access** → yangi foydalanuvchi yarating (login/parol saqlab qo'ying)
4. **Network Access** → **"Allow access from anywhere"** (0.0.0.0/0) qo'shing — dev uchun yetarli
5. **Connect → Drivers** → ulanish satrini (connection string) nusxalang, masalan:
   ```
   mongodb+srv://<user>:<parol>@cluster0.xxxxx.mongodb.net/
   ```
6. `server/.env` faylida to'ldiring:
   ```
   MONGODB_URI=mongodb+srv://<user>:<parol>@cluster0.xxxxx.mongodb.net/
   MONGODB_DB_NAME=yoldosh_ai
   ```

Ulangach server konsolida `MongoDB: sozlangan` deb chiqadi. Hozircha Mongo ikki narsa uchun ishlatiladi:
- **AI so'rov limiti** (`ai_usage` kolleksiyasi) — server qayta ishga tushsa ham hisoblagich yo'qolmaydi
- **Progress zaxirasi** (`progress_snapshots` kolleksiyasi) — frontend qurilma identifikatori (`clientId`, localStorage'da) bo'yicha XP/streak/xatolarni serverga zaxiralaydi va yangi qurilmada (agar lokal progress bo'sh bo'lsa) avtomatik tiklaydi

**Muhim izoh — bu hali to'liq auth emas:** hozir Mongo faqat "qurilma darajasidagi zaxira" sifatida ishlaydi (email/parol yoki OTP orqali kirish yo'q, TZ'ning 2-bosqich talabi). Agar haqiqiy ro'yxatdan o'tish/kirish tizimi kerak bo'lsa (masalan turli qurilmalarda bir xil hisobni ko'rish), buni alohida so'rang — men buni Mongo ustiga (masalan JWT + telefon OTP yoki Google OAuth bilan) qo'shib beraman.

### 3) Ixtiyoriy — production uchun

- `CLIENT_ORIGIN` — deploy qilingan frontend manzili (CORS uchun)
- `PORT` — hosting platformasi avtomatik belgilaydi, odatda o'zgartirish shart emas

---

## Amalga oshirilgan (MVP)

- **O'quv yo'li** — 9 mavzu + imtihon, Duolingo uslubidagi burama yo'l (`LearningPath.tsx`), XP/streak/daraja tizimi
- **Test moduli** — Tez test (5 savol), Mavzu darsi (10 savol), Imtihon simulyatori (20 savol/25 daqiqa/2 xato), Cheksiz rejim (AI real vaqtda savol tuzadi), Xatolar ustida ishlash
- **Belgilar katalogi** — 38 ta O'zbekiston yo'l belgisi, barchasi qo'lda chizilgan SVG (7 kategoriya bo'yicha), qidiruv, flashcard rejimi
- **SceneRenderer** — AI qaytargan JSON asosida chorraha sxemasini SVG'da chizadi (`togri_yol`, `chorraha_4`, `chorraha_T` to'liq, qolgan 3 turi ham asosiy darajada qo'llab-quvvatlanadi), PNG eksport
- **AI O'qituvchi (chat)** — tayyor savol-chiplar, markdown render, kontekst uzatish (belgi/mavzu sahifasidan)
- **Belgi tekshiruvi** — kamera/galereya rasm yuklash, 1280px resize, AI vision orqali tahlil
- **AI provayder abstraksiyasi** — `AI_PROVIDER` env orqali Gemini ↔ Anthropic almashtiriladi, promptlar va JSON validatsiya umumiy
- **Backend** — yagona `/api/ai` proksi, kuniga 10/30 so'rov limiti (Mongo bo'lsa durable, bo'lmasa xotirada), JSON sxema validatsiyasi (zod), noto'g'ri JSON uchun 1 marta qayta so'rash, API kalit faqat serverda
- **MongoDB progress zaxirasi** — ixtiyoriy, qurilma (`clientId`) darajasida backup/restore
- **PWA** — offline ishlaydigan belgilar katalogi va lokal testlar, o'rnatish taklifi
- **Dark mode**, `prefers-reduced-motion` hurmat qilinadi

## Ataylab soddalashtirilgan joylar (keyingi bosqichlar uchun)

TZ'da "kamida 100 belgi" va "kamida 200 savol" ko'rsatilgan — bitta ishlab chiqish sessiyasida sifatli qo'lda tayyorlash mumkin bo'lgan real hajm sifatida **38 ta belgi** va **70 ta savol** (9 mavzuga taqsimlangan, ba'zilari chorraha sxemalari bilan) tayyorlandi. Yangi belgi qo'shish uchun `client/scripts/generate-signs.mjs` dagi `SIGNS` ro'yxatiga element qo'shib, skriptni qayta ishga tushiring — u SVG va `signs.json`ni avtomatik yangilaydi. Yangi savollarni `client/src/data/questions.json`ga xuddi shu formatda qo'shish kifoya. "Cheksiz rejim" AI orqali savol sonini cheksiz to'ldirib turadi.

Boshqa qasddan qoldirilgan narsalar:
- Haqiqiy foydalanuvchi autentifikatsiyasi (email/OTP/Google) hali yo'q — hozircha faqat qurilma darajasidagi Mongo zaxirasi bor (yuqoriga qarang).
- `x-user-id` orqali "ro'yxatdan o'tgan" limit server tomonida hozircha token tekshiruvisiz ishonch bilan qabul qilinadi (`server/limits.ts`) — haqiqiy auth qo'shilganda bu joy albatta yangilanishi kerak.
- Ovozli kiritish, rus/kirill til, reyting va Telegram bot — TZ'ning 3-bosqichi, hali qo'shilmagan.
- PWA ikonkalari hozircha SVG (`public/favicon.svg`); do'kon/production uchun haqiqiy PNG ikonkalar (192/512) qo'shish tavsiya etiladi.

## Deploy

- **Frontend** → Vercel (`client/` papkasini root sifatida ko'rsating, build command `npm run build`, output `dist`)
- **Backend** → Railway/Render (`server/` papkasi, start command `npm run build && npm start`, yuqoridagi barcha `.env` o'zgaruvchilarini deploy platformasida sozlang)

## Xavfsizlik eslatmasi

AI API kaliti (Gemini yoki Anthropic) hech qachon frontend kodida yoki build fayllarida uchramaydi — barcha AI so'rovlari backend orqali (`POST /api/ai`) o'tadi. Buni tasdiqlash uchun: `cd client && npm run build && grep -rE "AIzaSy|sk-ant" dist/` — natija bo'sh bo'lishi kerak.
