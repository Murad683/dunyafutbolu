import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { clsx } from "clsx";
import { api, getImageUrl } from "@/lib/api";
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
    
    Promise.all([
      api.get<Banner[]>("/banners"),
      api.get<Record<string, string>>("/settings")
    ]).then(([bannersRes, settingsRes]) => {
      if (cancelled) return;
      
      const activeBanners = bannersRes.data.filter(b => b.isActive && b.placement === placement);
      const isRotationEnabled = settingsRes.data?.ad_rotation === 'true';

      if (activeBanners.length > 0) {
        if (isRotationEnabled) {
          // Random selection
          const randomIndex = Math.floor(Math.random() * activeBanners.length);
          setBanner(activeBanners[randomIndex]);
        } else {
          // Latest selection (highest ID)
          const latest = [...activeBanners].sort((a, b) => b.id - a.id)[0];
          setBanner(latest);
        }
      }
    }).catch(err => console.error("Failed to fetch banners or settings", err));

    return () => { cancelled = true; };
  }, [placement]);

  if (banner) {
    return (
      <a
        href={banner.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx("block w-full overflow-hidden rounded-card shadow-sm", isSky ? "h-[350px]" : "h-auto sm:h-[90px]")}
        title={banner.title}
      >
        <img src={getImageUrl(banner.imageUrl)} alt={banner.title} className={clsx("w-full block", isSky ? "h-full object-cover" : "h-auto")} />
      </a>
    );
  }

  return (
    <div
      className={clsx(
        "w-full bg-surface-light border-2 border-dashed border-surface-border rounded-card flex flex-col items-center justify-center gap-2",
        isSky ? "h-[350px]" : "h-auto py-4 sm:h-[90px]",
      )}
      aria-label="Reklam yeri"
    >
      <Megaphone size={isSky ? 28 : 20} className="text-text-muted" aria-hidden />
      <span className="text-text-muted text-sm font-medium">Reklam Banneri</span>
      <span className="text-xs text-text-muted opacity-60">{isSky ? "300 × 350" : "728 × 90"}</span>
    </div>
  );
}
