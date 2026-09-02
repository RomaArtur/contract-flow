import { Outlet, useChildMatches } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Renders the nested route when TanStack nests e.g. `$id.analise` under `$id`. */
export function ChildOutlet({ children }: { children: ReactNode }) {
  const nested = useChildMatches();
  if (nested.length > 0) return <Outlet />;
  return children;
}
