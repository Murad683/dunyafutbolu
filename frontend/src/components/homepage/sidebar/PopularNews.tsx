import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { SectionHeader } from "@/components/ui-news/SectionHeader";
import { popularNews as mockPopular } from "@/data/mockData";
import type { PopularNewsItem as PopularItem } from "@/data/mockData";
import { api } from "@/lib/api";
import { toPopularNewsItem } from "@/lib/mappers";
import type { Article, PaginatedResponse } from "@/types/api";
import { PopularNewsItem } from "./PopularNewsItem";

export function PopularNews() {
  const [items, setItems] = useState<PopularItem[]>(mockPopular);

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
      .catch(() => {
        console.warn("[PopularNews] API unavailable, using mock data");
      });
    return () => { cancelled = true; };
  }, []);

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

