import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/homepage/NewsCard";
import { api } from "@/lib/api";
import { toNewsArticle } from "@/lib/mappers";
import type { Article } from "@/types/api";

interface SearchParams {
  q?: string;
}

export const Route = createFileRoute("/axtaris")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: (search.q as string) || "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    const query = deps.q?.trim() || "";
    if (!query) return { query: "", articles: [] };

    try {
      const res = await api.get<{ data: Article[] } | Article[]>("/articles", {
        params: { search: query, limit: 50 },
      });
      const raw = Array.isArray(res.data) ? res.data : res.data.data;
      return { query, articles: raw.map(toNewsArticle) };
    } catch {
      return { query, articles: [] };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.query ? `"${loaderData.query}" axtarış — Dünya Futbolu` : "Axtarış — Dünya Futbolu" },
      { name: "description", content: "Dünya Futbolu portalında xəbər axtarışı." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { query, articles } = Route.useLoaderData();

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        <Link
          to="/"
          className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-brand-red transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Ana səhifə
        </Link>

        {/* Search header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-full shrink-0"
            style={{ backgroundColor: "var(--brand-red)", opacity: 0.1 }}
          />
          <Search
            size={22}
            className="absolute ml-[13px] text-brand-red"
            aria-hidden
          />
          <div>
            {query ? (
              <>
                <h1 className="text-2xl font-bold text-text-primary">
                  Axtarış nəticələri
                </h1>
                <p className="text-sm text-text-muted mt-0.5">
                  "<span className="font-semibold text-text-primary">{query}</span>" üçün{" "}
                  <span className="font-semibold text-brand-red">{articles.length}</span> nəticə tapıldı
                </p>
              </>
            ) : (
              <h1 className="text-2xl font-bold text-text-primary">
                Axtarış
              </h1>
            )}
          </div>
        </div>

        {/* Results */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {articles.map((a: any) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        ) : query ? (
          <div className="py-20 text-center">
            <Search size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Heç bir xəbər tapılmadı
            </h2>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              "<span className="font-medium">{query}</span>" açar sözünə uyğun nəticə yoxdur.
              Fərqli açar sözlə yenidən cəhd edin.
            </p>
          </div>
        ) : (
          <div className="py-20 text-center">
            <Search size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Xəbər axtarın
            </h2>
            <p className="text-sm text-text-muted">
              Yuxarıdakı axtarış çubuğundan istifadə edin.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
