export type LeagueType = 'local' | 'world' | 'special';
export type TransferType = 'giriş' | 'çıxış' | 'icarə';

export interface Category {
  id: number;
  slug: string;
  label: string;
  leagueType: LeagueType;
}

export interface Article {
  id: number;
  slug: string;
  image: string;
  title: string;
  excerpt: string;
  body: string[];
  views: string;
  readTime: string;
  isFeatured: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  id: number;
  playerName: string;
  fromClub: string;
  toClub: string;
  fee: string;
  league: string;
  image: string;
  type: TransferType;
  date: string;
}

export interface Video {
  id: number;
  youtubeId: string;
  title: string;
  category: string;
  views: string;
  thumbnailUrl: string;
  date: string;
}
