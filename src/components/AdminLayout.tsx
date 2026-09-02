import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/contratos", label: "Contratos" },
  { to: "/clientes", label: "Clientes" },
  { to: "/imoveis", label: "Imóveis" },
  { to: "/auditoria", label: "Auditoria" },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar md:block">
        <div className="border-b border-border px-4 py-4">
          <p className="text-sm font-semibold text-sidebar-foreground">Gestão de Contratos</p>
          <p className="text-xs text-muted-foreground">Protótipo — wireframe</p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{
                    className:
                      "block border border-border bg-sidebar-accent px-3 py-1.5 text-sm font-medium text-sidebar-accent-foreground",
                  }}
                  inactiveProps={{
                    className:
                      "block border border-transparent px-3 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 border-t border-border p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Usuário</p>
          <p className="text-sm text-sidebar-foreground">Ana Duarte</p>
          <p className="text-xs text-muted-foreground">Corretor / Administrador</p>
          <Link to="/portal" className="mt-3 block text-xs underline text-muted-foreground">
            Ver área do cliente
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border px-4 py-2 md:hidden">
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "border border-foreground px-2 py-1 text-xs" }}
                inactiveProps={{
                  className: "border border-border px-2 py-1 text-xs text-muted-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
