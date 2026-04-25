import { useMemo, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Calendar, Eye, ArrowRight, Trophy } from "lucide-react";
import { clsx } from "clsx";
import { newsArticles, CATEGORIES } from "@/data/mockData";
import type { NewsArticle } from "@/data/mockData";
import { Badge } from "@/components/ui-news/Badge";
import { NewsCard } from "@/components/homepage/NewsCard";
import { AdBanner } from "@/components/homepage/AdBanner";
import { Sidebar } from "@/components/homepage/sidebar/Sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { SIDEBAR_TOP_OFFSET_PX } from "@/config/constants";

interface CategoryPageLayoutProps {
  categorySlug: string;
  categoryLabel: string;
  description?: string;
  accentColor?: string;
  featured?: boolean;
}

const ITEMS_PER_PAGE = 9;

/**
 * Match a category slug to the article category label.
 * Uses the CATEGORIES lookup table to resolve slug → label,
 * then filters articles by that label.
 */
function getArticlesForCategory(slug: string): NewsArticle[] {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return [];

  const matching = newsArticles.filter(
    (a) => a.category.toLowerCase() === cat.label.toLowerCase(),
  );

  // If fewer than 6 match, supplement with random articles from other categories
  if (matching.length < 6) {
    const supplement = newsArticles
      .filter((a) => a.category.toLowerCase() !== cat.label.toLowerCase())
      .slice(0, 6 - matching.length);
    return [...matching, ...supplement];
  }

  return matching;
}

export function CategoryPageLayout({
  categorySlug,
  categoryLabel,
  description,
  accentColor = "var(--brand-red)",
  featured = false,
}: CategoryPageLayoutProps) {
  const navigate = useNavigate();

  // Get current page from URL search params
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const currentPage = Math.max(1, Number(urlParams.get("page") ?? 1));

  const allArticles = useMemo(() => getArticlesForCategory(categorySlug), [categorySlug]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(allArticles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const pageArticles = allArticles.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // First article = featured large card, rest = grid
  const featuredArticle = pageArticles[0];
  const gridArticles = pageArticles.slice(1);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    void navigate({ to: url.pathname, search: { page } });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
      {/* Champions League featured hero banner */}
      {featured && (
        <div
          className="relative w-full rounded-card overflow-hidden mb-6"
          style={{ background: "linear-gradient(135deg, #001D5B 0%, #00287A 50%, #001544 100%)" }}
        >
          {/* CSS star pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-15" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-white"
                style={{
                  fontSize: `${14 + (i % 3) * 8}px`,
                  left: `${(i * 8.3) % 100}%`,
                  top: `${(i * 17 + 10) % 80}%`,
                  transform: `rotate(${i * 30}deg)`,
                }}
              >
                ★
              </div>
            ))}
          </div>
          <div className="relative py-10 px-8 text-center">
            <h2 className="font-serif font-bold text-white text-3xl md:text-4xl tracking-tight">
              Çempionlar Liqası
            </h2>
            <p className="text-white/70 text-sm mt-2">Ən güclülər üçün arena</p>
          </div>
        </div>
      )}

      {/* Category Header Banner */}
      <div
        className="bg-surface-off rounded-card mb-6"
        style={{ borderLeft: `4px solid ${accentColor}` }}
      >
        <div className="py-6 px-5 flex items-center gap-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Trophy size={20} style={{ color: accentColor }} aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{categoryLabel}</h1>
            {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
        {/* LEFT — content */}
        <div className="min-w-0 flex flex-col gap-6">
          <AdBanner variant="horizontal" />

          {/* Featured Article (large card) */}
          {featuredArticle && (
            <Link
              to="/article/$slug"
              params={{ slug: featuredArticle.slug }}
              className="group block rounded-card overflow-hidden bg-surface-white shadow-card hover:shadow-card-hover transition-all duration-200 border border-surface-border/50"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-[40%] h-[200px] sm:h-auto overflow-hidden">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="sm:w-[60%] p-5 flex flex-col justify-center">
                  <Badge label={featuredArticle.category} variant="red" size="md" />
                  <h2 className="mt-2 mb-2 text-xl font-bold text-text-primary group-hover:text-brand-red transition-colors line-clamp-2">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-card-sm text-text-muted line-clamp-2 mb-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-meta text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} aria-hidden />
                      {featuredArticle.date}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} aria-hidden />
                      {featuredArticle.views}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red group-hover:gap-2.5 transition-all">
                    Oxu <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* News Grid */}
          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gridArticles.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => safePage > 1 && handlePageChange(safePage - 1)}
                      className={clsx(
                        "cursor-pointer select-none",
                        safePage <= 1 && "pointer-events-none opacity-40",
                      )}
                      aria-label="Əvvəlki səhifə"
                    >
                      Əvvəlki
                    </PaginationPrevious>
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === safePage}
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer select-none"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => safePage < totalPages && handlePageChange(safePage + 1)}
                      className={clsx(
                        "cursor-pointer select-none",
                        safePage >= totalPages && "pointer-events-none opacity-40",
                      )}
                      aria-label="Növbəti səhifə"
                    >
                      Növbəti
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <span className="text-meta text-text-muted">
                Səhifə {safePage} / {totalPages}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT — sticky sidebar */}
        <aside
          className="hidden lg:block sticky"
          style={{ top: SIDEBAR_TOP_OFFSET_PX, alignSelf: "start" }}
          aria-label="Yan panel"
        >
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
