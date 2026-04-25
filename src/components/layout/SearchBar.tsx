import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { newsArticles } from "@/data/mockData";

interface Props {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function SearchBar({ variant = "desktop", onNavigate }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return newsArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={variant === "mobile" ? "relative w-full" : "relative w-full max-w-[280px]"}
    >
      <div className="relative">
        <Search
          size={16}
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Xəbər axtar..."
          aria-label="Xəbər axtar"
          className="w-full h-10 pl-9 pr-9 rounded-pill border border-surface-border bg-surface-off text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red focus:bg-surface-white transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Təmizlə"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-brand-red"
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-surface-white border border-surface-border rounded-card shadow-dropdown overflow-hidden animate-slide-down">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-muted">
              "{query}" üzrə nəticə tapılmadı
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-1">
              {results.map((a) => (
                <li key={a.id}>
                  <Link
                    to="/article/$slug"
                    params={{ slug: a.slug }}
                    onClick={() => {
                      setQuery("");
                      setIsFocused(false);
                      onNavigate?.();
                    }}
                    className="flex gap-3 px-3 py-2.5 hover:bg-surface-light transition-colors"
                  >
                    <img
                      src={a.image}
                      alt=""
                      className="w-14 h-14 object-cover rounded-md shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.65rem] uppercase tracking-wider font-bold text-brand-red mb-0.5">
                        {a.category}
                      </div>
                      <div className="text-sm text-text-primary line-clamp-2 leading-snug">
                        {a.title}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
