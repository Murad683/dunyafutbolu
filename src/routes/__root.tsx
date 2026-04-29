import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import "../styles.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Səhifə tapılmadı</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Axtardığınız səhifə mövcud deyil və ya köçürülüb.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-foreground">⚠️</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Xəta baş verdi</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Gözlənilməz xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."}
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Yenidən cəhd edin
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dünya Futbolu" },
      { name: "description", content: "Azərbaycanın futbol portalı - xəbərlər və canlı nəticələr." },
      { name: "author", content: "Dünya Futbolu" },
      { property: "og:title", content: "Dünya Futbolu" },
      { property: "og:description", content: "Azərbaycanın futbol portalı - xəbərlər və canlı nəticələr." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Dünya Futbolu" },
      { name: "twitter:description", content: "Azərbaycanın futbol portalı - xəbərlər və canlı nəticələr." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fac2b5d7-8f8a-4a02-ac77-fa4cc1a3307c/id-preview-e732beed--2a3d5785-897c-4dbc-a403-516c1cd08d53.lovable.app-1777121312725.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fac2b5d7-8f8a-4a02-ac77-fa4cc1a3307c/id-preview-e732beed--2a3d5785-897c-4dbc-a403-516c1cd08d53.lovable.app-1777121312725.png" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="az">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
