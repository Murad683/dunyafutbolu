import { CATEGORIES } from "@/config/constants";
import { clsx } from "clsx";

interface Props {
  active: string | null;
  onChange: (category: string | null) => void;
}

const ALL_LABEL = "Hamısı";

export function CategoryFilters({ active, onChange }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none"
      role="tablist"
      aria-label="Kateqoriya filtrləri"
    >
      <FilterChip
        label={ALL_LABEL}
        active={active === null}
        onClick={() => onChange(null)}
      />
      {CATEGORIES.map((cat) => (
        <FilterChip
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => onChange(cat)}
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
