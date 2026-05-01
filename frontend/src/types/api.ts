export interface Category {
  id: number;
  slug: string;
  label: string;
  parent?: Category;
  children?: Category[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  body: string[];
  views: number;
  readTime: string;
  isFeatured: boolean;
  category: Category;
  createdAt: string;
}

export interface ApiTransfer {
  id: number;
  playerName: string;
  fromClub: string;
  fromClubLogo?: string;
  toClub: string;
  toClubLogo?: string;
  fee: string;
  league: string;
  image: string;
  type: 'giriş' | 'çıxış' | 'icarə';
  date: string;
}

export interface ApiVideo {
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
  placement: 'TOP_728X90' | 'SIDEBAR_300X350';
  isActive: boolean;
}

export interface Newsletter {
  id: number;
  email: string;
  subscribedAt: string;
}
