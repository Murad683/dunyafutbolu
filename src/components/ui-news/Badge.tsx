import { clsx } from "clsx";

type Variant = "red" | "gold" | "gray";

interface BadgeProps {
  label: string;
  variant?: Variant;
  size?: "sm" | "md";
}

const variantStyles: Record<Variant, string> = {
  red: "bg-brand-red text-text-inverse",
  gold: "bg-brand-gold text-text-inverse",
  gray: "bg-surface-light text-text-secondary",
};

export function Badge({ label, variant = "red", size = "md" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block rounded-badge uppercase",
        size === "md" ? "px-2.5 py-1 text-badge" : "px-2 py-0.5 text-[0.625rem] font-bold tracking-wider",
        variantStyles[variant],
      )}
    >
      {label}
    </span>
  );
}
