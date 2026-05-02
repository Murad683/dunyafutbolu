import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Eye, ArrowRight, Trophy } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui-news/Badge";
import { NewsCard } from "@/components/homepage/NewsCard";
import { AdBanner } from "@/components/homepage/AdBanner";
import { Sidebar } from "@/components/homepage/sidebar/Sidebar";
import { api } from "@/lib/api";
import { toNewsArticle } from "@/lib/mappers";
import type { Article, Category, PaginatedResponse } from "@/types/api";
import { SIDEBAR_TOP_OFFSET_PX } from "@/config/constants";

export const Route = createFileRoute("/kateqoriya/$slug")({
  loader: async ({ params }) => {
    try {
      const catsRes = await api.get<Category[]>("/categories");
      const category = catsRes.data.find(c => c.slug === params.slug);
      if (!category) throw notFound();

      const res = await api.get<{ data: Article[] } | Article[]>("/articles", {
        params: { categorySlug: params.slug, limit: 100 }
      });

      const rawArticles = Array.isArray(res.data) ? res.data : res.data.data;

      // Sort by original createdAt
      const sortedRaw = [...rawArticles].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const articles = sortedRaw.map(toNewsArticle);

      let heroIdx = articles.findIndex(a => a.isFeatured);
      if (heroIdx === -1 && articles.length > 0) heroIdx = 0;

      const hero = heroIdx !== -1 ? articles[heroIdx] : null;
      const grid = articles.filter((_, idx) => idx !== heroIdx);

      return { category, hero, grid };
    } catch (err: any) {
      if (err.response?.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.category ? `${loaderData.category.label} | Dünya Futbolu` : "Kateqoriya | Dünya Futbolu";
    return {
      meta: [
        { title },
        { name: "description", content: `${loaderData?.category?.label} xəbərləri.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, hero, grid } = Route.useLoaderData();
  const accentColor = "var(--brand-red)";

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
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
              <h1 className="text-2xl font-bold text-text-primary">{category.label}</h1>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* LEFT — content */}
          <div className="min-w-0 flex flex-col gap-6">
            <AdBanner variant="horizontal" />

            {/* Featured Article (Hero) */}
            {hero ? (
              <Link
                to="/article/$slug"
                params={{ slug: hero.slug }}
                className="group block rounded-card overflow-hidden bg-surface-white shadow-card hover:shadow-card-hover transition-all duration-200 border border-surface-border/50"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-[40%] h-[200px] sm:h-auto overflow-hidden">
                    <img
                      src={hero.image}
                      alt={hero.title}
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="sm:w-[60%] p-5 flex flex-col justify-center items-start">
                    <Badge label={hero.category} variant="red" size="md" />
                    <h2 className="mt-2 mb-2 text-xl font-bold text-text-primary group-hover:text-brand-red transition-colors line-clamp-2">
                      {hero.title}
                    </h2>
                    <p className="text-card-sm text-text-muted line-clamp-2 mb-3">
                      {hero.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-meta text-text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} aria-hidden />
                        {hero.date}
                      </span>
                      <span aria-hidden>·</span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} aria-hidden />
                        {hero.views}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red group-hover:gap-2.5 transition-all">
                      Oxu <ArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="py-10 text-center text-gray-500">
                Bu kateqoriyada hələlik xəbər yoxdur.
              </div>
            )}

            {/* News Grid */}
            {grid.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grid.map((a: any) => (
                  <NewsCard key={a.id} article={a} />
                ))}
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
    </Layout>
  );
}
