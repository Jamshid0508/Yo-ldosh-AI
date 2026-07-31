// Yo'l belgilari SVG generatori.
// TZ 4.1-band: "Yetishmagan belgilar geometrik shakl bo'lgani uchun Claude Code
// yordamida SVG qilib chiziladi." Yangi belgi qo'shish uchun quyidagi SIGNS
// ro'yxatiga element qo'shing va `node scripts/generate-signs.mjs` ni ishga tushiring.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIGNS_DIR = join(__dirname, "..", "src", "assets", "signs");
const DATA_FILE = join(__dirname, "..", "src", "data", "signs.json");

mkdirSync(SIGNS_DIR, { recursive: true });

const RED = "#C8362B";
const BLUE = "#15529E";
const YELLOW = "#FFC61E";
const BLACK = "#1B1E24";
const WHITE = "#FFFFFF";

const svgHeader = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`;

// ---- Shakl konteynerlari ----------------------------------------------

function triangle(inner) {
  return svgHeader(`
    <polygon points="50,6 95,90 5,90" fill="${WHITE}" stroke="${RED}" stroke-width="7" stroke-linejoin="round"/>
    <g transform="translate(0,6)">${inner}</g>
  `);
}

function circleProhibit(inner) {
  return svgHeader(`
    <circle cx="50" cy="50" r="45" fill="${WHITE}" stroke="${RED}" stroke-width="9"/>
    ${inner}
  `);
}

function circleMandatory(inner) {
  return svgHeader(`
    <circle cx="50" cy="50" r="47" fill="${BLUE}"/>
    ${inner}
  `);
}

function squareInfo(inner) {
  return svgHeader(`
    <rect x="6" y="6" width="88" height="88" rx="10" fill="${BLUE}"/>
    ${inner}
  `);
}

function plate(inner) {
  return svgHeader(`
    <rect x="4" y="24" width="92" height="52" rx="4" fill="${WHITE}" stroke="${BLACK}" stroke-width="3"/>
    ${inner}
  `);
}

function diamondPriority(inner) {
  return svgHeader(`
    <rect x="22" y="22" width="56" height="56" fill="${WHITE}" stroke="${BLACK}" stroke-width="2" transform="rotate(45 50 50)"/>
    <rect x="30" y="30" width="40" height="40" fill="${YELLOW}" transform="rotate(45 50 50)"/>
    ${inner}
  `);
}

// ---- Pastki darajadagi piktogrammalar -----------------------------------

const carSide = (color = BLACK) => `
  <path d="M14 8 h30 l6 8 h6 a4 4 0 0 1 4 4 v6 h-54 v-6 a4 4 0 0 1 4 -4 h4 z" fill="${color}"/>
  <circle cx="20" cy="26" r="4" fill="${WHITE}"/>
  <circle cx="52" cy="26" r="4" fill="${WHITE}"/>
`;

const person = (color = BLACK, x = 0, y = 0) => `
  <g transform="translate(${x} ${y})">
    <circle cx="10" cy="4" r="5" fill="${color}"/>
    <path d="M10 9 v16 M10 14 l-8 8 M10 14 l8 8 M10 25 l-6 12 M10 25 l6 12" stroke="${color}" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  </g>
`;

const railCross = () => `
  <g stroke="${BLACK}" stroke-width="6">
    <line x1="20" y1="20" x2="70" y2="70"/>
    <line x1="70" y1="20" x2="20" y2="70"/>
  </g>
