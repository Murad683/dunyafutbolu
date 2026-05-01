import { getArticleImage } from "./articleImages";

export interface CarouselSlide {
  id: number;
  slug: string;
  image: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  views: string;
  readTime: string;
}

export interface NewsArticle {
  id: number;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
  title: string;
  date: string;
  views: string;
  readTime: string;
  isFeatured?: boolean;
  excerpt: string;
  body: string[];
}

export interface PopularNewsItem {
  id: number;
  rank: number;
  slug: string;
  image: string;
  title: string;
  views: string;
  date: string;
}

export interface LiveMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  league: string;
  isLive: boolean;
  time?: string;
}

export interface Category {
  slug: string;
  label: string;
  leagueType: "local" | "world" | "special";
}

export interface MockVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
  date: string;
  views: string;
}

export interface Transfer {
  id: number;
  playerName: string;
  fromClub: string;
  fromClubLogo?: string;
  toClub: string;
  toClubLogo?: string;
  fee: string;
  league: string;
  date: string;
  image: string;
  type: "giriş" | "çıxış" | "icarə";
}

// ─── Categories ────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { slug: "premyer-liqa", label: "Premyer Liqa", leagueType: "local" },
  { slug: "i-liqa", label: "I Liqa", leagueType: "local" },
  { slug: "azerbaycan-kuboku", label: "Azərbaycan Kuboku", leagueType: "local" },
  { slug: "milli-komanda", label: "Milli Komanda", leagueType: "local" },
  { slug: "ingiltere", label: "İngiltərə Premyer Liqası", leagueType: "world" },
  { slug: "ispaniya", label: "İspaniya La Liqası", leagueType: "world" },
  { slug: "italiya", label: "İtaliya Seriya A", leagueType: "world" },
  { slug: "almaniya", label: "Almaniya Bundesliqa", leagueType: "world" },
  { slug: "chempionlar-liqasi", label: "Çempionlar Liqası", leagueType: "world" },
  { slug: "transferler", label: "Transferlər", leagueType: "special" },
  { slug: "video", label: "Video", leagueType: "special" },
];

// ─── Carousel Slides ───────────────────────────────────────────────────

export const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    slug: "barselona-cempionlar-liqasinda-mohtesem-qelebe",
    image: getArticleImage(101),
    category: "Çempionlar Liqası",
    title: "Barselona Çempionlar Liqasında möhtəşəm qələbə qazandı",
    subtitle: "Kataloniyalılar rəqibini 3-0 məğlub edərək yarımfinala yüksəldi",
    date: "25 İyun 2025",
    views: "14.3K",
    readTime: "4 dəq",
  },
  {
    id: 2,
    slug: "real-madrid-klasikoda-rekord",
    image: getArticleImage(102),
    category: "İspaniya La Liqası",
    title: 'Real Madrid "Klasiko"da tarixi rekorda imza atdı',
    subtitle: "Ağ klub rəqibini darmadağın edərək lider mövqeyini möhkəmləndirdi",
    date: "24 İyun 2025",
    views: "22.8K",
    readTime: "5 dəq",
  },
  {
    id: 3,
    slug: "liverpul-yeni-movsumun-lideri",
    image: getArticleImage(103),
    category: "İngiltərə Premyer Liqası",
    title: "Liverpul yeni mövsümün lideri oldu",
    subtitle: "Qırmızılar səfərdə inanılmaz oyun nümayiş etdirdi",
    date: "23 İyun 2025",
    views: "11.4K",
    readTime: "3 dəq",
  },
  {
    id: 4,
    slug: "azerbaycan-millisi-qelebe",
    image: getArticleImage(104),
    category: "Milli Komanda",
    title: "Azərbaycan millisi seçmə mərhələdə vacib qələbə qazandı",
    subtitle: "Komandamız Bakıda azarkeşləri sevindirdi",
    date: "22 İyun 2025",
    views: "31.2K",
    readTime: "6 dəq",
  },
  {
    id: 5,
    slug: "mbappenin-yeni-klubu",
    image: getArticleImage(105),
    category: "Transferlər",
    title: "Mbappenin yeni klubu açıqlandı: Yay transfer bombası",
    subtitle: "Fransız ulduzu rekord məbləğə yeni komandasına keçdi",
    date: "21 İyun 2025",
    views: "48.6K",
    readTime: "4 dəq",
  },
];

