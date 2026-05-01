import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { NavDropdown } from "./NavDropdown";
import { api } from "@/lib/api";
import type { Category } from "@/types/api";

export function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get<Category[]>("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Find the two root categories by slug
  const olkeRoot = categories.find(c => c.slug === 'olke-futbolu');
  const dunyaRoot = categories.find(c => c.slug === 'dunya-futbolu');

  const getChildren = (parentId?: number) =>
    parentId ? categories.filter(c => c.parent?.id === parentId) : [];

  const olkeItems = getChildren(olkeRoot?.id).map(child => ({
    type: "item" as const, text: child.label, to: `/kateqoriya/${child.slug}`,
  }));

  const dunyaItems = getChildren(dunyaRoot?.id).map(child => ({
    type: "item" as const, text: child.label, to: `/kateqoriya/${child.slug}`,
  }));

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
