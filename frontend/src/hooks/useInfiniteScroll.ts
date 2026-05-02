import { useCallback, useEffect, useRef, useState } from "react";
import { ITEMS_PER_PAGE } from "@/config/constants";
import { api } from "@/lib/api";
import { toNewsArticle } from "@/lib/mappers";
import type { Article, PaginatedResponse } from "@/types/api";
import type { NewsArticle } from "@/types/news";

export function useInfiniteScroll() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  // Initial load from API
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .get<PaginatedResponse<Article>>("/articles", {
        params: { page: 1, limit: ITEMS_PER_PAGE },
      })
      .then((res) => {
        if (!cancelled) {
          setItems(res.data.data.map(toNewsArticle));
          setHasMore(res.data.meta.page < res.data.meta.last_page);
          pageRef.current = 1;
        }
      })
      .catch((err) => {
        console.error("[useInfiniteScroll] Failed to load initial articles", err);
        setHasMore(false);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    const nextPage = pageRef.current + 1;

    try {
      const res = await api.get<PaginatedResponse<Article>>("/articles", {
        params: { page: nextPage, limit: ITEMS_PER_PAGE },
      });
      const newItems = res.data.data.map(toNewsArticle);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(res.data.meta.page < res.data.meta.last_page);
      pageRef.current = nextPage;
    } catch (err) {
      console.error("[useInfiniteScroll] Load more failed", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore]);

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


