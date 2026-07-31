# TEXNIK TOPSHIRIQ (TZ)
## «Yo'ldosh AI» — pravaga AI bilan tayyorlov platformasi
**Versiya:** 1.0 · **Sana:** 2026-yil iyul · **Format:** Mobile-first web-ilova (PWA)

---

## 1. UMUMIY MA'LUMOT

**Loyiha nomi:** Yo'ldosh AI

**Maqsad:** O'zbekistonda haydovchilik guvohnomasi (prava) imtihoniga tayyorlanuvchilar uchun sun'iy intellektga asoslangan, istalgan joyda va istalgan darajada o'rganish imkonini beruvchi platforma yaratish.

**Auditoriya:** 18–45 yosh, asosan telefon orqali foydalanadi, texnik bilimi past bo'lishi mumkin. Shuning uchun interfeys Telegram darajasida sodda, Duolingo darajasida qiziqarli bo'lishi shart.

**Til:** O'zbek (lotin). Arxitektura keyinchalik rus va kirill tillarini qo'shishga tayyor bo'lsin (i18n).

**Asosiy g'oya:** foydalanuvchi shunchaki test yechmaydi — u AI bilan birga o'rganadi: savol beradi, vaziyatni tasvirlaydi va sxemasini ko'radi, belgini suratga olib tekshiradi.

---

## 2. TEXNOLOGIYALAR TO'PLAMI (STACK)

| Qatlam | Texnologiya | Izoh |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Tez, zamonaviy |
| Stil | Tailwind CSS | Dizayn-tizim tokenlari bilan |
| Animatsiya | Framer Motion | Yengil, o'lchovli ishlatish |
| Router | React Router v6 | |
| Backend | Node.js + Express | Yagona vazifa: Claude API proxy + rate limit |
| Baza + Auth | Supabase (PostgreSQL) | Bepul tarif MVP uchun yetarli |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) | Matn + rasm (vision) |
| Deploy | Vercel (frontend) + Railway/Render (backend) | |
| PWA | vite-plugin-pwa | Telefonga «o'rnatiladigan» ilova |

**Muhim xavfsizlik talabi:** Anthropic API kaliti FAQAT backendda, `.env` faylida saqlanadi. Frontend hech qachon API kalitni ko'rmaydi — barcha AI so'rovlar `POST /api/ai` orqali o'tadi.

---

## 3. UI/UX KONSEPSIYASI — ASOSIY OYNA

### 3.1. Ilhom manbalari (reference)
Foydalanuvchilar eng ko'p ishlatadigan va o'rganib qolgan platformalar asos qilinadi:

- **Duolingo** — gamifikatsiya: streak (kunlik olov), XP, darajalar, «o'quv yo'li», 3D bosiladigan tugmalar, xursandchilik animatsiyalari;
- **Telegram** — soddalik: minimal ekranlar, katta tugmalar, ortiqcha sozlamalar yo'q;
- **Instagram/TikTok** — pastki navigatsiya paneli (bottom nav), bir qo'l bilan boshqarish, vertikal kontent.

### 3.2. Navigatsiya
Pastki panel (bottom nav) — 5 bo'lim, doim ko'rinib turadi:

1. 🏠 **Bosh sahifa** (o'quv yo'li)
2. 📝 **Testlar**
3. 💬 **AI Chat** (markazda, ajralib turuvchi katta tugma)
4. 🛑 **Belgilar**
5. 👤 **Profil**

