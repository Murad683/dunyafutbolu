import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/dunya-futbolu/ingiltere")({
  head: () => ({
    meta: [
      { title: "İngiltərə Premyer Liqası | Dünya Futbolu" },
      {
        name: "description",
        content:
          "İngiltərə Premyer Liqasının ən son xəbərləri, transfer söhbətləri və matç nəticələri.",
      },
    ],
  }),
  component: IngilterePage,
});

function IngilterePage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="ingiltere"
        categoryLabel="İngiltərə Premyer Liqası"
        description="Dünyanın ən izlənilən futbol liqası — 20 komanda, sonsuz həyəcan"
        accentColor="#3D195B"
      />
    </Layout>
  );
}
