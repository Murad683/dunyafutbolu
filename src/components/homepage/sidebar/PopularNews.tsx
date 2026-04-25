import { Flame } from "lucide-react";
import { SectionHeader } from "@/components/ui-news/SectionHeader";
import { popularNews } from "@/data/mockData";
import { PopularNewsItem } from "./PopularNewsItem";

export function PopularNews() {
  return (
    <div className="bg-surface-off border border-surface-border rounded-card p-4">
      <SectionHeader title="Populyar Xəbərlər" icon={Flame} />
      <ul className="divide-y divide-surface-divider">
        {popularNews.map((item) => (
          <li key={item.id}>
            <PopularNewsItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
