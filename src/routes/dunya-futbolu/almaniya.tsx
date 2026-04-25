import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/dunya-futbolu/almaniya")({
  head: () => ({
    meta: [
      { title: "Almaniya Bundesliqa | Dünya Futbolu" },
      {
        name: "description",
        content:
          "Bundesliqa xəbərləri — Bavariya, Borussiya Dortmund və digər Almaniya klublarının ən son yenilikləri.",
      },
    ],
  }),
  component: AlmaniyaPage,
});

function AlmaniyaPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="almaniya"
        categoryLabel="Almaniya Bundesliqa"
        description="Azarkeş rekordlarının liqası — Bundesliqa xəbərləri"
        accentColor="#D20515"
      />
    </Layout>
  );
}
