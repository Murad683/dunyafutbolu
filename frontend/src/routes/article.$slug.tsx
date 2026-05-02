import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, Eye, ArrowLeft, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui-news/Badge";
import { SectionHeader } from "@/components/ui-news/SectionHeader";
import { NewsCard } from "@/components/homepage/NewsCard";
import { api, getImageUrl } from "@/lib/api";
import { toNewsArticle } from "@/lib/mappers";
import type { Article, PaginatedResponse } from "@/types/api";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await api.get<Article>(`/articles/${params.slug}`);
      if (!res.data) throw notFound();
      
      const article = toNewsArticle(res.data);
      
      let relatedArticles: ReturnType<typeof toNewsArticle>[] = [];
      try {
        const relatedRes = await api.get<PaginatedResponse<Article>>('/articles', {
          params: { categorySlug: res.data.category.slug, limit: 4 }
        });
        relatedArticles = relatedRes.data.data.filter(a => a.id !== res.data.id).slice(0, 4).map(toNewsArticle);
        
        if (relatedArticles.length === 0) {
           const fallbackRes = await api.get<PaginatedResponse<Article>>('/articles', { params: { limit: 5 } });
           relatedArticles = fallbackRes.data.data.filter(a => a.id !== res.data.id).slice(0, 4).map(toNewsArticle);
        }
      } catch (err) {
        console.error("Failed to load related articles", err);
      }

      return { article, related: relatedArticles };
    } catch (err: any) {
      if (err.response?.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    const title = a ? `${a.title} — Dünya Futbolu` : "Məqalə — Dünya Futbolu";
    const description = a?.excerpt ?? "Futbol xəbəri Dünya Futbolu portalında.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(a?.image ? [{ property: "og:image", content: a.image }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <h1 className="text-hero text-text-primary mb-4">Məqalə tapılmadı</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-brand-red hover:underline"
        >
          <ArrowLeft size={16} /> Ana səhifəyə qayıt
        </Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <h1 className="text-hero text-text-primary mb-4">Xəta baş verdi</h1>
        <p className="text-text-secondary">{error.message}</p>
      </div>
    </Layout>
  ),
  component: ArticlePage,
});

/* ── Social Share Buttons ─────────────────────────────────────────────── */

function SocialShareButtons({ title, url }: { title: string; url: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const channels = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      color: "#25D366",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
      color: "#26A5E4",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      color: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-text-secondary mr-1">Paylaş:</span>
      {channels.map((ch) => (
        <a
          key={ch.name}
          href={ch.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`${ch.name}-da paylaş`}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-surface-border hover:border-transparent transition-all duration-200 group"
          style={{ ["--share-color" as string]: ch.color }}
        >
          <span className="text-text-muted group-hover:text-[var(--share-color)] transition-colors">
            {ch.icon}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ── Instagram Post Embed Block ───────────────────────────────────────── */

function InstagramPostEmbed() {
  return (
    <div className="my-10 bg-surface-white rounded-card border border-surface-border/50 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border/50">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
          <div className="w-[31px] h-[31px] rounded-full bg-surface-white flex items-center justify-center">
            <span className="text-xs font-bold bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] bg-clip-text text-transparent">DF</span>
          </div>
        </div>
        <div>
          <a href="https://www.instagram.com/dunyafutbolu.az/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-text-primary hover:underline">dunyafutbolu.az</a>
          <p className="text-[0.65rem] text-text-muted">Rəsmi Instagram hesabı</p>
        </div>
        <a href="https://www.instagram.com/dunyafutbolu.az/" target="_blank" rel="noopener noreferrer" className="ml-auto px-4 py-1.5 rounded-pill bg-[#0095F6] text-white text-xs font-semibold hover:bg-[#0081D6] transition-colors">
          İzlə
        </a>
      </div>

      {/* Image area */}
      <div className="w-full py-24 sm:py-32 bg-gradient-to-br from-surface-light via-surface-off to-surface-light flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] mx-auto mb-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
          <p className="text-text-secondary text-sm font-medium">Bizi Instagram-da izləyin!</p>
          <a href="https://www.instagram.com/dunyafutbolu.az/" target="_blank" rel="noopener noreferrer" className="text-text-muted text-xs mt-1 hover:underline">@dunyafutbolu.az</a>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-surface-border/50">
        <div className="flex items-center gap-4 mb-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-text-primary hover:text-red-500 cursor-pointer transition-colors"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
          <MessageCircle size={20} className="text-text-primary cursor-pointer" aria-hidden />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-text-primary cursor-pointer"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </div>
        <p className="text-sm text-text-primary"><span className="font-semibold">2,847</span> bəyənmə</p>
        <p className="text-sm text-text-primary mt-1"><a href="https://www.instagram.com/dunyafutbolu.az/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">dunyafutbolu.az</a> Futbol həyəcanını bizimlə yaşayın! ⚽🔥 #DünyaFutbolu #Azərbaycan</p>
        <p className="text-[0.65rem] text-text-muted mt-2 uppercase tracking-wider">2 saat əvvəl</p>
      </div>
    </div>
  );
}

/* ── Article Page ──────────────────────────────────────────────────────── */

function ArticlePage() {
  const { article, related } = Route.useLoaderData();
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Layout>
      <article className="max-w-[860px] mx-auto px-4 lg:px-6 pt-6 pb-16">
        <Link
          to="/"
          className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-brand-red transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Ana səhifə
        </Link>

        <Badge label={article.category} variant="red" size="md" />
        <h1 className="mt-4 mb-5 text-[2.25rem] sm:text-[2.75rem] leading-[1.15] font-bold tracking-tight text-text-primary">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-meta text-text-muted mb-6 pb-6 border-b border-surface-divider">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} aria-hidden /> {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} aria-hidden /> {article.readTime} oxu
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={13} aria-hidden /> {article.views} baxış
          </span>
          <div className="ml-auto">
            <SocialShareButtons title={article.title} url={pageUrl} />
          </div>
        </div>

        <div className="rounded-card overflow-hidden mb-8 shadow-card">
          <img
            src={getImageUrl(article.image)}
            alt={article.title}
            className="w-full h-auto object-cover max-h-[460px]"
          />
        </div>

        <p className="text-[1.125rem] leading-relaxed text-text-secondary font-medium mb-6">
          {article.excerpt}
        </p>

        <div className="space-y-5 text-[1rem] leading-[1.75] text-text-primary">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Instagram Post Embed */}
        <InstagramPostEmbed />

        {/* Bottom share bar */}
        <div className="flex items-center justify-between py-5 px-4 bg-surface-off rounded-card mb-10">
          <span className="text-sm text-text-secondary font-medium">Bu xəbəri paylaş:</span>
          <SocialShareButtons title={article.title} url={pageUrl} />
        </div>

        <section className="mt-14 pt-10 border-t border-surface-divider">
          <SectionHeader title="Əlaqəli xəbərlər" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((a: any) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
}
