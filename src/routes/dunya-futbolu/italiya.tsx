import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/dunya-futbolu/italiya")({
  head: () => ({
    meta: [
      { title: "İtaliya Seriya A | Dünya Futbolu" },
      {
        name: "description",
        content:
          "Seriya A xəbərləri — Yuventus, Milan, İnter və digər İtaliya klublarının ən son yenilikləri.",
      },
    ],
  }),
  component: ItaliyaPage,
});

function ItaliyaPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="italiya"
        categoryLabel="İtaliya Seriya A"
        description="Taktiki futbolun vətəni — İtaliya klublarının xəbərləri"
        accentColor="#008C45"
      />
    </Layout>
  );
}
