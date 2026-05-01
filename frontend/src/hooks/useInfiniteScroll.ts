import { useCallback, useEffect, useRef, useState } from "react";
import { ITEMS_PER_PAGE } from "@/config/constants";
import { newsArticles as mockPool } from "@/data/mockData";
import type { NewsArticle } from "@/data/mockData";
import { api } from "@/lib/api";
import { toNewsArticle } from "@/lib/mappers";
import type { Article, PaginatedResponse } from "@/types/api";

export function useInfiniteScroll(initialItems: NewsArticle[], _pool: NewsArticle[]) {
  const [items, setItems] = useState<NewsArticle[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const usingApiRef = useRef(true);

  // Initial load from API — replace mock data if successful
  useEffect(() => {
    let cancelled = false;
    api
      .get<PaginatedResponse<Article>>("/articles", {
        params: { page: 1, limit: ITEMS_PER_PAGE },
      })
      .then((res) => {
        if (!cancelled && res.data.data.length > 0) {
          setItems(res.data.data.map(toNewsArticle));
          setHasMore(res.data.meta.page < res.data.meta.last_page);
          pageRef.current = 1;
        }
      })
      .catch(() => {
        console.warn("[useInfiniteScroll] API unavailable, using mock data");
        usingApiRef.current = false;
      });
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    const nextPage = pageRef.current + 1;

    if (usingApiRef.current) {
      try {
        const res = await api.get<PaginatedResponse<Article>>("/articles", {
          params: { page: nextPage, limit: ITEMS_PER_PAGE },
        });
        const newItems = res.data.data.map(toNewsArticle);
        setItems((prev) => [...prev, ...newItems]);
        setHasMore(res.data.meta.page < res.data.meta.last_page);
        pageRef.current = nextPage;
      } catch {
        console.warn("[useInfiniteScroll] Load more failed, falling back to mock");
        usingApiRef.current = false;
        // Fall through to mock logic below
        appendMock();
      }
    } else {
      appendMock();
    }

    setIsLoading(false);
    loadingRef.current = false;
  }, [hasMore]);

  // Fallback: append mock articles when API is unavailable
  function appendMock() {
    setItems((prev) => {
      const next: NewsArticle[] = [];
      for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        const src = mockPool[(prev.length + i) % mockPool.length];
        next.push({ ...src, id: prev.length + i + 1000, isFeatured: false });
      }
      return [...prev, ...next];
    });
  }

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

  return { items, isLoading, hasMore, triggerRef };
}

