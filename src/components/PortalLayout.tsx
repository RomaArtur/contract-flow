import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PORTAL_CLIENT_ID } from "@/data/mock";
import { getClient, portalContractsFor } from "@/data/store";

export function PortalLayout({ children }: { children: ReactNode }) {
  const client = getClient(PORTAL_CLIENT_ID);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const match = pathname.match(/^\/portal\/([^/]+)/);
  const fromUrl = match?.[1];
  const contracts = portalContractsFor(PORTAL_CLIENT_ID);
  const activeId =
    fromUrl && contracts.some((c) => c.id === fromUrl) ? fromUrl : (contracts[0]?.id ?? "");

  const nav = activeId
    ? [
        { to: "/portal/$id" as const, params: { id: activeId }, label: "Contrato" },
        { to: "/portal/$id" as const, params: { id: activeId }, label: "Status" },
        { to: "/portal/$id/documento" as const, params: { id: activeId }, label: "Documento" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/portal" className="text-sm font-semibold text-foreground">
            Área do cliente
          </Link>
          <p className="text-xs text-muted-foreground">{client?.nome}</p>
        </div>
        {nav.length ? (
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2 px-4 pb-3">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={item.params}
                activeOptions={{ exact: item.label !== "Documento" }}
                activeProps={{ className: "border border-foreground px-2 py-1 text-xs" }}
                inactiveProps={{
                  className: "border border-border px-2 py-1 text-xs text-muted-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-3xl space-y-5 p-4 md:p-6">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-8">
        <Link to="/" className="text-xs underline text-muted-foreground">
          Voltar à área administrativa
        </Link>
      </footer>
    </div>
  );
}
