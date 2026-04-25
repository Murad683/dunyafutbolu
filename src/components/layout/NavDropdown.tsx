import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";

interface DropdownChild {
  type: "label" | "item" | "divider";
  text?: string;
  to?: string;
  onClick?: () => void;
}

interface NavDropdownProps {
  label: string;
  items: DropdownChild[];
  /** Base path for active state detection on the parent trigger (e.g. "/olke-futbolu") */
  basePath?: string;
}

export function NavDropdown({ label, items, basePath }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click / Escape (touch-friendly)
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Detect if any child route under basePath is active
  const isRouteActive =
    basePath && typeof window !== "undefined"
      ? window.location.pathname.startsWith(basePath)
      : false;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={clsx(
          "flex items-center gap-1 font-medium text-sm px-3 py-2 rounded-button transition-colors hover:text-brand-red hover:bg-surface-light",
          isRouteActive
            ? "text-brand-red font-semibold border-b-2 border-brand-red rounded-none"
            : "text-text-primary",
        )}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden
          className={clsx("transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-40">
          <div className="shadow-dropdown bg-surface-white border border-surface-border rounded-card min-w-[240px] py-2 animate-slide-down">
            {items.map((item, i): ReactNode => {
              if (item.type === "divider") {
                return <div key={i} className="my-1.5 border-t border-surface-divider" />;
              }
              if (item.type === "label") {
                return (
                  <div
                    key={i}
                    className="px-4 py-1.5 text-[0.6875rem] font-bold tracking-wider uppercase text-text-muted"
                  >
                    {item.text}
                  </div>
                );
              }
              // If `to` is provided, render as a <Link>; otherwise fall back to <button>
              if (item.to) {
                return (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-light hover:text-brand-red transition-colors"
                    activeProps={{
                      className:
                        "block w-full text-left px-4 py-2.5 text-sm text-brand-red font-semibold bg-surface-light transition-colors",
                    }}
                  >
                    {item.text}
                  </Link>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-light hover:text-brand-red transition-colors"
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
