import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SearchBar } from "./SearchBar";
import { clsx } from "clsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to?: string;
  isLabel?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function MobileMenu({ isOpen, onClose }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const header = document.querySelector('header');
      if (header) header.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const header = document.querySelector('header');
      if (header) header.style.paddingRight = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const groups: NavGroup[] = [
    {
      label: "Ölkə futbolu",
      items: [
        { label: "Premyer Liqa", to: "/olke-futbolu/premyer-liqa" },
        { label: "I Liqa", to: "/olke-futbolu/i-liqa" },
        { label: "Azərbaycan Kuboku", to: "/olke-futbolu/azerbaycan-kuboku" },
        { label: "Milli Komanda", to: "/olke-futbolu/milli-komanda" },
      ],
    },
    {
      label: "Dünya futbolu",
      items: [
        { label: "Top Liqalar", isLabel: true },
        { label: "İngiltərə Premyer Liqası", to: "/dunya-futbolu/ingiltere" },
        { label: "İspaniya La Liqası", to: "/dunya-futbolu/ispaniya" },
        { label: "İtaliya Seriya A", to: "/dunya-futbolu/italiya" },
        { label: "Almaniya Bundesliqa", to: "/dunya-futbolu/almaniya" },
        { label: "Çempionlar Liqası", to: "/dunya-futbolu/chempionlar-liqasi" },
      ],
    },
  ];

  const flatLinks: NavItem[] = [
    { label: "Transferlər", to: "/transferler" },
    { label: "Video", to: "/video" },
    { label: "Əlaqə", to: "/elaqe" },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[90] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Naviqasiya menyusu"
    >
      <button
        type="button"
        aria-label="Menyunu bağla"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in"
      />
      <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-[360px] bg-surface-white shadow-modal flex flex-col animate-slide-up overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border shrink-0">
          <span className="font-bold text-text-primary">Menyu</span>
          <button
            onClick={onClose}
            aria-label="Bağla"
            className="p-2 -mr-2 rounded-button hover:bg-surface-light text-text-secondary"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-surface-divider">
          <SearchBar variant="mobile" onNavigate={onClose} />
        </div>

        <nav className="flex-1 px-2 py-2">
          <Link
            to="/"
            onClick={onClose}
            className="block w-full text-left px-4 py-3 rounded-button text-brand-red font-semibold"
          >
            Ana səhifə
          </Link>

          {groups.map((group) => {
            const isSectionOpen = openSection === group.label;
            return (
              <div key={group.label} className="border-t border-surface-divider/60">
                <button
                  onClick={() => setOpenSection(isSectionOpen ? null : group.label)}
                  aria-expanded={isSectionOpen}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-text-primary font-medium"
                >
                  {group.label}
                  <ChevronDown
                    size={18}
                    className={clsx("transition-transform", isSectionOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>
                {isSectionOpen && (
                  <div className="pb-2 animate-slide-down">
                    {group.items.map((item, i) =>
                      item.isLabel ? (
                        <div
                          key={i}
                          className="px-6 pt-2 pb-1 text-[0.65rem] font-bold uppercase tracking-wider text-text-muted"
                        >
                          {item.label}
                        </div>
                      ) : (
                        <Link
                          key={i}
                          to={item.to!}
                          onClick={onClose}
                          className="block w-full text-left px-6 py-2.5 text-sm text-text-secondary hover:bg-surface-light hover:text-brand-red transition-colors"
                          activeProps={{
                            className:
                              "block w-full text-left px-6 py-2.5 text-sm text-brand-red font-semibold bg-surface-light transition-colors",
                          }}
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {flatLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to!}
              onClick={onClose}
              className="block w-full text-left px-4 py-3.5 text-text-primary font-medium border-t border-surface-divider/60"
              activeProps={{
                className:
                  "block w-full text-left px-4 py-3.5 text-brand-red font-semibold border-t border-surface-divider/60",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>,
    document.body,
  );
}
