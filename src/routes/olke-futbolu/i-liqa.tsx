import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/olke-futbolu/i-liqa")({
  head: () => ({
    meta: [
      { title: "I Liqa | Dünya Futbolu" },
      {
        name: "description",
        content: "Azərbaycan I Liqasının ən son xəbərləri və nəticələri.",
      },
    ],
  }),
  component: ILiqaPage,
});

function ILiqaPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="i-liqa"
        categoryLabel="I Liqa"
        description="Premyer Liqaya çıxış uğrunda mübarizə"
      />
    </Layout>
  );
}
