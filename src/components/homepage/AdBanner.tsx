import { Megaphone } from "lucide-react";
import { clsx } from "clsx";

interface AdBannerProps {
  variant?: "horizontal" | "skyscraper";
}

export function AdBanner({ variant = "horizontal" }: AdBannerProps) {
  const isSky = variant === "skyscraper";
  return (
    <div
      className={clsx(
        "w-full bg-surface-light border-2 border-dashed border-surface-border rounded-card flex flex-col items-center justify-center gap-2",
        isSky ? "h-[400px]" : "h-[90px]",
      )}
      aria-label="Reklam yeri"
    >
      <Megaphone size={isSky ? 28 : 20} className="text-text-muted" aria-hidden />
      <span className="text-text-muted text-sm font-medium">Reklam Banneri</span>
      <span className="text-xs text-text-muted opacity-60">{isSky ? "300 × 400" : "728 × 90"}</span>
    </div>
  );
}