// ─── News Articles ─────────────────────────────────────────────────────

const titles = [
  "Mançester Siti bu mövsüm ən yaxşı formunu nümayiş etdirir",
  "Bavariya Bundesliqada üst-üstə altıncı qələbəsini qazandı",
  "Yuventus İtaliya Kubokunda finala yüksəldi",
  "Qarabağ Avropa karvanında yenidən sözünü dedi",
  "Neftçi yerli derbidə üstün oyun göstərdi",
  "Atletiko Madrid mövsümün ən yaxşı qolunu vurdu",
  "PSJ-nin yeni baş məşqçisi rəsmən təqdim olundu",
  "Arsenal gənc istedadı uzunmüddətli müqavilə ilə bağladı",
  "Inter Milan rəqibini 4-1 hesabı ilə məğlub etdi",
  "Tottenham qışda bu ulduz futbolçunu transfer etmək istəyir",
  "Milli komandanın baş məşqçisi heyəti açıqladı",
  "Naqalfis bu mövsümün ən yaxşı qapıçısı seçildi",
  // — 8 additional articles (Phase 1 requirement) ─────────
  "Keşlə Premyer Liqada sürpriz qələbə qazandı",
  "Zirə FK Azərbaycan Kubokunda yarımfinala yüksəldi",
  "İngiltərə Premyer Liqasında mövsümün ən böyük dönüşü",
  "La Liqa: Barselona ilə Real arasındakı xal fərqi azaldı",
  "Çempionlar Liqası pley-off cütləri müəyyənləşdi",
  "Yay transfer pəncərəsinin ən bahalı 10 transferi",
  "Sabah FK I Liqada liderlik yarışını davam etdirir",
  "Milli komanda qonaq oyununda heç-heçəyə razılaşdı",
];

const categories = [
  "İngiltərə Premyer Liqası",
  "Almaniya Bundesliqa",
  "İtaliya Seriya A",
  "Premyer Liqa",
  "Premyer Liqa",
  "İspaniya La Liqası",
  "Transferlər",
  "İngiltərə Premyer Liqası",
  "İtaliya Seriya A",
  "Transferlər",
  "Milli Komanda",
  "Çempionlar Liqası",
  // categories for the 8 new articles
  "Premyer Liqa",
  "Azərbaycan Kuboku",
  "İngiltərə Premyer Liqası",
  "İspaniya La Liqası",
  "Çempionlar Liqası",
  "Transferlər",
  "I Liqa",
  "Milli Komanda",
];

const categorySlugs = [
  "ingiltere",
  "almaniya",
  "italiya",
  "premyer-liqa",
  "premyer-liqa",
  "ispaniya",
  "transferler",
  "ingiltere",
  "italiya",
  "transferler",
  "milli-komanda",
  "chempionlar-liqasi",
  "premyer-liqa",
  "azerbaycan-kuboku",
  "ingiltere",
  "ispaniya",
  "chempionlar-liqasi",
  "transferler",
  "i-liqa",
  "milli-komanda",
];

// Deterministic view counts to avoid SSR/CSR hydration mismatch
const viewSeeds = [
  15.5, 8.2, 12.7, 6.4, 21.3, 9.8, 17.6, 4.9, 13.2, 7.1, 19.4, 10.5,
  11.1, 5.7, 24.8, 16.3, 30.2, 22.4, 8.9, 14.6,
];

const sampleParagraphs = [
  "Komanda son oyunlarda nümayiş etdirdiyi yüksək formanı davam etdirərək azarkeşləri sevindirməyə davam edir. Baş məşqçinin taktiki yanaşması və oyunçuların fərdi məharətləri qələbənin əsas amillərindən birinə çevrilib.",
  "Oyunun ilk hissəsində iki tərəf də ehtiyatlı oynasa da, ikinci hissədə tempin artması ilə qollar peyda olmağa başladı. Heyət üzvlərinin kollektiv işi və mərkəz xəttinin üstünlüyü matçın taleyini həll etdi.",
  "Mütəxəssislər bu nəticənin komandanın gələcək oyunlarına da müsbət təsir edəcəyini bildirir. Növbəti turda komandanı çətin səfər oyunu gözləyir və hazırlıqlar artıq başlayıb.",
  "Azarkeşlər meydanı tərk edərkən komandanı uzun-uzun alqışladılar. Klub rəhbərliyi də nəticədən məmnunluğunu açıqlayaraq bütün heyətə təşəkkürünü bildirdi.",
];

