import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dunya-futbolu/")({
  loader: () => {
    throw redirect({ to: "/dunya-futbolu/ingiltere" });
  },
});
