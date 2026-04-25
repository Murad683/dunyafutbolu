import type { NewsArticle } from "@/data/mockData";
import { NewsCard } from "./NewsCard";

interface Props {
  articles: NewsArticle[];
  categoryFilter?: string | null;
}

export function NewsGrid({ articles, categoryFilter }: Props) {
  const filtered = categoryFilter
    ? articles.filter((a) => a.category === categoryFilter)
    : articles;

  // When filtering by category, skip "featured" treatment for simplicity
  const showFeatured = !categoryFilter;
  const featured = showFeatured ? filtered.filter((a) => a.isFeatured).slice(0, 2) : [];
  const featuredIds = new Set(featured.map((a) => a.id));
  const regular = filtered.filter((a) => !featuredIds.has(a.id));

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center text-text-muted">
        Bu kateqoriyada xəbər tapılmadı.
      </div>
    );
  }

  return (
    <div>
      {featured.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {featured.map((a) => (
            <NewsCard key={a.id} article={a} featured />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regular.map((a) => (
          <NewsCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
