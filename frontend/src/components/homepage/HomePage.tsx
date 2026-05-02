import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SIDEBAR_TOP_OFFSET_PX } from "@/config/constants";
import { AdBanner } from "./AdBanner";
import { HeroCarousel } from "./HeroCarousel";
import { NewsGrid } from "./NewsGrid";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";
import { CategoryFilters } from "./CategoryFilters";
import { Sidebar } from "./sidebar/Sidebar";

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { items, isLoading, hasMore, triggerRef } = useInfiniteScroll();

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
        {/* LEFT — content */}
        <div className="min-w-0 flex flex-col gap-6">
          <AdBanner variant="horizontal" />
          <HeroCarousel />
          <CategoryFilters active={activeCategory} onChange={setActiveCategory} />
          <NewsGrid articles={items} categoryFilter={activeCategory} />
          {!activeCategory && hasMore && (
            <InfiniteScrollTrigger triggerRef={triggerRef} isLoading={isLoading} />
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
