import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Play, Eye, Calendar, Film } from "lucide-react";
import { clsx } from "clsx";
import { Layout } from "@/components/layout/Layout";
import { MOCK_VIDEOS } from "@/data/mockData";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Videolar | Dünya Futbolu" },
      { name: "description", content: "Futbol dünyasının ən yaxşı qol topluları, təhlilləri və müsahibələri." },
    ],
  }),
  component: VideoPage,
});

const CATS = ["Hamısı", "Qollar", "Analiz", "Mülakat", "Reklamlar"];

function VideoPage() {
  const [cat, setCat] = useState("Hamısı");
  const [active, setActive] = useState<string | null>(null);

  const list = useMemo(() => (cat === "Hamısı" ? MOCK_VIDEOS : MOCK_VIDEOS.filter((v) => v.category === cat)), [cat]);

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] rounded-card mb-6 overflow-hidden">
          <div className="py-8 px-6 md:px-10 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 shrink-0">
              <Film size={24} className="text-red-400" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Video Qalereyası</h1>
              <p className="text-white/50 text-sm mt-0.5">Qollar, təhlillər, müsahibələr — hamısı bir yerdə</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={clsx("px-4 py-2 rounded-pill text-sm font-medium transition-colors", cat === c ? "bg-brand-red text-white shadow-sm" : "bg-surface-light text-text-secondary hover:bg-surface-border")}>
              {c}
            </button>
          ))}
        </div>

        {active && (
          <div className="mb-8">
            <div className="relative w-full aspect-video rounded-card overflow-hidden shadow-card-hover bg-black">
              <iframe src={`https://www.youtube.com/embed/${active}?autoplay=1&rel=0`} title="Video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">{MOCK_VIDEOS.find((v) => v.youtubeId === active)?.title}</h2>
              <button onClick={() => setActive(null)} className="text-sm text-text-muted hover:text-brand-red transition-colors">Bağla ✕</button>
            </div>
          </div>
        )}

        {list.length === 0 ? (
          <div className="py-16 text-center text-text-muted">Bu kateqoriyada video tapılmadı.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((v) => (
              <button key={v.id} onClick={() => setActive(v.youtubeId)} className={clsx("group text-left rounded-card overflow-hidden bg-surface-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-surface-border/50", active === v.youtubeId && "ring-2 ring-brand-red")}>
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={20} className="text-white ml-0.5" fill="white" aria-hidden />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-badge bg-black/70 text-[0.6rem] font-bold uppercase tracking-wider text-white">{v.category}</span>
                </div>
                <div className="p-3">
                  <h3 className="text-card-md text-text-primary group-hover:text-brand-red transition-colors line-clamp-2 mb-2">{v.title}</h3>
                  <div className="flex items-center gap-3 text-meta text-text-muted">
                    <span className="flex items-center gap-1"><Calendar size={11} aria-hidden />{v.date}</span>
                    <span aria-hidden>·</span>
                    <span className="flex items-center gap-1"><Eye size={11} aria-hidden />{v.views}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
