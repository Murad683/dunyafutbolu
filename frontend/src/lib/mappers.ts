import type { Article, ApiTransfer, ApiVideo } from '@/types/api';
import type { CarouselSlide, NewsArticle, PopularNewsItem, Transfer, MockVideo } from '@/data/mockData';

/**
 * Format an ISO date string to a human-readable Azerbaijani format.
 */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
      'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

/**
 * Format number of views to a short string format.
 */
function formatViews(views: number): string {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
}

/**
 * Map a backend Article to the frontend CarouselSlide shape.
 */
export function toCarouselSlide(article: Article): CarouselSlide {
  return {
    id: article.id,
    slug: article.slug,
    image: article.image,
    category: article.category?.label ?? '',
    title: article.title,
    subtitle: article.excerpt,
    date: formatDate(article.createdAt),
    views: formatViews(article.views),
    readTime: article.readTime,
  };
}

/**
 * Map a backend Article to the frontend NewsArticle shape.
 */
export function toNewsArticle(article: Article): NewsArticle {
  return {
    id: article.id,
    slug: article.slug,
    image: article.image,
    category: article.category?.label ?? '',
    categorySlug: article.category?.slug ?? '',
    title: article.title,
    date: formatDate(article.createdAt),
    views: formatViews(article.views),
    readTime: article.readTime,
    isFeatured: article.isFeatured,
    excerpt: article.excerpt,
    body: article.body ?? [],
  };
}

/**
 * Map a backend Article to the frontend PopularNewsItem shape.
 */
export function toPopularNewsItem(article: Article, rank: number): PopularNewsItem {
  return {
    id: article.id,
    rank,
    slug: article.slug,
    image: article.image,
    title: article.title,
    views: formatViews(article.views),
    date: formatDate(article.createdAt),
  };
}

/**
 * Map a backend Transfer to the frontend Transfer shape.
 */
export function toTransfer(t: ApiTransfer): Transfer {
  return {
    id: t.id,
    playerName: t.playerName,
    fromClub: t.fromClub,
    fromClubLogo: t.fromClubLogo,
    toClub: t.toClub,
    toClubLogo: t.toClubLogo,
    fee: t.fee,
    league: t.league,
    image: t.image,
    type: t.type,
    date: formatDate(t.date),
  };
}

/**
 * Map a backend Video to the frontend MockVideo shape.
 */
export function toVideo(v: ApiVideo): MockVideo {
  return {
    id: v.id.toString(),
    youtubeId: v.youtubeId,
    title: v.title,
    category: v.category,
    views: v.views,
    date: formatDate(v.date),
  };
}

