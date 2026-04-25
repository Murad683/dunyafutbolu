import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/olke-futbolu/milli-komanda")({
  head: () => ({
    meta: [
      { title: "Milli Komanda | Dünya Futbolu" },
      {
        name: "description",
        content:
          "Azərbaycan Milli Futbol Komandasının ən son xəbərləri, matç hesabatları və heyət açıqlamaları.",
      },
    ],
  }),
  component: MilliKomandaPage,
});

function MilliKomandaPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="milli-komanda"
        categoryLabel="Milli Komanda"
        description="Azərbaycan Milli Futbol Komandasının xəbər və hesabatları"
      />
    </Layout>
  );
}
