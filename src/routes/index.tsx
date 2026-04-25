import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/components/homepage/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dünya Futbolu — Futbol xəbərləri və canlı nəticələr" },
      {
        name: "description",
        content:
          "Dünya Futbolu — Azərbaycanın futbol portalı. Premyer Liqa, Çempionlar Liqası, transferlər və canlı nəticələr.",
      },
      { property: "og:title", content: "Dünya Futbolu — Futbol xəbərləri və canlı nəticələr" },
      {
        property: "og:description",
        content: "Ən son futbol xəbərləri, canlı nəticələr və populyar mövzular bir yerdə.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
