import { LiveScores } from "./LiveScores";
import { PopularNews } from "./PopularNews";
import { AdBanner } from "../AdBanner";

export function Sidebar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="hidden lg:block">
        <LiveScores />
      </div>
      <PopularNews />
      <AdBanner variant="skyscraper" />
    </div>
  );
}
