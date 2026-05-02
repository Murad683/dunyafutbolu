import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { SectionHeader } from "@/components/ui-news/SectionHeader";
import { api } from "@/lib/api";
import { toPopularNewsItem } from "@/lib/mappers";
import type { Article, PaginatedResponse } from "@/types/api";
import { PopularNewsItem } from "./PopularNewsItem";

export interface PopularItem {
  id: number;
  rank: number;
  category: string;
  title: string;
  slug: string;
  image: string;
}


export function PopularNews() {
  const [items, setItems] = useState<PopularItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<PaginatedResponse<Article>>("/articles", { params: { limit: 100 } })
      .then((res) => {
        if (!cancelled && res.data.data.length > 0) {
          const top = [...res.data.data]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
            .map((a, i) => toPopularNewsItem(a, i + 1));
            
          setItems(top);
        }
      })
      .catch((err) => {
        console.error("[PopularNews] Failed to load popular news", err);
      });
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) return null;


  return (
    <div className="bg-surface-off border border-surface-border rounded-card p-4">
      <SectionHeader title="Populyar Xəbərlər" icon={Flame} />
      <ul className="divide-y divide-surface-divider">
        {items.map((item) => (
          <li key={item.id}>
            <PopularNewsItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

