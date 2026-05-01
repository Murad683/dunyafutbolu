import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
}

export function SectionHeader({ title, icon: Icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="block w-1 h-5 bg-brand-red rounded-sm" aria-hidden />
      {Icon && <Icon size={18} className="text-brand-red" aria-hidden />}
      <h2 className="text-card-lg text-text-primary tracking-tight">{title}</h2>
    </div>
  );
}
