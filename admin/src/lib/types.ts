export type TransferType = 'giriş' | 'çıxış' | 'icarə';

export type BannerPlacement = 'TOP_728X90' | 'SIDEBAR_300X350';

export interface Category {
  id: number;
  slug: string;
  label: string;
  parent?: Category;
}

export interface Article {
  id: number;
  slug: string;
  image: string;
  title: string;
  excerpt: string;
  body: string[];
  views: number;
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
  fromClubLogo?: string;
  toClub: string;
  toClubLogo?: string;
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

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: BannerPlacement;
  isActive: boolean;
}

export interface Newsletter {
  id: number;
  email: string;
  subscribedAt: string;
}
