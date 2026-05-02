export interface NewsArticle {
  id: number;
  category: string;
  categorySlug?: string;
  title: string;
  slug: string;
  image: string;
  date: string;
  readTime: string;
  views: string;
  excerpt: string;
  body: string[];
  isFeatured: boolean;
}

export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  slug: string;
  date: string;
  views: string;
  readTime: string;
}

export interface PopularItem {
  id: number;
  rank: number;
  category: string;
  title: string;
  slug: string;
  image: string;
  views: string;
  date: string;
}

export interface Transfer {
  id: number;
  playerName: string;
  image: string;
  fromClub: string;
  fromClubLogo?: string;
  toClub: string;
  toClubLogo?: string;
  fee: string;
  type: "Daimi Transfer" | "İcarə" | "Mübadilə" | "Digər";
  date: string;
  league: string;
}

export interface VideoItem {
  id: string | number;
  youtubeId: string;
  title: string;
  category: string;
  date: string;
  views: string;
}