export const newsArticles: NewsArticle[] = titles.map((title, i) => ({
  id: i + 1,
  slug: `xeber-${i + 1}`,
  image: getArticleImage(i + 1),
  category: categories[i % categories.length],
  categorySlug: categorySlugs[i % categorySlugs.length],
  title,
  date: `${24 - (i % 6)} İyun 2025`,
  views: `${viewSeeds[i].toFixed(1)}K`,
  readTime: `${(i % 5) + 2} dəq`,
  isFeatured: i < 2,
  excerpt:
    "Futbol dünyasından ən son və mühüm xəbərlər. Komandanın oyununu, taktikasını və nəticələrini ətraflı şəkildə oxuyun.",
  body: sampleParagraphs,
}));

// ─── Popular News ──────────────────────────────────────────────────────

export const popularNews: PopularNewsItem[] = [
  {
    id: 1,
    rank: 1,
    slug: "xeber-201",
    image: getArticleImage(201),
    title: "Ronaldo yeni rekord qırdı: Tarixi qol sayına çatdı",
    views: "42.1K",
    date: "24 İyun 2025",
  },
  {
    id: 2,
    rank: 2,
    slug: "xeber-202",
    image: getArticleImage(202),
    title: "Messi yenidən Argentina millisinin kapitanı seçildi",
    views: "37.8K",
    date: "24 İyun 2025",
  },
  {
    id: 3,
    rank: 3,
    slug: "xeber-203",
    image: getArticleImage(203),
    title: "Haaland mövsümün ən yaxşı bombardiri elan olundu",
    views: "29.5K",
    date: "23 İyun 2025",
  },
  {
    id: 4,
    rank: 4,
    slug: "xeber-204",
    image: getArticleImage(204),
    title: "Çempionlar Liqasının yeni formatı təsdiqləndi",
    views: "21.3K",
    date: "23 İyun 2025",
  },
  {
    id: 5,
    rank: 5,
    slug: "xeber-205",
    image: getArticleImage(205),
    title: "Premyer Liqada gözlənilməz transfer xəbəri",
    views: "18.7K",
    date: "22 İyun 2025",
  },
];

// ─── Live Matches ──────────────────────────────────────────────────────

export const liveMatches: LiveMatch[] = [
  {
    id: 1,
    homeTeam: "Qarabağ",
    awayTeam: "Neftçi",
    homeScore: 2,
    awayScore: 1,
    minute: "67'",
    league: "Premyer Liqa",
    isLive: true,
  },
  {
    id: 2,
    homeTeam: "Real Madrid",
    awayTeam: "Barselona",
    homeScore: 1,
    awayScore: 1,
    minute: "34'",
    league: "La Liqa",
    isLive: true,
  },
  {
    id: 3,
    homeTeam: "Mançester Siti",
    awayTeam: "Arsenal",
    homeScore: 0,
    awayScore: 0,
    minute: "",
    league: "Premyer Liqa",
    isLive: false,
    time: "20:45",
  },
  {
    id: 4,
    homeTeam: "Bavariya",
    awayTeam: "Dortmund",
    homeScore: 0,
    awayScore: 0,
    minute: "",
    league: "Bundesliqa",
    isLive: false,
    time: "22:30",
  },
];

// ─── Mock Videos ───────────────────────────────────────────────────────