### 3.3. Bosh sahifa tarkibi (yuqoridan pastga)
1. **Salomlashuv + streak:** «Salom, Aziz! 🔥 5 kunlik seriya» — streak yonishi/o'chishi Duolingo mantiqida;
2. **Kunlik vazifa kartasi:** «Bugungi mashq: Chorrahalar — 10 savol» + progress halqasi + «Boshlash» tugmasi;
3. **O'quv yo'li (SIGNATURE ELEMENT):** Duolingo'dagi «path» uslubida, lekin YO'L ko'rinishida — asfalt yo'l ustida sariq punktir chiziq bo'ylab joylashgan darslar. Har bir dars nuqtasi yo'l belgisi shaklida (bosqich ochiq — ko'k belgi, yopiq — kulrang, tugatilgan — yashil galochka). Yo'l pastdan yuqoriga «buriladi» va foydalanuvchi go'yo haydab borayotgandek his qiladi. Mavzular ketma-ketligi: Umumiy qoidalar → Belgilar → Svetofor → Chorrahalar → Quvib o'tish → Tezlik → To'xtash → Piyodalar → Maxsus holatlar → IMTIHON;
4. **Tez kirish kartalari:** «Vaziyat tahlili», «Belgi tekshiruvi» — 2 ta gorizontal karta;
5. **Mini statistika:** umumiy progress %, yechilgan savollar, aniqlik %.

### 3.4. Dizayn-tizim (design tokens)
```css
--sign-blue:   #15529E;  /* asosiy — yo'l belgisi ko'ki */
--blue-deep:   #0E3D77;  /* soyalar, hover */
--marking:     #FFC61E;  /* aksent — yo'l chizig'i sarig'i, CTA */
--asphalt:     #1B1E24;  /* matn, dark mode fon */
--concrete:    #EFF1F4;  /* light mode fon */
--danger:      #C8362B;  /* xato, taqiqlovchi belgi qizili */
--success:     #1F8A4E;  /* to'g'ri javob */
```
- **Shriftlar:** Overpass (sarlavhalar — yo'l belgilaridagi shriftga yaqin), Inter (matn), Overpass Mono (raqamlar, taymer, modda raqamlari);
- **Tugmalar:** Duolingo uslubida «3D» — pastki soya 4px, bosilganda 1px ga tushadi (`box-shadow: 0 4px 0 var(--blue-deep)`);
- **Radius:** 14–16px kartalar, 10–12px tugmalar;
- **Dark mode:** majburiy, tizim sozlamasiga qarab avtomatik + qo'lda almashtirish;
- **Animatsiyalar:** to'g'ri javobda konfetti/checkmark spring animatsiyasi, streak yonganda olov pulsi, sahifa o'tishlari 200–250ms; `prefers-reduced-motion` hurmat qilinadi;
- **Tovushlar (ixtiyoriy, sozlamada o'chirish mumkin):** to'g'ri/noto'g'ri javob uchun qisqa signallar.

### 3.5. Onboarding (birinchi kirish)
1. 3 ta slayd: nima qila olishi (test / vaziyat sxemasi / belgi tekshiruvi) — har biri 1 rasm + 1 gap;
2. Daraja aniqlash testi (5 savol) yoki «O'tkazib yuborish»;
3. Natijaga qarab shaxsiy boshlanish nuqtasi tavsiya qilinadi;
4. Ro'yxatdan o'tish MAJBURIY EMAS: mehmon rejimida hamma narsa ishlaydi, progress localStorage'da; ro'yxatdan o'tsa (Google / telefon OTP) — bazaga ko'chadi.

---

## 4. FUNKSIONAL MODULLAR

### 4.1. Yo'l belgilari katalogi (RASMLAR BILAN)

**Talab:** barcha O'zbekiston yo'l belgilari rasmi bilan ko'rsatiladi.

- Belgilar **SVG formatida** `src/assets/signs/` papkasida saqlanadi (raster emas — har qanday ekranda tiniq, hajmi kichik, dark mode'da ham toza ko'rinadi);
- **Rasm manbasi:** Vena konvensiyasiga mos ochiq (public domain) SVG to'plamlari — Wikimedia Commons'dagi GOST belgi to'plami O'zbekiston belgilari bilan deyarli bir xil. Yetishmagan belgilar geometrik shakl bo'lgani uchun Claude Code yordamida SVG qilib chiziladi;
- Metadata fayli `src/data/signs.json`:

```json
{
  "id": "3.27",
  "nom": "To'xtash taqiqlangan",
  "kategoriya": "taqiqlovchi",
  "svg": "3_27.svg",
  "tavsif": "Transport vositalarining to'xtashi taqiqlanadi...",
  "amal_zonasi": "Belgi o'rnatilgan joydan yaqin chorrahagacha",
  "jarima_izoh": "MJtK bo'yicha ma'muriy javobgarlik"
}
```

- **7 kategoriya:** ogohlantiruvchi (1.x), imtiyoz (2.x), taqiqlovchi (3.x), buyuruvchi (4.x), axborot-ishora (5.x), servis (6.x), qo'shimcha lavhalar (7.x);
- **Ekranlar:** kategoriya tablari → belgi grid (rasm + raqam + nom) → belgi sahifasi (katta rasm, to'liq ma'no, amal zonasi, tez-tez uchraydigan xatolar, «🤖 AI'dan shu belgi haqida so'rash» tugmasi — chatga belgi kontekst bilan o'tadi);
- **Qidiruv:** nom yoki raqam bo'yicha jonli qidiruv;
- **Flashcard rejimi:** belgi rasmi ko'rsatiladi → foydalanuvchi 4 variantdan nomini topadi; noto'g'ri topilganlar takror chiqadi (spaced repetition sodda varianti);
- Katalog **offline ishlaydi** (PWA cache) — internet yo'q joyda ham belgilarni o'rganish mumkin.

### 4.2. AI Test moduli (RASMLI SAVOLLAR BILAN)

**Rejimlar:**
1. **Tez test** — 5 savol, mavzu tanlab;
2. **Mavzu testi** — 10 savol, o'quv yo'lidagi dars sifatida;
3. **Imtihon simulyatori** — 20 savol, 25 daqiqa taymer, ko'pi bilan 2 xato (real imtihon shartlari), natija sertifikat-karta ko'rinishida (ulashish mumkin).

**Savollar manbasi (gibrid):**
- `src/data/questions.json` — lokal baza (kamida 200 ta sifatli savol, belgi rasmlari va sxemalarga bog'langan) — tez, bepul, offline ishlaydi;
- AI generatsiya — «Cheksiz rejim»da Claude yangi savollar tuzadi (takrorlanmaydi).

**Savol JSON strukturasi:**
```json
{
  "id": "q_042",
  "savol": "Ushbu belgi nimani anglatadi?",
  "belgi_id": "3.27",
  "sxema": null,
  "variantlar": ["To'xtash taqiqlangan", "To'xtab turish taqiqlangan", "..."],
  "togri": 0,
  "izoh": "3.27 belgisi to'xtashni ham, to'xtab turishni ham taqiqlaydi...",
  "mavzu": "belgilar",
  "qiyinlik": 2
}
```
- Agar `belgi_id` bo'lsa — savol ustida belgi SVG rasmi ko'rsatiladi;
- Agar `sxema` bo'lsa — SceneRenderer (4.4-bandga qarang) chorraha sxemasini chizadi;
- Har javobdan keyin: to'g'ri/noto'g'ri animatsiya + izoh + «AI'dan batafsil so'rash» tugmasi;
- Noto'g'ri javoblar `mistakes` jadvaliga yoziladi → «Xatolar ustida ishlash» rejimi.

### 4.3. AI O'qituvchi (chat)

- Suhbat tarixi saqlanadi (sessiya ichida to'liq, bazada oxirgi 20 ta xabar);
- Tayyor savol-chiplar: «Aylanma harakat qoidasi?», «Qoldiq spirt normasi?», «Imtihonda nechta xato mumkin?»;
- Belgi katalogi yoki testdan «AI'dan so'rash» bosilganda — kontekst avtomatik uzatiladi;
- Javoblar markdown formatida render qilinadi (sarlavha, ro'yxat, qalin matn).

### 4.4. Vaziyat tahlili + SXEMA GENERATSIYASI (asosiy innovatsiya)

**Talab:** foydalanuvchi vaziyatni so'z bilan tasvirlaganda, AI qonuniy tahlil BILAN BIRGA vaziyat rasmini (sxemasini) ham chizib beradi.

**Texnik yechim — nima uchun rasm generatori EMAS:** AI rasm generatorlari (diffusion modellar) yo'l sxemasini aniq chiza olmaydi (mashinalar joylashuvi, strelkalar noto'g'ri chiqadi), sekin va qimmat. Buning o'rniga **AI strukturali JSON qaytaradi, frontend esa undan imtihon biletlaridagi kabi yuqoridan ko'rinishdagi (top-down) SVG sxema chizadi.** Bu aniq, bir soniyada chiziladi va bepul.

**Ish oqimi:**
1. Foydalanuvchi vaziyatni yozadi (yoki mikrofon orqali aytadi — Web Speech API, v2);
2. Backend Claude'ga yuboradi, javob FAQAT JSON;
3. Frontend `<SceneRenderer scene={...} />` komponenti SVG sxema chizadi;
4. Sxema ostida tuzilmali tahlil ko'rsatiladi;
5. «Sxemani yuklab olish» (PNG eksport) va «Ulashish» tugmalari.

**Scene JSON sxemasi (AI shu formatda javob beradi):**
```json
{
  "sxema": {
    "yol_turi": "chorraha_4",
    "izoh": "Teng ahamiyatli chorraha",
    "svetofor": null,
    "belgilar": [
      { "belgi_id": "2.1", "tomon": "janub" },
      { "belgi_id": "2.4", "tomon": "sharq" }
    ],
    "mashinalar": [
      { "harf": "A", "rang": "#15529E", "tomon": "janub", "manevr": "togri", "meniki": true },
      { "harf": "B", "rang": "#C8362B", "tomon": "sharq", "manevr": "chapga", "meniki": false }
    ],
    "piyodalar": [],
    "yol_boyi_chizigi": "uzuq"
  },
  "tahlil": {
    "xulosa": "1-2 gap",
    "qoidalar": ["YHQ talabi 1...", "YHQ talabi 2..."],
    "kim_haq": "A mashinasi haydovchisi...",
    "javobgarlik": "MJtK bo'yicha...",
    "maslahat": "Bunday vaziyatda..."
  }
}
```

**SceneRenderer komponenti talablari:**
- `yol_turi` variantlari: `togri_yol`, `chorraha_4`, `chorraha_T`, `aylanma`, `hovli_chiqish`, `piyoda_otish`;
- Mashinalar — ustdan ko'rinishdagi soddalashtirilgan avtomobil SVG (harf bilan: A, B, C), harakat yo'nalishi yo'g'on strelka bilan;
- `manevr`: `togri`, `chapga`, `onga`, `burilish_orqaga`, `toxtagan`;
- Belgilar sxemada kichik SVG ko'rinishida tegishli tomonда turadi (signs katalogidagi ayni fayllar ishlatiladi);
- Svetofor bo'lsa — qaysi rang yonib turgani ko'rsatiladi;
- «Meniki» mashina alohida ajratiladi (masalan, ko'k rang + pulsatsiya);
- Sxema oq fonda, imtihon bileti uslubida chiziladi — foydalanuvchi imtihondagi rasmlarga o'rganib boradi.

**Fallback:** agar AI JSON noto'g'ri qaytarsa — sxemasiz, faqat matn tahlili ko'rsatiladi (xatolik emas).

### 4.5. Belgi tekshiruvi (real belgi — qonuniymi?)

- Foydalanuvchi belgi rasmini yuklaydi (kamera / galereya) yoki tasvirlab beradi;
- Rasm frontendda 1280px gacha kichraytiriladi (canvas resize) → base64 → backend → Claude vision;
- AI javobi tuzilmali: bu qanday belgi → haydovchiga talab → o'rnatilish tahlili (ko'rinish, balandlik, holat, boshqa belgilar bilan zidlik) → noto'g'ri bo'lsa qayerga murojaat qilish (yo'l egasi tashkilot, YHX) va bu jarima nizosida qanday asos bo'lishi;
- Natijani saqlash/ulashish mumkin.

### 4.6. Profil va progress

- Statistika: umumiy progress, mavzular kesimida aniqlik %, streak tarixi (kalendar), jami XP va daraja (Yangi haydovchi → Shogird → Haydovchi → Usta → Yo'l ustasi);
- **«Mening xatolarim»** — barcha noto'g'ri javoblar ro'yxati, «Xatolarni qayta yechish» tugmasi;
- Sozlamalar: dark mode, tovushlar, til (kelajak), hisobni o'chirish.

---

## 5. MA'LUMOTLAR BAZASI (Supabase)

```sql
users      (id, ism, telefon/email, daraja, xp, streak, oxirgi_faollik, created_at)
progress   (user_id, mavzu, yechilgan, togri, oxirgi_sana)
mistakes   (id, user_id, savol_json, sana, qayta_yechildi bool)
sessions   (id, user_id, tur: test|imtihon|vaziyat|belgi, natija_json, sana)
ai_usage   (user_id, sana, sorovlar_soni)  -- kunlik limit uchun
```

Mehmon rejimida hamma narsa `localStorage`da; ro'yxatdan o'tganda bir marta sinxronlanadi.

---

## 6. AI INTEGRATSIYA (backend)

**Yagona endpoint:** `POST /api/ai`
```json
{ "type": "test" | "chat" | "vaziyat" | "belgi", "payload": { ... } }
```

**Talablar:**
- API kalit `.env`da (`ANTHROPIC_API_KEY`), frontendga hech qachon chiqmaydi;
- Rate limit: mehmon — kuniga 10 AI so'rov, ro'yxatdan o'tgan — 30 (keyinchalik premium tarif);
- Har `type` uchun alohida system prompt `server/prompts/` papkasida saqlanadi;
- Vaziyat rejimida javob JSON'ligini backend tekshiradi (parse + schema validatsiya), buzuq bo'lsa 1 marta qayta so'raydi;
- Barcha promptlarda umumiy asos: «Sen Yo'ldosh AI — O'zbekiston YHQ va MJtK bo'yicha avtomaktab o'qituvchisisan. Faqat o'zbek (lotin) tilida javob ber. Modda/qoida raqamini faqat aniq ishonching bo'lsa keltir, aks holda mazmunini ayt va rasmiy manbani tekshirishni tavsiya qil.»;
- **Kelajak (v2):** YHQ to'liq matnini bazaga yuklab, RAG orqali AI'ga manba sifatida berish — huquqiy aniqlikni oshiradi.

---

## 7. EKRANLAR XARITASI

```
/                 Onboarding (birinchi marta) → Bosh sahifa
/home             Bosh sahifa: streak, kunlik vazifa, o'quv yo'li
/lesson/:id       Dars (mavzu testi, 10 savol)
/tests            Testlar: tez test / imtihon simulyatori / xatolar
/exam             Imtihon rejimi (taymer, 20 savol)
/chat             AI O'qituvchi
/signs            Belgilar katalogi (kategoriyalar, qidiruv)
/signs/:id        Belgi sahifasi
/signs/cards      Flashcard rejimi
/situation        Vaziyat tahlili (kirish + sxema + tahlil)
/sign-check       Belgi tekshiruvi (rasm yuklash)
/profile          Profil, statistika, sozlamalar
```

---

## 8. NOFUNKSIONAL TALABLAR

- **Mobile-first:** 360px dan boshlab mukammal; desktopda kontent markazda, maks 520px («telefon» kolonna) — Telegram Web uslubida;
- **Tezlik:** birinchi ochilish < 3s (3G), sahifa o'tishlari < 200ms; belgilar SVG sprite/lazy-load;
- **PWA:** telefonga o'rnatish taklifi, belgilar katalogi va lokal savollar offline ishlaydi;
- **Accessibility:** klaviatura fokusi ko'rinadi, kontrast WCAG AA, `prefers-reduced-motion`;
- **Xatolarga chidamlilik:** AI ishlamasa — lokal savollar bazasi bilan ilova to'liq foydali bo'lib qolaveradi.

---

## 9. BOSQICHLAR (ROADMAP)

**1-bosqich — MVP (2–3 hafta):**
onboarding (soddalashtirilgan) · bosh sahifa + o'quv yo'li · belgilar katalogi (SVG, kamida 100 belgi) · test moduli (lokal 200 savol + rasmli savollar) · AI chat · vaziyat tahlili + SceneRenderer (chorraha_4, togri_yol, chorraha_T) · belgi tekshiruvi · mehmon rejimi (localStorage) · dark mode.

**2-bosqich (1–2 hafta):**
Supabase auth + sinxronizatsiya · imtihon simulyatori (taymer) · xatolar ustida ishlash · streak/XP to'liq · flashcardlar · barcha yol_turi sxemalari · PNG eksport.

**3-bosqich:**
ovozli kiritish · rus/kirill tillari · RAG (YHQ matni bilan) · premium tarif · reyting (do'stlar bilan musobaqa) · Telegram bot versiyasi.

---

## 10. QABUL QILISH MEZONLARI (MVP uchun checklist)

- [ ] Telefonda barcha ekranlar bir qo'l bilan qulay ishlaydi, bottom nav doim ko'rinadi
- [ ] Har bir belgi savoli RASM bilan chiqadi, rasm tiniq (SVG)
- [ ] Vaziyat matn bilan kiritilganda 5 soniya ichida SXEMA + tahlil chiqadi
- [ ] Sxemada mashinalar, strelkalar, belgilar to'g'ri tomonlarda turadi
- [ ] AI javob bermasa ilova qulamaydi — tushunarli xabar + qayta urinish
- [ ] API kalit build fayllarida uchramaydi (`grep` bilan tekshirilgan)
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90 (mobil)
- [ ] Internet o'chirilganda belgilar katalogi va lokal testlar ishlaydi

---

## 11. PAPKA STRUKTURASI

```
yoldosh-ai/
├── client/
│   ├── src/
│   │   ├── assets/signs/          # belgi SVG'lari (1_1.svg, 3_27.svg ...)
│   │   ├── components/
│   │   │   ├── SceneRenderer/     # vaziyat sxemasi chizuvchi (asosiy komponent)
│   │   │   ├── SignImage.tsx      # belgi rasmini id bo'yicha ko'rsatish
│   │   │   ├── QuizCard.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── LearningPath.tsx   # yo'l ko'rinishidagi o'quv yo'li
│   │   ├── pages/                 # 7-bo'limdagi ekranlar
│   │   ├── data/
│   │   │   ├── signs.json
│   │   │   └── questions.json
│   │   ├── lib/api.ts             # backend bilan aloqa
│   │   └── styles/tokens.css
│   └── vite.config.ts
├── server/
│   ├── index.ts                   # Express, /api/ai
│   ├── prompts/                   # test.txt, chat.txt, vaziyat.txt, belgi.txt
│   ├── limits.ts                  # rate limit
│   └── .env                       # ANTHROPIC_API_KEY (git'ga qo'shilmaydi!)
└── README.md
```

---

*Eslatma: AI javoblari o'quv-maslahat xarakteriga ega ekani haqidagi ogohlantirish ilovaning footer qismida va vaziyat tahlili natijalarida doim ko'rsatiladi. Rasmiy manba — YHQ va MJtK.*