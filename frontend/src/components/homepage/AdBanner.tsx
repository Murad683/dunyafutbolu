import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { clsx } from "clsx";
import { api } from "@/lib/api";
import type { Banner } from "@/types/api";

interface AdBannerProps {
  variant?: "horizontal" | "skyscraper";
}

export function AdBanner({ variant = "horizontal" }: AdBannerProps) {
  const isSky = variant === "skyscraper";
  const placement = isSky ? "SIDEBAR_300X350" : "TOP_728X90";
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.get<Banner[]>("/banners")
      .then(res => {
        if (!cancelled && res.data) {
          const activeBanner = res.data.find(b => b.isActive && b.placement === placement);
          if (activeBanner) setBanner(activeBanner);
        }
      })
      .catch(err => console.error("Failed to fetch banners", err));
    return () => { cancelled = true; };
  }, [placement]);

  if (banner) {
    return (
      <a
        href={banner.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx("block w-full overflow-hidden rounded-card", isSky ? "h-[350px]" : "h-[90px]")}
        title={banner.title}
      >
        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
      </a>
    );
  }

  return (
    <div
      className={clsx(
        "w-full bg-surface-light border-2 border-dashed border-surface-border rounded-card flex flex-col items-center justify-center gap-2",
        isSky ? "h-[350px]" : "h-[90px]",
      )}
      aria-label="Reklam yeri"
    >
      <Megaphone size={isSky ? 28 : 20} className="text-text-muted" aria-hidden />
      <span className="text-text-muted text-sm font-medium">Reklam Banneri</span>
      <span className="text-xs text-text-muted opacity-60">{isSky ? "300 × 350" : "728 × 90"}</span>
    </div>
  );
}