export const MOCK_VIDEOS: MockVideo[] = [
  {
    id: "v1",
    youtubeId: "nFg0N_JesWs",
    title: "Messi: Karyerasının ən yaxşı qolları",
    category: "Qollar",
    date: "20 İyun 2025",
    views: "15M",
  },
  {
    id: "v2",
    youtubeId: "mmeLCAP74KA",
    title: "Kriştiano Ronaldonun fenomenal qolları",
    category: "Qollar",
    date: "18 İyun 2025",
    views: "8.5M",
  },
  {
    id: "v3",
    youtubeId: "GgKIhlyjX2w",
    title: "Çempionlar Liqası 2024 Finalının Xülasəsi",
    category: "Analiz",
    date: "17 İyun 2025",
    views: "12.1M",
  },
  {
    id: "v4",
    youtubeId: "VpICpnKD76k",
    title: "Zidanın Çempionlar Liqasında əfsanəvi voley zərbəsi",
    category: "Qollar",
    date: "15 İyun 2025",
    views: "25M",
  },
  {
    id: "v5",
    youtubeId: "1wVho3I0NtU",
    title: "Dieqo Maradona: Əsrin qolu",
    category: "Qollar",
    date: "14 İyun 2025",
    views: "11M",
  },
  {
    id: "v6",
    youtubeId: "ADi1A1dX9wA",
    title: "Ronaldinyo: Futbolun sehri və ən yaxşı fəndləri",
    category: "Analiz",
    date: "12 İyun 2025",
    views: "7.2M",
  },
  {
    id: "v7",
    youtubeId: "OWOjRdmpM6I",
    title: "Eksklüziv: Neymarla karyerası haqqında xüsusi reportaj",
    category: "Mülakat",
    date: "10 İyun 2025",
    views: "18M",
  },
  {
    id: "v8",
    youtubeId: "BQRcfeWprkE",
    title: "Mbappenin Dünya Kuboku Finalındakı performansı",
    category: "Analiz",
    date: "8 İyun 2025",
    views: "2.5M",
  },
];

// ─── Mock Transfers ────────────────────────────────────────────────────

export const MOCK_TRANSFERS: Transfer[] = [
  {
    id: 1,
    playerName: "Abdellah Zoubir",
    fromClub: "Qarabağ FK",
    toClub: "Al-Ahli",
    fee: "€3.5M",
    league: "Premyer Liqa",
    date: "1 İyul 2025",
    image: getArticleImage(301),
    type: "çıxış",
  },
  {
    id: 2,
    playerName: "Filip Ozobiç",
    fromClub: "Dinamo Zaqreb",
    toClub: "Neftçi PFK",
    fee: "€1.2M",
    league: "Premyer Liqa",
    date: "3 İyul 2025",
    image: getArticleImage(302),
    type: "giriş",
  },
  {
    id: 3,
    playerName: "Ramil Şeydayev",
    fromClub: "Keşlə FK",
    toClub: "Sabah FK",
    fee: "Pulsuz",
    league: "Premyer Liqa",
    date: "5 İyul 2025",
    image: getArticleImage(303),
    type: "giriş",
  },
  {
    id: 4,
    playerName: "Jadon Sancho",
    fromClub: "Mançester Yunayted",
    toClub: "Çelsi",
    fee: "€45M",
    league: "İngiltərə Premyer Liqası",
    date: "7 İyul 2025",
    image: getArticleImage(304),
    type: "giriş",
  },
  {
    id: 5,
    playerName: "Dani Olmo",
    fromClub: "RB Leypsiq",
    toClub: "Barselona",
    fee: "€55M",
    league: "İspaniya La Liqası",
    date: "9 İyul 2025",
    image: getArticleImage(305),
    type: "giriş",
  },
  {
    id: 6,
    playerName: "Mahir Emreli",
    fromClub: "Dinamo Kiyev",
    toClub: "Qarabağ FK",
    fee: "İcarə",
    league: "Premyer Liqa",
    date: "11 İyul 2025",
    image: getArticleImage(306),
    type: "icarə",
  },
  {
    id: 7,
    playerName: "Kenan Yıldız",
    fromClub: "Yuventus",
    toClub: "Bavariya",
    fee: "€38M",
    league: "Almaniya Bundesliqa",
    date: "13 İyul 2025",
    image: getArticleImage(307),
    type: "giriş",
  },
  {
    id: 8,
    playerName: "Emin Mahmudov",
    fromClub: "Neftçi PFK",
    toClub: "Ankaragücü",
    fee: "€800K",
    league: "Premyer Liqa",
    date: "15 İyul 2025",
    image: getArticleImage(308),
    type: "çıxış",
  },
  {
    id: 9,
    playerName: "Federico Chiesa",
    fromClub: "Liverpul",
    toClub: "Inter Milan",
    fee: "İcarə",
    league: "İtaliya Seriya A",
    date: "17 İyul 2025",
    image: getArticleImage(309),
    type: "icarə",
  },
  {
    id: 10,
    playerName: "Ağabala Ramazanov",
    fromClub: "Sabail FK",
    toClub: "Keşlə FK",
    fee: "Pulsuz",
    league: "Premyer Liqa",
    date: "19 İyul 2025",
    image: getArticleImage(310),
    type: "giriş",
  },
];