`;

function arrow(rotation, color = WHITE) {
  return `<g transform="rotate(${rotation} 50 50)"><path d="M50 24 L66 52 L56 52 L56 76 L44 76 L44 52 L34 52 Z" fill="${color}"/></g>`;
}

function numberText(text, size = 34, color = BLACK) {
  return `<text x="50" y="63" text-anchor="middle" font-family="Overpass, Arial, sans-serif" font-weight="800" font-size="${size}" fill="${color}">${text}</text>`;
}

// ---- Belgilar ro'yxati ----------------------------------------------------

const SIGNS = [
  // 1.x — ogohlantiruvchi (uchburchak)
  {
    id: "1.1", nom: "Temir yo'l kesishmasi (shlagbaumli)", kategoriya: "ogohlantiruvchi",
    tavsif: "Shlagbaumli temir yo'l kesishmasiga yaqinlashish haqida ogohlantiradi.",
    amal_zonasi: "Belgidan kesishmagacha, shahar tashqarisida 150-300m, shaharda 50-100m.",
    jarima_izoh: "Ogohlantiruvchi belgi — o'zi jarima sababi emas, lekin talabga rioya qilmaslik MJtK bo'yicha javobgarlikka olib kelishi mumkin.",
    svg: triangle(railCross() + `<rect x="30" y="34" width="8" height="10" fill="${BLACK}"/><rect x="62" y="34" width="8" height="10" fill="${BLACK}"/>`),
  },
  {
    id: "1.2", nom: "Temir yo'l kesishmasi (shlagbaumsiz)", kategoriya: "ogohlantiruvchi",
    tavsif: "Shlagbaumsiz temir yo'l kesishmasiga yaqinlashish haqida ogohlantiradi.",
    amal_zonasi: "Belgidan kesishmagacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(railCross()),
  },
  {
    id: "1.8", nom: "Svetofor bilan tartibga solish", kategoriya: "ogohlantiruvchi",
    tavsif: "Yo'l qismida svetofor o'rnatilganidan xabar beradi.",
    amal_zonasi: "Belgidan svetoforgacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(`
      <rect x="38" y="18" width="24" height="46" rx="6" fill="${BLACK}"/>
      <circle cx="50" cy="28" r="6" fill="${RED}"/>
      <circle cx="50" cy="42" r="6" fill="${YELLOW}"/>
      <circle cx="50" cy="56" r="6" fill="#1F8A4E"/>
    `),
  },
  {
    id: "1.15", nom: "Sirpanchiq yo'l", kategoriya: "ogohlantiruvchi",
    tavsif: "Yo'l qoplamasi sirpanchiq bo'lishi mumkinligi haqida ogohlantiradi.",
    amal_zonasi: "Belgidan xavfli qismgacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(`<path d="M20 55 q30 -22 60 0" stroke="${BLACK}" stroke-width="5" fill="none"/><path d="M46 44 l10 -4 l-2 11 z" fill="${BLACK}"/>`),
  },
  {
    id: "1.16", nom: "Notekis yo'l", kategoriya: "ogohlantiruvchi",
    tavsif: "Yo'l qoplamasida notekisliklar (chuqurlik, do'nglik) mavjudligi haqida ogohlantiradi.",
    amal_zonasi: "Belgidan xavfli qismgacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(`<path d="M16 62 l14 -20 l14 16 l14 -20 l14 20 l12 -12" stroke="${BLACK}" stroke-width="5" fill="none" stroke-linejoin="round"/>`),
  },
  {
    id: "1.17", nom: "Sun'iy notekislik", kategoriya: "ogohlantiruvchi",
    tavsif: "Sun'iy yo'l do'ngligi (\"lежачий полицейский\") oldidan ogohlantiradi.",
    amal_zonasi: "Belgidan do'nglikkacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(`<path d="M14 62 q18 -26 36 0 q18 -26 36 0" stroke="${BLACK}" stroke-width="5" fill="none"/>`),
  },
  {
    id: "1.20.1", nom: "Piyodalar o'tish joyi (ogohlantirish)", kategoriya: "ogohlantiruvchi",
    tavsif: "Oldinda piyodalar o'tish joyi borligi haqida ogohlantiradi.",
    amal_zonasi: "Belgidan o'tish joyigacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(person(BLACK, 40, 26)),
  },
  {
    id: "1.21", nom: "Bolalar", kategoriya: "ogohlantiruvchi",
    tavsif: "Yaqin atrofda bolalar chiqishi mumkin bo'lgan joy (maktab, bog'cha) borligi haqida ogohlantiradi.",
    amal_zonasi: "Belgidan xavfli qismgacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(person(BLACK, 26, 28) + person(BLACK, 46, 30)),
  },
  {
    id: "1.23", nom: "Velosipedchilar", kategoriya: "ogohlantiruvchi",
    tavsif: "Velosipedchilar chiqishi mumkin bo'lgan yo'l qismi haqida ogohlantiradi.",
    amal_zonasi: "Belgidan xavfli qismgacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(`<circle cx="34" cy="60" r="9" fill="none" stroke="${BLACK}" stroke-width="4"/><circle cx="64" cy="60" r="9" fill="none" stroke="${BLACK}" stroke-width="4"/><path d="M34 60 L46 38 L58 60 M46 38 L54 60 M40 48 h14" stroke="${BLACK}" stroke-width="3.4" fill="none"/>`),
  },
  {
    id: "1.31", nom: "Boshqa xavflar", kategoriya: "ogohlantiruvchi",
    tavsif: "Boshqa belgilar bilan ko'rsatilmagan xavf haqida umumiy ogohlantirish.",
    amal_zonasi: "Belgidan xavfli qismgacha.",
    jarima_izoh: "Ogohlantiruvchi belgi.",
    svg: triangle(`<rect x="46" y="30" width="8" height="26" fill="${BLACK}"/><circle cx="50" cy="64" r="5" fill="${BLACK}"/>`),
  },

  // 2.x — imtiyoz (ustunlik)
  {
    id: "2.1", nom: "Bosh yo'l", kategoriya: "imtiyoz",
    tavsif: "Haydovchi kesishmada ustunlik huquqiga ega ekanini bildiradi.",
    amal_zonasi: "Keyingi kesishmagacha yoki bekor qiluvchi belgigacha.",
    jarima_izoh: "Ustunlikni buzish MJtK bo'yicha javobgarlikka sabab bo'lishi mumkin.",
    svg: diamondPriority(""),
  },
  {
    id: "2.2", nom: "Bosh yo'l tugashi", kategoriya: "imtiyoz",
    tavsif: "\"Bosh yo'l\" belgisi amal qilishining tugashini bildiradi.",
    amal_zonasi: "O'rnatilgan joydan boshlab.",
    jarima_izoh: "Ustunlikni buzish MJtK bo'yicha javobgarlikka sabab bo'lishi mumkin.",
    svg: diamondPriority(`<line x1="15" y1="85" x2="85" y2="15" stroke="${RED}" stroke-width="5"/>`),
  },
  {
    id: "2.4", nom: "Yo'l bering", kategoriya: "imtiyoz",
    tavsif: "Haydovchi kesishayotgan yo'ldagi transport vositalariga yo'l berishi shartligini bildiradi.",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "Ustunlikni buzish MJtK bo'yicha ma'muriy javobgarlikka sabab bo'lishi mumkin.",
    svg: svgHeader(`<polygon points="8,14 92,14 50,90" fill="${WHITE}" stroke="${RED}" stroke-width="8" stroke-linejoin="round"/>`),
  },
  {
    id: "2.5", nom: "Harakatsiz to'xtash (STOP)", kategoriya: "imtiyoz",
    tavsif: "Haydovchi to'liq to'xtashi va bosh yo'ldagi transportga yo'l berishi shart.",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "To'xtamaslik MJtK bo'yicha jarimaga sabab bo'ladi.",
    svg: svgHeader(`
      <polygon points="32,4 68,4 96,32 96,68 68,96 32,96 4,68 4,32" fill="${RED}" stroke="${WHITE}" stroke-width="3"/>
      <text x="50" y="63" text-anchor="middle" font-family="Overpass, Arial, sans-serif" font-weight="800" font-size="26" fill="${WHITE}">STOP</text>
    `),
  },

  // 3.x — taqiqlovchi (doira, qizil ramka)
  {
    id: "3.1", nom: "Kirish taqiqlangan", kategoriya: "taqiqlovchi",
    tavsif: "Barcha transport vositalarining shu tomondan kirishi taqiqlanadi.",
    amal_zonasi: "O'rnatilgan joyning o'zida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: svgHeader(`<circle cx="50" cy="50" r="45" fill="${RED}" stroke="${BLACK}" stroke-width="1"/><rect x="18" y="42" width="64" height="16" rx="2" fill="${WHITE}"/>`),
  },
  {
    id: "3.2", nom: "Harakatlanish taqiqlangan", kategoriya: "taqiqlovchi",
    tavsif: "Barcha turdagi transport vositalarining harakatlanishi taqiqlanadi.",
    amal_zonasi: "O'rnatilgan joydan keyingi kesishmagacha.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleProhibit(`<line x1="20" y1="20" x2="80" y2="80" stroke="${RED}" stroke-width="9"/>`),
  },
  {
    id: "3.11", nom: "Massasi cheklangan", kategoriya: "taqiqlovchi",
    tavsif: "Ko'rsatilgan massadan og'ir transport vositalari harakatlanishi taqiqlanadi.",
    amal_zonasi: "O'rnatilgan joydan keyingi kesishmagacha.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleProhibit(`<path d="M22 62 l6 -20 h44 l6 20 z" fill="none" stroke="${BLACK}" stroke-width="4"/><circle cx="34" cy="66" r="5" fill="${BLACK}"/><circle cx="66" cy="66" r="5" fill="${BLACK}"/>` + numberText("3,5t", 16)),
  },
  {
    id: "3.13", nom: "Balandligi cheklangan", kategoriya: "taqiqlovchi",
    tavsif: "Ko'rsatilgan balandlikdan baland transport vositalari harakatlanishi taqiqlanadi.",
    amal_zonasi: "O'rnatilgan joydan keyingi kesishmagacha.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleProhibit(`<path d="M24 36 h52 M30 36 v28 h40 v-28" fill="none" stroke="${BLACK}" stroke-width="5"/>` + numberText("3,5m", 15)),
  },
  {
    id: "3.20", nom: "Quvib o'tish taqiqlangan", kategoriya: "taqiqlovchi",
    tavsif: "Tirkama va ikki g'ildirakli transportdan tashqari barcha vositalarni quvib o'tish taqiqlanadi.",
    amal_zonasi: "Keyingi kesishma yoki bekor qiluvchi belgigacha.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik, jiddiy holatlarda huquqni cheklash.",
    svg: circleProhibit(`<g transform="translate(-6 0)">${carSide(RED)}</g><g transform="translate(20 0)">${carSide(BLACK)}</g><line x1="18" y1="20" x2="82" y2="80" stroke="${RED}" stroke-width="7"/>`),
  },
  {
    id: "3.24", nom: "Maksimal tezlik cheklangan", kategoriya: "taqiqlovchi",
    tavsif: "Ko'rsatilgan qiymatdan yuqori tezlikda harakatlanish taqiqlanadi.",
    amal_zonasi: "Keyingi kesishma yoki bekor qiluvchi belgigacha.",
    jarima_izoh: "Tezlik chegarasini buzish MJtK bo'yicha keng tarqalgan jarima turi.",
    svg: circleProhibit(numberText("60", 34)),
  },
  {
    id: "3.27", nom: "To'xtash taqiqlangan", kategoriya: "taqiqlovchi",
    tavsif: "Transport vositalarining to'xtashi ham, to'xtab turishi ham taqiqlanadi.",
    amal_zonasi: "Belgi o'rnatilgan joydan yaqin kesishmagacha.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleProhibit(`<line x1="20" y1="30" x2="80" y2="70" stroke="${RED}" stroke-width="9"/>`),
  },
  {
    id: "3.28", nom: "To'xtab turish taqiqlangan", kategoriya: "taqiqlovchi",
    tavsif: "Transport vositalarining to'xtab turishi (uzoq muddat) taqiqlanadi, qisqa to'xtash mumkin.",
    amal_zonasi: "Belgi o'rnatilgan joydan yaqin kesishmagacha.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleProhibit(`<line x1="20" y1="30" x2="80" y2="70" stroke="${RED}" stroke-width="9" stroke-dasharray="14 10"/>`),
  },

  // 4.x — buyuruvchi (ko'k doira)
  {
    id: "4.1.1", nom: "Faqat to'g'riga harakatlanish", kategoriya: "buyuruvchi",
    tavsif: "Faqat to'g'riga harakatlanishga ruxsat beriladi.",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(arrow(0)),
  },
  {
    id: "4.1.2", nom: "Faqat o'ngga harakatlanish", kategoriya: "buyuruvchi",
    tavsif: "Faqat o'ngga burilishga ruxsat beriladi.",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(arrow(90)),
  },
  {
    id: "4.1.3", nom: "Faqat chapga harakatlanish", kategoriya: "buyuruvchi",
    tavsif: "Faqat chapga burilishga ruxsat beriladi (aylanma harakatga ham).",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(arrow(270)),
  },
  {
    id: "4.1.4", nom: "To'g'riga yoki o'ngga harakatlanish", kategoriya: "buyuruvchi",
    tavsif: "Faqat to'g'riga yoki o'ngga harakatlanishga ruxsat beriladi.",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(arrow(0) + arrow(90)),
  },
  {
    id: "4.2.1", nom: "To'siqni o'ngdan aylanib o'tish", kategoriya: "buyuruvchi",
    tavsif: "To'siq yoki orolchani faqat o'ng tomondan aylanib o'tish kerak.",
    amal_zonasi: "To'siq joylashgan qismda.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(arrow(35)),
  },
  {
    id: "4.3", nom: "Aylanma harakat", kategoriya: "buyuruvchi",
    tavsif: "Kesishmada faqat ko'rsatilgan yo'nalishda (soat strelkasi bo'yicha) aylanma harakat qilish kerak.",
    amal_zonasi: "Kesishmaning o'zida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(`<g transform="rotate(-20 50 50)"><circle cx="50" cy="50" r="24" fill="none" stroke="${WHITE}" stroke-width="7"/><path d="M50 26 l10 10 l-14 2 z" fill="${WHITE}"/></g>`),
  },
  {
    id: "4.5", nom: "Velosiped yo'lkasi", kategoriya: "buyuruvchi",
    tavsif: "Faqat velosipedchilar uchun mo'ljallangan yo'lak.",
    amal_zonasi: "Yo'lak davomida.",
    jarima_izoh: "MJtK bo'yicha ma'muriy javobgarlik.",
    svg: circleMandatory(`<circle cx="36" cy="62" r="9" fill="none" stroke="${WHITE}" stroke-width="4"/><circle cx="64" cy="62" r="9" fill="none" stroke="${WHITE}" stroke-width="4"/><path d="M36 62 L46 38 L58 62 M46 38 L52 62" stroke="${WHITE}" stroke-width="3.4" fill="none"/>`),
  },

  // 5.x — axborot-ishora (ko'k kvadrat)
  {
    id: "5.1", nom: "Avtomagistral", kategoriya: "axborot-ishora",
    tavsif: "Yo'l avtomagistral talablariga javob berishini bildiradi.",
    amal_zonasi: "Avtomagistral davomida.",
    jarima_izoh: "Axborot belgisi — piyodalar, tihoyurar transport kirishi taqiqlanadi.",
    svg: squareInfo(carSide(WHITE)),
  },
  {
    id: "5.15.1", nom: "Harakat yo'nalishi bo'yicha yo'l qatnovi", kategoriya: "axborot-ishora",
    tavsif: "Har bir qatnov qismidan qaysi yo'nalishda harakatlanish mumkinligini ko'rsatadi.",
    amal_zonasi: "Kesishmagacha.",
    jarima_izoh: "Axborot belgisi.",
    svg: squareInfo(`<g transform="translate(-12 0) scale(0.8)">${arrow(0)}</g><g transform="translate(16 0) scale(0.8)">${arrow(90)}</g>`),
  },
  {
    id: "5.16", nom: "Avtobus bekati", kategoriya: "axborot-ishora",
    tavsif: "Jamoat transporti to'xtash joyini bildiradi.",
    amal_zonasi: "Bekat hududida.",
    jarima_izoh: "Bekat yaqinida to'xtash/parkovka qilish taqiqlanishi mumkin (3.27/3.28 bilan birga).",
    svg: squareInfo(`${carSide(WHITE)}<text x="50" y="80" text-anchor="middle" font-size="14" font-weight="700" fill="${WHITE}">A</text>`),
  },
  {
    id: "5.19.1", nom: "Piyodalar o'tish joyi", kategoriya: "axborot-ishora",
    tavsif: "Piyodalar o'tish joyi joylashgan hududni bildiradi.",
    amal_zonasi: "Ko'rsatilgan o'tish joyida.",
    jarima_izoh: "Piyodaga yo'l bermaslik MJtK bo'yicha jarimaga sabab bo'ladi.",
    svg: squareInfo(`<polygon points="30,30 70,30 60,78 40,78" fill="${WHITE}"/>` + person(BLUE, 40, 34)),
  },

  // 6.x — servis (ko'k kvadrat, xizmat)
  {
    id: "6.4", nom: "To'xtash joyi (parkovka)", kategoriya: "servis",
    tavsif: "Transport vositalarini to'xtatish uchun mo'ljallangan joy.",
    amal_zonasi: "Ko'rsatilgan hududda.",
    jarima_izoh: "Axborot-servis belgisi.",
    svg: squareInfo(`<text x="50" y="70" text-anchor="middle" font-family="Overpass, Arial, sans-serif" font-weight="800" font-size="46" fill="${WHITE}">P</text>`),
  },
  {
    id: "6.7", nom: "Ovqatlanish joyi", kategoriya: "servis",
    tavsif: "Yaqin atrofda kafe/restoran borligini bildiradi.",
    amal_zonasi: "Ko'rsatilgan joyda.",
    jarima_izoh: "Servis belgisi.",
    svg: squareInfo(`<rect x="30" y="26" width="6" height="40" fill="${WHITE}"/><rect x="42" y="26" width="6" height="40" fill="${WHITE}"/><path d="M62 26 v40 M58 26 v16 a4 4 0 0 0 8 0 v-16" stroke="${WHITE}" stroke-width="4" fill="none"/>`),
  },
  {
    id: "6.8", nom: "Yoqilg'i quyish shoxobchasi", kategoriya: "servis",
    tavsif: "Yaqin atrofda AYoQSh (benzin quyish) borligini bildiradi.",
    amal_zonasi: "Ko'rsatilgan joyda.",
    jarima_izoh: "Servis belgisi.",
    svg: squareInfo(`<rect x="34" y="30" width="22" height="40" rx="3" fill="${WHITE}"/><path d="M56 42 h8 a4 4 0 0 1 4 4 v18 a3 3 0 0 1 -6 0 v-10 h-6" stroke="${WHITE}" stroke-width="4" fill="none"/>`),
  },

  // 7.x — qo'shimcha lavha (oq to'rtburchak)
  {
    id: "7.2.1", nom: "Amal qilish zonasi", kategoriya: "qoshimcha",
    tavsif: "Asosiy belgi amal qilish zonasi (masofa)ni ko'rsatadi.",
    amal_zonasi: "Bosh belgi bilan birga.",
    jarima_izoh: "Qo'shimcha lavha — mustaqil jarima predmeti emas, bosh belgi bilan birga o'qiladi.",
    svg: plate(`<line x1="20" y1="50" x2="80" y2="50" stroke="${BLACK}" stroke-width="3"/>` + numberText("100 m", 18)),
  },
  {
    id: "7.5", nom: "Transport turi", kategoriya: "qoshimcha",
    tavsif: "Bosh belgi faqat ko'rsatilgan transport turlariga tegishli ekanini bildiradi.",
    amal_zonasi: "Bosh belgi bilan birga.",
    jarima_izoh: "Qo'shimcha lavha.",
    svg: plate(carSide(BLACK)),
  },
];

for (const s of SIGNS) {
  const filename = `${s.id.replaceAll(".", "_")}.svg`;
  writeFileSync(join(SIGNS_DIR, filename), s.svg.trim() + "\n", "utf-8");
}

const data = SIGNS.map((s) => ({
  id: s.id,
  nom: s.nom,
  kategoriya: s.kategoriya,
  svg: `${s.id.replaceAll(".", "_")}.svg`,
  tavsif: s.tavsif,
  amal_zonasi: s.amal_zonasi,
  jarima_izoh: s.jarima_izoh,
}));

writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");

console.log(`${SIGNS.length} ta belgi yaratildi -> ${SIGNS_DIR}`);
console.log(`Metadata yozildi -> ${DATA_FILE}`);
