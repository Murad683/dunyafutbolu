import type { RefObject } from "react";
import { LoadingSpinner } from "@/components/ui-news/LoadingSpinner";

interface Props {
  triggerRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
}

export function InfiniteScrollTrigger({ triggerRef, isLoading }: Props) {
  return (
    <div ref={triggerRef} className="mt-8 pt-6 border-t border-surface-divider">
      <div className="flex items-center justify-center gap-3 py-6 text-text-muted text-sm">
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Daha çox xəbər yüklənir...</span>
          </>
        ) : (
          <span>Aşağı sürüşdürərək daha çox xəbər yükləyin</span>
        )}
      </div>
    </div>
  );
}
