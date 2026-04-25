import { memo } from "react";
import { Calendar, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { Badge } from "@/components/ui-news/Badge";
import type { NewsArticle } from "@/data/mockData";

interface Props {
  article: NewsArticle;
  featured?: boolean;
}

function NewsCardImpl({ article, featured = false }: Props) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="block group rounded-card overflow-hidden bg-surface-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-surface-border/50"
    >
      <article>
        <div className={clsx("overflow-hidden", featured ? "h-[200px]" : "h-[140px]")}>
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className={featured ? "p-4" : "p-3"}>
          <Badge label={article.category} variant="red" size={featured ? "md" : "sm"} />
          <h3
            className={clsx(
              "mt-2 mb-3 text-text-primary group-hover:text-brand-red transition-colors",
              featured ? "text-card-xl line-clamp-2" : "text-card-md line-clamp-3 mb-2",
            )}
          >
            {article.title}
          </h3>
          <div className="flex items-center gap-2.5 text-meta text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={featured ? 12 : 11} aria-hidden />
              {article.date}
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Eye size={featured ? 12 : 11} aria-hidden />
              {article.views}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export const NewsCard = memo(NewsCardImpl);
