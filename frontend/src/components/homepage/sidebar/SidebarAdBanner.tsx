import { Megaphone } from "lucide-react";

export function SidebarAdBanner() {
  return (
    <div className="w-full h-[350px] bg-surface-light border-2 border-dashed border-surface-border rounded-card flex flex-col items-center justify-center gap-2">
      <Megaphone size={28} className="text-text-muted" aria-hidden />
      <span className="text-text-muted text-sm font-medium">Reklam Banneri</span>
      <span className="text-xs text-text-muted opacity-60">300 × 350</span>
    </div>
  );
}
