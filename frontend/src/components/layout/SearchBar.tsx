import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Article } from "@/types/api";

interface Props {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

interface PreviewResult {
  id: number;
  slug: string;
  title: string;
  image: string;
  categoryLabel: string;
}

const DEBOUNCE_MS = 300;

export function SearchBar({ variant = "desktop", onNavigate }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<PreviewResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced live search
  const fetchPreview = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await api.get<{ data: Article[] } | Article[]>("/articles", {
        params: { search: term.trim(), limit: 6 },
      });
      const raw = Array.isArray(res.data) ? res.data : res.data.data;
      setResults(
        raw.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          image: a.image,
          categoryLabel: a.category?.label ?? "",
        })),
      );
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => fetchPreview(q), DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchPreview]);

  const showDropdown = isFocused && query.trim().length > 0;

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    setIsFocused(false);
    onNavigate?.();
    navigate({ to: "/axtaris", search: { q } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div
      ref={containerRef}
      className={variant === "mobile" ? "relative w-full" : "relative w-full max-w-[280px]"}
    >
      <div className="relative">
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Axtar"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-red transition-colors"
        >
          <Search size={16} aria-hidden />
        </button>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
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
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-text-muted">
              <Loader2 size={16} className="animate-spin" />
              Axtarılır...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-muted">
              "{query}" üzrə nəticə tapılmadı
            </div>
          ) : (
            <>
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
                          {a.categoryLabel}
                        </div>
                        <div className="text-sm text-text-primary line-clamp-2 leading-snug">
                          {a.title}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleSearch}
                className="w-full px-4 py-2.5 text-sm font-medium text-brand-red bg-surface-light/60 hover:bg-surface-light transition-colors border-t border-surface-border text-center"
              >
                Bütün nəticələrə bax →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
