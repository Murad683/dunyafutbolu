import { Skeleton } from "@/components/ui-news/Skeleton";
import { clsx } from "clsx";

interface Props {
  featured?: boolean;
}

export function NewsCardSkeleton({ featured = false }: Props) {
  return (
    <div className="rounded-card overflow-hidden bg-surface-white border border-surface-border/50 shadow-card">
      <Skeleton className={clsx("w-full", featured ? "h-[200px]" : "h-[140px]")} />
      <div className={featured ? "p-4" : "p-3"}>
        <Skeleton className="w-16 h-4 mb-2 rounded-full" />
        <Skeleton className="w-full h-5 mb-2" />
        <Skeleton className="w-3/4 h-5 mb-4" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-3" />
          <Skeleton className="w-12 h-3" />
        </div>
      </div>
    </div>
  );
}
