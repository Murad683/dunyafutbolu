import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/olke-futbolu/premyer-liqa")({
  head: () => ({
    meta: [
      { title: "Premyer Liqa | Dünya Futbolu" },
      {
        name: "description",
        content: "Azərbaycan Premyer Liqasının ən son xəbərləri, nəticələri və təhlilləri.",
      },
    ],
  }),
  component: PremyerLiqaPage,
});

function PremyerLiqaPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="premyer-liqa"
        categoryLabel="Premyer Liqa"
        description="Azərbaycan futbolunun ən yüksək liqası — 8 komanda, 1 çempion"
      />
    </Layout>
  );
}
