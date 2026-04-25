import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Newspaper, Search } from "lucide-react";
import { clsx } from "clsx";
import { Layout } from "@/components/layout/Layout";
import { newsArticles } from "@/data/mockData";
import { NewsCard } from "@/components/homepage/NewsCard";
import { Sidebar } from "@/components/homepage/sidebar/Sidebar";
import { AdBanner } from "@/components/homepage/AdBanner";
import { SIDEBAR_TOP_OFFSET_PX } from "@/config/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/xeberler/")({
  head: () => ({
    meta: [
      { title: "Bütün Xəbərlər | Dünya Futbolu" },
      { name: "description", content: "Azərbaycan və dünya futbolunun ən son xəbərləri — hamısı bir yerdə." },
    ],
  }),
  component: XeberlerPage,
});

const PER_PAGE = 12;

function XeberlerPage() {
  const [cat, setCat] = useState("Hamısı");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Unique categories from articles
  const uniqueCats = useMemo(() => {
    const set = new Set(newsArticles.map((a) => a.category));
    return ["Hamısı", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    let list = newsArticles;
    if (cat !== "Hamısı") list = list.filter((a) => a.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q));
    }
    return list;
  }, [cat, search]);

  // Reset page on filter change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleCat = (c: string) => {
    setCat(c);
    setPage(1);
  };

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-card mb-6 overflow-hidden">
          <div className="py-8 px-6 md:px-10 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 shrink-0">
              <Newspaper size={24} className="text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Bütün Xəbərlər</h1>
              <p className="text-white/60 text-sm mt-0.5">{newsArticles.length} xəbər mövcuddur</p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Xəbər axtar..."
              className="w-full h-10 pl-9 pr-4 rounded-input border border-surface-border bg-surface-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueCats.map((c) => (
              <button key={c} onClick={() => handleCat(c)} className={clsx("px-3.5 py-1.5 rounded-pill text-xs font-medium transition-colors", cat === c ? "bg-brand-red text-white shadow-sm" : "bg-surface-light text-text-secondary hover:bg-surface-border")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          <div className="min-w-0 flex flex-col gap-6">
            <AdBanner variant="horizontal" />

            {/* Results info */}
            <p className="text-sm text-text-muted">
              {filtered.length} nəticə tapıldı{cat !== "Hamısı" ? ` — ${cat}` : ""}
            </p>

            {paged.length === 0 ? (
              <div className="py-16 text-center text-text-muted">Axtarışa uyğun xəbər tapılmadı.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paged.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => safePage > 1 && setPage(safePage - 1)} className={clsx("cursor-pointer select-none", safePage <= 1 && "pointer-events-none opacity-40")} aria-label="Əvvəlki səhifə">Əvvəlki</PaginationPrevious>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink isActive={p === safePage} onClick={() => setPage(p)} className="cursor-pointer select-none">{p}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext onClick={() => safePage < totalPages && setPage(safePage + 1)} className={clsx("cursor-pointer select-none", safePage >= totalPages && "pointer-events-none opacity-40")} aria-label="Növbəti səhifə">Növbəti</PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <span className="text-meta text-text-muted">Səhifə {safePage} / {totalPages}</span>
              </div>
            )}
          </div>

          <aside className="hidden lg:block sticky" style={{ top: SIDEBAR_TOP_OFFSET_PX, alignSelf: "start" }} aria-label="Yan panel">
            <Sidebar />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
