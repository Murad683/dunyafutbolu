import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { CategoryPageLayout } from "@/components/pages/CategoryPageLayout";

export const Route = createFileRoute("/olke-futbolu/azerbaycan-kuboku")({
  head: () => ({
    meta: [
      { title: "Azərbaycan Kuboku | Dünya Futbolu" },
      {
        name: "description",
        content: "Azərbaycan Kuboku müsabiqəsinin ən son xəbərləri və nəticələri.",
      },
    ],
  }),
  component: AzerbaycanKubokuPage,
});

function AzerbaycanKubokuPage() {
  return (
    <Layout>
      <CategoryPageLayout
        categorySlug="azerbaycan-kuboku"
        categoryLabel="Azərbaycan Kuboku"
        description="Knock-out formatında milli kubok müsabiqəsi"
      />
    </Layout>
  );
}
