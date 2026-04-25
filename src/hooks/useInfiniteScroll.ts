import { useCallback, useEffect, useRef, useState } from "react";
import { INFINITE_SCROLL_DELAY_MS, ITEMS_PER_PAGE } from "@/config/constants";
import type { NewsArticle } from "@/data/mockData";

export function useInfiniteScroll(initialItems: NewsArticle[], pool: NewsArticle[]) {
  const [items, setItems] = useState<NewsArticle[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, INFINITE_SCROLL_DELAY_MS));

    setItems((prev) => {
      const next: NewsArticle[] = [];
      for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        const src = pool[(prev.length + i) % pool.length];
        next.push({ ...src, id: prev.length + i + 1000, isFeatured: false });
      }
      return [...prev, ...next];
    });

    setIsLoading(false);
    loadingRef.current = false;
  }, [pool]);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, isLoading, triggerRef };
}
