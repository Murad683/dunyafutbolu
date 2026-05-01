import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { clsx } from "clsx";
import type { Category } from "@/types/api";

interface CategoryTab {
  slug: string;
  label: string;
}

interface Props {
  active: string | null;
  onChange: (categorySlug: string | null) => void;
}

const ALL_LABEL = "Hamısı";

export function CategoryFilters({ active, onChange }: Props) {
  const [tabs, setTabs] = useState<CategoryTab[]>([]);

  useEffect(() => {
    let cancelled = false;

    api
      .get<Category[]>("/categories")
      .then((res) => {
        if (!cancelled && res.data.length > 0) {
          // Only show child categories (those with a parent) as filter tabs
          const childCats = res.data.filter((c) => c.parent);
          setTabs(childCats.map((c) => ({ slug: c.slug, label: c.label })));
        }
      })
      .catch(() => {
        console.warn("[CategoryFilters] API unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar"
      role="tablist"
      aria-label="Kateqoriya filtrləri"
    >
      <FilterChip
        label={ALL_LABEL}
        active={active === null}
        onClick={() => onChange(null)}
      />
      {tabs.map((tab) => (
        <FilterChip
          key={tab.slug}
          label={tab.label}
          active={active === tab.slug}
          onClick={() => onChange(tab.slug)}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "shrink-0 px-3.5 py-1.5 rounded-pill text-sm font-medium transition-colors border",
        active
          ? "bg-brand-red text-text-inverse border-brand-red"
          : "bg-surface-white text-text-secondary border-surface-border hover:border-brand-red hover:text-brand-red",
      )}
    >
      {label}
    </button>
  );
}
