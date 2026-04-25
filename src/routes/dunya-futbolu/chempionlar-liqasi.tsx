import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/dunya-futbolu/chempionlar-liqasi")({
  head: () => ({
    meta: [
      { title: "Çempionlar Liqası | Dünya Futbolu" },
      {
        name: "description",
        content:
          "UEFA Çempionlar Liqasının ən son xəbərləri, pley-off cütləri və matç hesabatları.",
      },
    ],
  }),
  component: ChempionlarLiqasiPage,
});

function ChempionlarLiqasiPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="chempionlar-liqasi"
        categoryLabel="Çempionlar Liqası"
        description="Avropanın ən nüfuzlu klublar yarışı — UEFA Çempionlar Liqası"
        accentColor="#001D5B"
        featured
      />
    </Layout>
  );
}
