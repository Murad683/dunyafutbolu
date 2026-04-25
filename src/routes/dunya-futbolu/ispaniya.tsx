import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/dunya-futbolu/ispaniya")({
  head: () => ({
    meta: [
      { title: "İspaniya La Liqası | Dünya Futbolu" },
      {
        name: "description",
        content:
          "La Liqa xəbərləri — Real Madrid, Barselona və digər İspaniya klublarının ən son yenilikləri.",
      },
    ],
  }),
  component: IspaniyaPage,
});

function IspaniyaPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="ispaniya"
        categoryLabel="İspaniya La Liqası"
        description="Texniki futbolun beşiyi — Barselona, Real Madrid və daha çox"
        accentColor="#E8483A"
      />
    </Layout>
  );
}
