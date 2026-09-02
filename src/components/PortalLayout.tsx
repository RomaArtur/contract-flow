import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { getClient, PORTAL_CLIENT_ID } from "@/data/mock";

export function PortalLayout({ children }: { children: ReactNode }) {
  const client = getClient(PORTAL_CLIENT_ID);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/portal" className="text-sm font-semibold text-foreground">
            Área do cliente
          </Link>
          <p className="text-xs text-muted-foreground">{client?.nome}</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl space-y-5 p-4 md:p-6">{children}</main>
    </div>
  );
}
