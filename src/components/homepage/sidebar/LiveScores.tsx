import { Radio } from "lucide-react";
import { SectionHeader } from "@/components/ui-news/SectionHeader";

export function LiveScores() {
  return (
    <div className="bg-surface-off border border-surface-border rounded-card p-4">
      <div className="flex items-center justify-between mb-3">
        <SectionHeader title="Canlı Nəticələr" icon={Radio} />
      </div>

      <div className="bg-surface-white border border-surface-border rounded-[8px] overflow-hidden">
        <iframe
          src="https://www.scorebat.com/embed/livescore/?token=MzI3MDRfMTczNTY0NDIxOV8yMGY5YTVkZTViMWZlMDhkZTYzMjRhMTU1Yzk5ZTdlZTcwZTY2OGFm"
          style={{
            width: "100%",
            height: "380px",
            border: "none",
            overflow: "hidden",
          }}
          title="Canlı futbol nəticələri"
          loading="lazy"
          allowFullScreen={false}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      <div className="text-center text-xs text-text-muted mt-3">
        ScoreBat tərəfindən
      </div>
    </div>
  );
}
