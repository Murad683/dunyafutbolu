import { LiveScores } from "./LiveScores";
import { PopularNews } from "./PopularNews";
import { SidebarAdBanner } from "./SidebarAdBanner";

export function Sidebar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="hidden lg:block">
        <LiveScores />
      </div>
      <PopularNews />
      <SidebarAdBanner />
    </div>
  );
}
