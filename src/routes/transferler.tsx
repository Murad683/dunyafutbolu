import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, RotateCcw, Calendar, Filter } from "lucide-react";
import { clsx } from "clsx";
import { Layout } from "@/components/layout/Layout";
import { MOCK_TRANSFERS } from "@/data/mockData";
import type { Transfer } from "@/data/mockData";
import { Sidebar } from "@/components/homepage/sidebar/Sidebar";
import { AdBanner } from "@/components/homepage/AdBanner";
import { SIDEBAR_TOP_OFFSET_PX } from "@/config/constants";

export const Route = createFileRoute("/transferler")({
  head: () => ({
    meta: [
      { title: "Transferlər | Dünya Futbolu" },
      {
        name: "description",
        content: "Futbol dünyasının ən son transfer xəbərləri, söhbətləri və rəsmi açıqlamaları.",
      },
    ],
  }),
  component: TransferlerPage,
});

const TYPE_FILTERS: { label: string; value: string }[] = [
  { label: "Hamısı", value: "all" },
  { label: "Giriş", value: "giriş" },
  { label: "Çıxış", value: "çıxış" },
  { label: "İcarə", value: "icarə" },
];

const LEAGUE_FILTERS = [
  "Hamısı",
  "Premyer Liqa",
  "İngiltərə Premyer Liqası",
  "İspaniya La Liqası",
  "İtaliya Seriya A",
  "Almaniya Bundesliqa",
];

function getTypeIcon(type: Transfer["type"]) {
  switch (type) {
    case "giriş":
      return <ArrowDownToLine size={14} className="text-green-600" aria-hidden />;
    case "çıxış":
      return <ArrowUpFromLine size={14} className="text-red-500" aria-hidden />;
    case "icarə":
      return <RotateCcw size={14} className="text-amber-500" aria-hidden />;
  }
}

function getTypeBadgeClass(type: Transfer["type"]) {
  switch (type) {
    case "giriş":
      return "bg-green-50 text-green-700 border-green-200";
    case "çıxış":
      return "bg-red-50 text-red-700 border-red-200";
    case "icarə":
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function TransferlerPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("Hamısı");

  const filtered = useMemo(() => {
    return MOCK_TRANSFERS.filter((t) => {
      const matchType = typeFilter === "all" || t.type === typeFilter;
      const matchLeague = leagueFilter === "Hamısı" || t.league === leagueFilter;
      return matchType && matchLeague;
    });
  }, [typeFilter, leagueFilter]);

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-card mb-6 overflow-hidden">
          <div className="py-8 px-6 md:px-10 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 shrink-0">
              <ArrowRightLeft size={24} className="text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Transferlər</h1>
              <p className="text-white/60 text-sm mt-0.5">
                Futbol dünyasının ən son transfer xəbərləri
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* LEFT — transfers */}
          <div className="min-w-0 flex flex-col gap-5">
            <AdBanner variant="horizontal" />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-muted" aria-hidden />
                <span className="text-sm font-medium text-text-secondary">Status:</span>
                <div className="flex gap-1">
                  {TYPE_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setTypeFilter(f.value)}
                      className={clsx(
                        "px-3 py-1.5 rounded-pill text-xs font-medium transition-colors",
                        typeFilter === f.value
                          ? "bg-brand-red text-white"
                          : "bg-surface-light text-text-secondary hover:bg-surface-border",
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="h-9 px-3 rounded-input border border-surface-border bg-surface-white text-sm text-text-primary focus:outline-none focus:border-brand-red transition-colors cursor-pointer"
                aria-label="Liqa filtri"
              >
                {LEAGUE_FILTERS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Transfer List */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-text-muted">
                Seçilmiş filtrə uyğun transfer tapılmadı.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((t) => (
                  <div
                    key={t.id}
                    className="bg-surface-white rounded-card border border-surface-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden"
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Player image */}
                      <img
                        src={t.image}
                        alt={t.playerName}
                        className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-surface-border"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-text-primary truncate">{t.playerName}</h3>
                          <span
                            className={clsx(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-[0.65rem] font-bold uppercase border shrink-0",
                              getTypeBadgeClass(t.type),
                            )}
                          >
                            {getTypeIcon(t.type)}
                            {t.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-1">
                          <span className="truncate">{t.fromClub}</span>
                          <ArrowRightLeft size={12} className="text-text-muted shrink-0" aria-hidden />
                          <span className="truncate font-medium text-text-primary">{t.toClub}</span>
                        </div>
                        <div className="flex items-center gap-3 text-meta text-text-muted">
                          <span className="font-semibold text-brand-red">{t.fee}</span>
                          <span aria-hidden>·</span>
                          <span>{t.league}</span>
                          <span aria-hidden>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} aria-hidden />
                            {t.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — sidebar */}
          <aside
            className="hidden lg:block sticky"
            style={{ top: SIDEBAR_TOP_OFFSET_PX, alignSelf: "start" }}
            aria-label="Yan panel"
          >
            <Sidebar />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
