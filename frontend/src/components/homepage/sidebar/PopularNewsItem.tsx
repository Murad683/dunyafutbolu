import { memo } from "react";
import { Eye } from "lucide-react";
import { clsx } from "clsx";
import { Link } from "@tanstack/react-router";
import type { PopularNewsItem as Item } from "@/data/mockData";

function PopularNewsItemImpl({ item }: { item: Item }) {
  const rankColor =
    item.rank === 1
      ? "text-brand-gold"
      : item.rank <= 3
        ? "text-brand-red"
        : "text-text-muted";

  return (
    <Link
      to="/article/$slug"
      params={{ slug: item.slug }}
      className="group w-full flex items-start gap-3 text-left py-2 first:pt-0 last:pb-0"
    >
      <span
        className={clsx(
          "w-6 h-6 flex-shrink-0 flex items-center justify-center text-sm font-bold",
          rankColor,
        )}
        aria-hidden
      >
        {item.rank}
      </span>
      <div className="w-16 h-14 rounded-[6px] flex-shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-card-sm text-text-primary line-clamp-2 group-hover:text-brand-red transition-colors font-medium">
          {item.title}
        </h4>
        <p className="text-meta text-text-muted mt-1 flex items-center gap-1">
          <Eye size={11} aria-hidden />
          {item.views}
        </p>
      </div>
    </Link>
  );
}

export const PopularNewsItem = memo(PopularNewsItemImpl);
