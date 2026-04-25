import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/olke-futbolu/")({
  loader: () => {
    throw redirect({ to: "/olke-futbolu/premyer-liqa" });
  },
});
