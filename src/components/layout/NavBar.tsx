import { Link } from "@tanstack/react-router";
import { NavDropdown } from "./NavDropdown";

export function NavBar() {
  const olkeItems = [
    { type: "item" as const, text: "Premyer Liqa", to: "/olke-futbolu/premyer-liqa" },
    { type: "item" as const, text: "I Liqa", to: "/olke-futbolu/i-liqa" },
    { type: "item" as const, text: "Azərbaycan Kuboku", to: "/olke-futbolu/azerbaycan-kuboku" },
    { type: "item" as const, text: "Milli Komanda", to: "/olke-futbolu/milli-komanda" },
  ];

  const dunyaItems = [
    { type: "label" as const, text: "Top Liqalar" },
    { type: "item" as const, text: "İngiltərə Premyer Liqası", to: "/dunya-futbolu/ingiltere" },
    { type: "item" as const, text: "İspaniya La Liqası", to: "/dunya-futbolu/ispaniya" },
    { type: "item" as const, text: "İtaliya Seriya A", to: "/dunya-futbolu/italiya" },
    { type: "item" as const, text: "Almaniya Bundesliqa", to: "/dunya-futbolu/almaniya" },
    { type: "divider" as const },
    { type: "item" as const, text: "Çempionlar Liqası", to: "/dunya-futbolu/chempionlar-liqasi" },
  ];

  return (
    <nav className="flex items-center gap-1">
      <Link
        to="/"
        className="text-text-primary font-medium text-sm px-3 py-2 rounded-button transition-colors hover:text-brand-red hover:bg-surface-light"
        activeOptions={{ exact: true }}
        activeProps={{
          className:
            "text-brand-red font-semibold text-sm px-3 py-2 border-b-2 border-brand-red rounded-none",
        }}
      >
        Ana səhifə
      </Link>
      <NavDropdown label="Ölkə futbolu" items={olkeItems} basePath="/olke-futbolu" />
      <NavDropdown label="Dünya futbolu" items={dunyaItems} basePath="/dunya-futbolu" />
      <Link
        to="/transferler"
        className="text-text-primary font-medium text-sm px-3 py-2 rounded-button transition-colors hover:text-brand-red hover:bg-surface-light"
        activeProps={{
          className:
            "text-brand-red font-semibold text-sm px-3 py-2 border-b-2 border-brand-red rounded-none",
        }}
      >
        Transferlər
      </Link>
      <Link
        to="/video"
        className="text-text-primary font-medium text-sm px-3 py-2 rounded-button transition-colors hover:text-brand-red hover:bg-surface-light"
        activeProps={{
          className:
            "text-brand-red font-semibold text-sm px-3 py-2 border-b-2 border-brand-red rounded-none",
        }}
      >
        Video
      </Link>
      <Link
        to="/elaqe"
        className="text-text-primary font-medium text-sm px-3 py-2 rounded-button transition-colors hover:text-brand-red hover:bg-surface-light"
        activeProps={{
          className:
            "text-brand-red font-semibold text-sm px-3 py-2 border-b-2 border-brand-red rounded-none",
        }}
      >
        Əlaqə
      </Link>
    </nav>
  );
}
